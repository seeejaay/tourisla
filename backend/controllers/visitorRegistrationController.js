const QRCode = require("qrcode");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const {
  createVisitorRegistration,
  createVisitorGroupMembers,
  isUniqueCodeTaken,
  getVisitorByUniqueCode,
  getUserAttractionId,
  logAttractionVisitByRegistration,
  getQRCodebyUserId,
  getVisitorHistoryByUserId,
  getVisitorGroupMembersByRegistrationId,
} = require("../models/visitorRegistrationModel");

const db = require("../db/index");

// ✅ AWS S3 client setup
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
  let result = "";
  for (let i = 0; i < 3; i++)
    result += letters[Math.floor(Math.random() * letters.length)];
  for (let i = 0; i < 3; i++)
    result += numbers[Math.floor(Math.random() * numbers.length)];
  return result;
};

const generateUniqueCode = async () => {
  let code,
    taken = true;
  while (taken) {
    code = generateCustomCode();
    taken = await isUniqueCodeTaken(code);
  }
  return code;
};

// ✅ Register Visitor + Upload QR
const registerVisitorController = async (req, res) => {
  try {
    const { groupMembers } = req.body;
    const userId = req.session.user?.user_id ?? req.session.user?.id;
    if (
      !groupMembers ||
      !Array.isArray(groupMembers) ||
      groupMembers.length === 0
    ) {
      return res.status(400).json({ error: "Group members are required" });
    }

    const uniqueCode = await generateUniqueCode();
    const qrData = `${uniqueCode}`;
    const qrBuffer = await QRCode.toBuffer(qrData);

    const s3Key = `visitor_qrcodes/${Date.now()}_${uniqueCode}.png`;
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: s3Key,
      Body: qrBuffer,
      ContentType: "image/png",
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const qrCodeUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    const registration = await createVisitorRegistration({
      unique_code: uniqueCode,
      qr_code_url: qrCodeUrl,
      user_id: userId,
    });

    const members = await createVisitorGroupMembers(
      registration.id,
      groupMembers
    );

    res.status(201).json({
      message: "Visitor group registered successfully",
      registration,
      members,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// // Check-in using registration_id
const manualCheckInController = async (req, res) => {
  try {
    const { unique_code } = req.body;

    const userId = req.session.user;
    console.log("User ID:", userId);
    if (!userId) {
      return res
        .status(403)
        .json({ error: "Invalid session: missing user ID." });
    }

    const attractionId = await getUserAttractionId(userId.id ?? userId.user_id);

    if (!attractionId) {
      return res
        .status(403)
        .json({ error: "Missing attraction ID for the user." });
    }

    if (!unique_code) {
      return res.status(400).json({ error: "Unique code is required." });
    }

    const registration = await getVisitorByUniqueCode(
      unique_code.trim().toUpperCase()
    );

    if (!registration) {
      return res
        .status(404)
        .json({ error: "Visitor not found with that code." });
    }

    // Get group members from that registration
    const membersResult = await db.query(
      `SELECT * FROM visitor_group_members WHERE registration_id = $1`,
      [registration.id]
    );
    const groupMembers = membersResult.rows;

    if (groupMembers.length === 0) {
      return res
        .status(404)
        .json({ error: "No group members found for this registration." });
    }

    // Check if any member has already checked in today
    const today = new Date().toISOString().split("T")[0];
    const existingLogCheck = await db.query(
      `SELECT 1 FROM attraction_visitor_logs 
       WHERE  registration_id = $1 
         AND tourist_spot_id = $2 
         AND DATE(visit_date) = $3
       LIMIT 1`,
      [registration.id, attractionId, today]
    );

    if (existingLogCheck.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "This group has already checked in today." });
    }

    // Insert logs for all members
    const logs = await logAttractionVisitByRegistration({
      registrationId: registration.id,
      scannedByUserId: userId,
      touristSpotId: attractionId,
      userId: registration.user_id, // Pass the user_id from registration
    });

    return res.status(200).json({
      message: "Visitor group checked in manually.",
      registration,
      logs,
    });
  } catch (error) {
    console.error("Manual check-in error:", error);
    res.status(500).json({ error: "Internal server error during check-in." });
  }
};

const getVisitorGroupMembersController = async (req, res) => {
  try {
    const uniqueCode = req.params.unique_code?.trim().toUpperCase();
    console.log("🔍 Checking for code:", uniqueCode);

    if (!uniqueCode) {
      return res.status(400).json({ error: "Unique code is required." });
    }

    const registration = await getVisitorByUniqueCode(uniqueCode);

    if (!registration) {
      return res.status(404).json({ error: "Visitor registration not found." });
    }

    const membersResult = await db.query(
      `SELECT * FROM visitor_group_members WHERE registration_id = $1`,
      [registration.id]
    );

    return res.status(200).json({
      message: "Visitor group members fetched successfully.",
      registration,
      members: membersResult.rows,
    });
  } catch (error) {
    console.error("Error fetching visitor group members:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const registerWalkInVisitorController = async (req, res) => {
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
      return res.status(400).json({ error: "Group members are required." });
    }

    const attractionId = await getUserAttractionId(userId);

    if (!attractionId) {
      return res
        .status(403)
        .json({ error: "Missing attraction ID for the user." });
    }

    const uniqueCode = await generateUniqueCode();
    const qrData = `${uniqueCode}`;
    const qrBuffer = await QRCode.toBuffer(qrData);

    const s3Key = `visitor_qrcodes/${Date.now()}_${uniqueCode}.png`;
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: s3Key,
      Body: qrBuffer,
      ContentType: "image/png",
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const qrCodeUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    // ✅ Create the registration
    const registration = await createVisitorRegistration({
      unique_code: uniqueCode,
      qr_code_url: qrCodeUrl,
    });

    // ✅ Add members
    const members = await createVisitorGroupMembers(
      registration.id,
      groupMembers
    );

    // ✅ Log the group check-in (only 1 row in logs)
    const logs = await logAttractionVisitByRegistration({
      registrationId: registration.id,
      scannedByUserId: userId,
      touristSpotId: attractionId,
      userId: registration.user_id, // Pass the user_id from registration
    });

    return res.status(201).json({
      message: "Walk-in visitor group registered and logged successfully.",
      registration,
      members,
      logs,
    });
  } catch (error) {
    console.error("Walk-in registration error:", error);
    res
      .status(500)
      .json({ error: "Internal server error during walk-in registration." });
  }
};

const getVisitorResultController = async (req, res) => {
  try {
    // Accept from query, body, or params for flexibility
    const uniqueCode =
      req.query.unique_code?.trim().toUpperCase() ||
      req.body.unique_code?.trim().toUpperCase() ||
      req.params.unique_code?.trim().toUpperCase();
    const name = req.query.name?.trim() || req.body.name?.trim();

    let registration;
    if (uniqueCode) {
      registration = await getVisitorByUniqueCode(uniqueCode);
    } else if (name) {
      // Find registration by member name (case-insensitive, trimmed)
      const memberResult = await db.query(
        `SELECT registration_id FROM visitor_group_members WHERE TRIM(LOWER(name)) = TRIM(LOWER($1)) ORDER BY registration_id DESC LIMIT 1`,
        [name.toLowerCase()]
      );
      if (memberResult.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "No visitor entry found with that name." });
      }
      const registrationId = memberResult.rows[0].registration_id;
      const regResult = await db.query(
        `SELECT * FROM visitor_registrations WHERE id = $1`,
        [registrationId]
      );
      registration = regResult.rows[0];

      // Attach members to registration object for consistency
      if (registration) {
        const membersRes = await db.query(
          `SELECT * FROM visitor_group_members WHERE registration_id = $1`,
          [registration.id]
        );
        registration.members = membersRes.rows;
      }
    } else {
      return res
        .status(400)
        .json({ error: "Unique code or name is required." });
    }

    if (!registration) {
      return res.status(404).json({ error: "Visitor registration not found." });
    }

    // If registration.members is not set (unique code path), fetch and attach
    if (!registration.members) {
      const membersRes = await db.query(
        `SELECT * FROM visitor_group_members WHERE registration_id = $1`,
        [registration.id]
      );
      registration.members = membersRes.rows;
    }

    return res.status(200).json({
      registration,
    });
  } catch (error) {
    console.error("Error fetching registration result:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const getQRCodebyUserIdController = async (req, res) => {
  try {
    const userId = req.session.user?.user_id ?? req.session.user?.id;
    if (!userId) {
      return res
        .status(403)
        .json({ error: "Invalid session: missing user ID." });
    }

    const qrCodeData = await getQRCodebyUserId(userId);
    if (!qrCodeData) {
      return res
        .status(404)
        .json({ error: "QR code not found for this user." });
    }

    return res.status(200).json({
      qr_code_url: qrCodeData.qr_code_url,
      unique_code: qrCodeData.unique_code,
      message: "QR code fetched successfully.",
    });
  } catch (error) {
    console.error("Error fetching QR code by user ID:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// ✅ Visitor history for logged-in user
const visitorHistoryController = async (req, res) => {
  try {
    const userId = req.session.user?.user_id ?? req.session.user?.id;
    if (!userId) {
      return res
        .status(403)
        .json({ error: "Invalid session: missing user ID." });
    }
    const history = await getVisitorHistoryByUserId(userId);
    return res.status(200).json({
      message: "Visitor history fetched successfully.",
      history,
    });
  } catch (error) {
    console.error("Error fetching visitor history:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  registerVisitorController,
  manualCheckInController,
  getVisitorGroupMembersController,
  registerWalkInVisitorController,
  getVisitorResultController,
  getQRCodebyUserIdController,
  visitorHistoryController,
};
