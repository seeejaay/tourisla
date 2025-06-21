const QRCode = require("qrcode");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const {
  createIslandEntryRegistration,
  createIslandEntryMembers,
  isIslandCodeTaken,
  getIslandEntryByCode,
  getUserPortId,
  logIslandEntryByRegistration,
} = require("../models/islandEntryRegisModel");

const db = require("../db/index");

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
     let code = '';

    for (let i = 0; i < 3; i++) {
        code += letters[Math.floor(Math.random() * letters.length)];
        code += numbers[Math.floor(Math.random() * numbers.length)];
    }

    return code;
};

const generateUniqueCode = async () => {
  let code, taken = true;
  while (taken) {
    code = generateCustomCode();
    taken = await isIslandCodeTaken(code);
  }
  return code;
};

const registerIslandEntryController = async (req, res) => {
  try {
    const { groupMembers } = req.body;

    if (!groupMembers || !Array.isArray(groupMembers) || groupMembers.length === 0) {
      return res.status(400).json({ error: "Group members are required" });
    }

    const uniqueCode = await generateUniqueCode();
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

    const registration = await createIslandEntryRegistration({
      unique_code: uniqueCode,
      qr_code_url: qrCodeUrl,
    });

    const members = await createIslandEntryMembers(registration.id, groupMembers);

    res.status(201).json({
      message: "Island entry group registered successfully",
      registration,
      members,
    });
  } catch (error) {
    console.error("Island entry registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const manualIslandEntryCheckInController = async (req, res) => {
  try {
    const { unique_code } = req.body;
    const userId = req.session.user?.user_id ?? req.session.user?.id;

    if (!userId) {
      return res.status(403).json({ error: "Invalid session: missing user ID." });
    }

    if (!unique_code) {
      return res.status(400).json({ error: "Unique code is required." });
    }

    const registration = await getIslandEntryByCode(unique_code.trim().toUpperCase());

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
      return res.status(409).json({ error: "This group has already entered today." });
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


module.exports = {
  registerIslandEntryController,
  manualIslandEntryCheckInController,
};
