const db = require("../db/index");
const QRCode = require("qrcode");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getActivePrice } = require("../models/priceManageModel");
const { createPayMongoLink } = require("../models/paymongoModel");
const { updateIslandEntryPaymentStatus } = require("../models/paymongoModel");
const { getIslandEntryByCode } = require("../models/islandEntryRegisModel");
const {
  createIslandEntryRegistration,
  createIslandEntryMembers,
  isIslandCodeTaken,
  saveIslandEntryPayment,
  getLatestIslandEntryByUserId,
  logIslandEntryByRegistration,
} = require("../models/islandEntryRegisModel");
const { sendIslandEntryEmail } = require("../utils/email");
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const generateCustomCode = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  //   let result = "";
  //   for (let i = 0; i < 3; i++) result += letters[Math.floor(Math.random() * letters.length)];
  //   for (let i = 0; i < 3; i++) result += numbers[Math.floor(Math.random() * numbers.length)];
  //   return result;
  let code = "";

  for (let i = 0; i < 3; i++) {
    code += letters[Math.floor(Math.random() * letters.length)];
    code += numbers[Math.floor(Math.random() * numbers.length)];
  }

  return code;
};

const generateUniqueCode = async () => {
  let code,
    taken = true;
  while (taken) {
    code = generateCustomCode();
    taken = await isIslandCodeTaken(code);
  }
  return code;
};

const registerIslandEntryController = async (req, res) => {
  try {
    const { groupMembers, payment_method: userSelectedPaymentMethod } =
      req.body;

    if (
      !groupMembers ||
      !Array.isArray(groupMembers) ||
      groupMembers.length === 0
    ) {
      return res.status(400).json({ error: "Group members are required" });
    }

    const userId = req.session.user?.user_id ?? req.session.user?.id;
    const userEmail = req.session.user?.email; // <-- Get user email from session
    if (!userId) {
      return res
        .status(403)
        .json({ error: "Invalid session: missing user ID." });
    }

    // Step 1: Generate unique code
    const uniqueCode = await generateUniqueCode();

    // Step 2: Fetch active price and compute total fee
    const activePrice = await getActivePrice();
    const isPaymentEnabled = activePrice?.is_enabled;
    const pricePerPerson = isPaymentEnabled
      ? parseFloat(activePrice.amount)
      : 0;
    const totalFee = pricePerPerson * groupMembers.length;

    // Step 3: Determine final payment method and status
    const finalPaymentMethod = isPaymentEnabled
      ? userSelectedPaymentMethod
      : "NOT_REQUIRED";
    const finalStatus = isPaymentEnabled
      ? finalPaymentMethod === "CASH"
        ? "UNPAID"
        : "PENDING"
      : "NOT_REQUIRED";

    if (!["CASH", "ONLINE", "NOT_REQUIRED"].includes(finalPaymentMethod)) {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    // Step 4: Generate QR code
    const qrData = `https://yourdomain.com/entry-scan/${uniqueCode}`;
    const qrBuffer = await QRCode.toBuffer(qrData);
    const s3Key = `island_entry_qrcodes/${Date.now()}_${uniqueCode}.png`;
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: s3Key,
      Body: qrBuffer,
      ContentType: "image/png",
    };
    await s3Client.send(new PutObjectCommand(uploadParams));
    const qrCodeUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    // Step 5: Save registration
    const registration = await createIslandEntryRegistration({
      unique_code: uniqueCode,
      qr_code_url: qrCodeUrl,
      payment_method: finalPaymentMethod,
      status: finalStatus,
      total_fee: totalFee,
      user_id: userId,
    });

    // Step 6: Save group members
    const members = await createIslandEntryMembers(
      registration.id,
      groupMembers
    );

    // Step 7: Handle online payment if enabled
    let paymentLink = null;
    if (finalPaymentMethod === "ONLINE") {
      if (totalFee < 100) {
        return res.status(400).json({
          error:
            "Online payment is only allowed for total amounts of ₱100 and above. Please pay on-site.",
        });
      }

      const description = `Island Entry Fee for ${groupMembers.length} person(s)`;
      const paymongoData = await createPayMongoLink({
        amount: totalFee,
        referenceNumber: uniqueCode,
        description,
      });

      paymentLink = paymongoData.attributes.checkout_url;

      await saveIslandEntryPayment({
        registration_id: registration.id,
        payment_link: paymentLink,
        status: paymongoData.attributes.status.toUpperCase(),
        amount: totalFee,
        reference_num: paymongoData.attributes.reference_number,
      });
    }

    // Send email to the user with QR code and details
    if (userEmail) {
      await sendIslandEntryEmail(userEmail, uniqueCode, qrCodeUrl);
    }

    return res.status(201).json({
      message: "Island entry group registered successfully",
      registration,
      members,
      total_fee: totalFee,
      payment_link: paymentLink,
    });
  } catch (error) {
    console.error(
      "Island entry registration error:",
      error?.response?.data || error
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

const manualIslandEntryCheckInController = async (req, res) => {
  try {
    const { unique_code } = req.body;
    const userId = req.session.user?.user_id ?? req.session.user?.id;

    if (!userId) {
      return res
        .status(403)
        .json({ error: "Invalid session: missing user ID." });
    }

    if (!unique_code) {
      return res.status(400).json({ error: "Unique code is required." });
    }

    const registration = await getIslandEntryByCode(
      unique_code.trim().toUpperCase()
    );

    if (!registration) {
      return res.status(404).json({ error: "Entry not found with that code." });
    }

    const today = new Date().toISOString().split("T")[0];
    const existingLogCheck = await db.query(
      `SELECT 1 FROM island_entry_registration_logs 
       WHERE registration_id = $1 
         AND DATE(visit_date) = $2
       LIMIT 1`,
      [registration.id, today]
    );

    if (existingLogCheck.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "This group has already entered today." });
    }

    const log = await logIslandEntryByRegistration({
      registrationId: registration.id,
      scannedByUserId: userId,
    });

    return res.status(200).json({
      message: "Island entry group checked in manually.",
      registration,
      log,
    });
  } catch (error) {
    console.error("Manual island entry check-in error:", error);
    res.status(500).json({ error: "Internal server error during check-in." });
  }
};

const getIslandEntryMembersController = async (req, res) => {
  try {
    const uniqueCode = req.params.unique_code?.trim().toUpperCase();

    if (!uniqueCode) {
      return res.status(400).json({ error: "Unique code is required." });
    }

    const registration = await getIslandEntryByCode(uniqueCode);

    if (!registration) {
      return res.status(404).json({ error: "Registration not found." });
    }

    const membersResult = await db.query(
      `SELECT * FROM island_entry_registration_members WHERE registration_id = $1`,
      [registration.id]
    );

    return res.status(200).json({
      message: "Group members fetched successfully.",
      registration,
      members: membersResult.rows,
    });
  } catch (error) {
    console.error("Error fetching island entry members:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const checkPayMongoPaymentStatusController = async (req, res) => {
  try {
    const { unique_code } = req.body;

    if (!unique_code) {
      return res.status(400).json({ error: "Unique code is required" });
    }

    const code = unique_code.trim().toUpperCase();

    const registration = await getIslandEntryByCode(code);
    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    // Fetch PayMongo link data
    const response = await axios.get(
      `https://api.paymongo.com/v1/links?reference_number=${code}`,
      {
        headers: {
          accept: "application/json",
          authorization:
            "Basic " +
            Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString(
              "base64"
            ),
        },
      }
    );

    const paymentData =
      response.data.data.find((link) => link.attributes.status === "paid") ||
      response.data.data[0];

    if (!paymentData) {
      return res.status(404).json({ error: "Payment link not found" });
    }

    // Update local DBs
    await updateIslandEntryPaymentStatus({
      registration_id: registration.id,
      status: paymentData.attributes.status.toUpperCase(),
    });

    res.status(200).json({
      message: "Payment status fetched",
      paymongo_status: paymentData.attributes.status.toUpperCase(),
    });
  } catch (error) {
    console.error(
      "Manual PayMongo status check error:",
      error?.response?.data || error
    );
    res.status(500).json({ error: "Failed to check PayMongo payment status" });
  }
};

const registerIslandWalkInController = async (req, res) => {
  try {
    const { groupMembers } = req.body;
    const userId = req.session.user?.user_id ?? req.session.user?.id;

    if (!userId) {
      return res
        .status(403)
        .json({ error: "Invalid session: missing user ID." });
    }

    if (
      !groupMembers ||
      !Array.isArray(groupMembers) ||
      groupMembers.length === 0
    ) {
      return res.status(400).json({ error: "Group members are required" });
    }

    // --- Fetch active price and compute total fee ---
    const activePrice = await getActivePrice();
    const isPaymentEnabled = activePrice.is_enabled;
    let pricePerPerson = 0;

    if (isPaymentEnabled) {
      pricePerPerson = parseFloat(activePrice.amount);
    }

    const totalFee = pricePerPerson * groupMembers.length;

    const uniqueCode = await generateCustomCode(); // custom generator
    const qrData = `${uniqueCode}`;
    const qrBuffer = await QRCode.toBuffer(qrData);

    const s3Key = `island_entry_qrcodes/${Date.now()}_${uniqueCode}.png`;
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: s3Key,
      Body: qrBuffer,
      ContentType: "image/png",
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const qrCodeUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    const registration = await createIslandEntryRegistration({
      unique_code: uniqueCode,
      qr_code_url: qrCodeUrl,
      payment_method: "CASH",
      payment_status: "PAID",
      total_fee: totalFee,
      user_id: userId,
    });

    const members = await createIslandEntryMembers(
      registration.id,
      groupMembers
    );

    // ✅ Auto-log all members
    const logs = await logIslandEntryByRegistration({
      groupMembers: members,
      scannedByUserId: userId,
      registrationId: registration.id,
    });

    return res.status(201).json({
      message: "Island walk-in group registered and logged successfully.",
      registration,
      members,
      logs,
      total_fee: totalFee,
    });
  } catch (error) {
    console.error("Island walk-in registration error:", error);
    res
      .status(500)
      .json({ error: "Internal server error during walk-in registration." });
  }
};

const getLatestIslandEntryController = async (req, res) => {
  try {
    const userId = req.session.user?.user_id ?? req.session.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const entry = await getLatestIslandEntryByUserId(userId);
    if (!entry) {
      return res.status(404).json({ error: "No registration found" });
    }
    res.json(entry);
  } catch (error) {
    console.error("Error fetching latest registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const markIslandEntryPaidController = async (req, res) => {
  try {
    const { unique_code } = req.body;
    if (!unique_code)
      return res.status(400).json({ error: "Unique code is required." });

    const registration = await getIslandEntryByCode(
      unique_code.trim().toUpperCase()
    );
    if (!registration)
      return res.status(404).json({ error: "Registration not found." });

    await db.query(
      `UPDATE island_entry_registration SET status = 'PAID' WHERE id = $1`,
      [registration.id]
    );

    res.status(200).json({ message: "Payment status updated to PAID." });
  } catch (error) {
    console.error("Error marking payment as received:", error);
    res.status(500).json({ error: "Failed to update payment status." });
  }
};

module.exports = {
  registerIslandEntryController,
  manualIslandEntryCheckInController,
  getIslandEntryMembersController,
  checkPayMongoPaymentStatusController,
  registerIslandWalkInController,
  getLatestIslandEntryController,
  markIslandEntryPaidController,
};
