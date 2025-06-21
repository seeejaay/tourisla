// const QRCode = require("qrcode");
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// const {
//   createVisitorRegistration,
//   createVisitorGroupMembers,
//   isUniqueCodeTaken,
//   getVisitorByUniqueCode,
//   logAttractionVisitor,
//   getUserById,
// } = require("../models/visitorRegistrationModel");

// const db = require("../db/index");

// // ✅ AWS S3 config
// const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// const generateCustomCode = () => {
//   const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//   const numbers = '0123456789';
//   let result = '';
//   for (let i = 0; i < 3; i++) result += letters[Math.floor(Math.random() * letters.length)];
//   for (let i = 0; i < 3; i++) result += numbers[Math.floor(Math.random() * numbers.length)];
//   return result;
// };

// const generateUniqueCode = async () => {
//   let code, taken = true;
//   while (taken) {
//     code = generateCustomCode();
//     taken = await isUniqueCodeTaken(code);
//   }
//   return code;
// };

// const registerVisitorController = async (req, res) => {
//   try {
//     const { groupMembers } = req.body;

//     if (!groupMembers || !Array.isArray(groupMembers) || groupMembers.length === 0) {
//       return res.status(400).json({ error: "Group members are required" });
//     }

//     const uniqueCode = await generateUniqueCode();
//     const qrData = `https://yourdomain.com/scan/${uniqueCode}`;
//     const qrBuffer = await QRCode.toBuffer(qrData);

//     const s3Key = `visitor_qrcodes/${Date.now()}_${uniqueCode}.png`;
//     const uploadParams = {
//       Bucket: process.env.AWS_S3_BUCKET,
//       Key: s3Key,
//       Body: qrBuffer,
//       ContentType: "image/png",
//     };

//     await s3Client.send(new PutObjectCommand(uploadParams));
//     const qrCodeUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

//     const registration = await createVisitorRegistration({
//       unique_code: uniqueCode,
//       qr_code_url: qrCodeUrl,
//     });

//     const members = await createVisitorGroupMembers(registration.id, groupMembers);

//     res.status(201).json({
//       message: "Visitor group registered successfully",
//       registration,
//       members,
//     });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const manualCheckInController = async (req, res) => {
//   try {
//     const { unique_code } = req.body;

//     // ✅ Check if session and user info exist
//     if (!req.session.user || (!req.session.user.user_id && !req.session.user.id)) {
//       return res.status(403).json({ error: "Invalid session: missing user_id." });
//     }

//     const userId = req.session.user.user_id ?? req.session.user.id;
//     const attractionId = req.session.user.attraction_id;

//     if (!unique_code) {
//       return res.status(400).json({ error: "Unique code is required." });
//     }

//     const visitor = await getVisitorByUniqueCode(unique_code.trim().toUpperCase());

//     if (!visitor) {
//       return res.status(404).json({ error: "Visitor not found with that code." });
//     }

//     // ✅ Check if already checked in today
//     const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
//     const { rows } = await require('../db/index').query(
//       `SELECT 1 FROM attraction_visitor_logs 
//        WHERE group_member_id = ANY($1::int[]) 
//          AND tourist_spot_id = $2 
//          AND DATE(visit_date) = $3
//        LIMIT 1`,
//       [visitor.id, attractionId, today]
//     );

//     if (rows.length > 0) {
//       return res.status(409).json({ error: "Visitor has already checked in today." });
//     }

//     // ✅ Proceed with check-in
//     const log = await logAttractionVisitor({
//       visitorId: visitor.id,
//       userId,
//       attractionId,
//     });

//     return res.status(200).json({
//       message: "Visitor checked in manually.",
//       visitor,
//       log,
//     });
//   } catch (error) {
//     console.error("Manual check-in error:", error);
//     res.status(500).json({ error: "Internal server error during check-in." });
//   }
// };


// module.exports = {
//   registerVisitorController,
//   manualCheckInController,
// };

const QRCode = require("qrcode");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const {
  createVisitorRegistration,
  createVisitorGroupMembers,
  isUniqueCodeTaken,
  getVisitorByUniqueCode,
  getUserAttractionId,
  logAttractionVisitByRegistration,
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
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let result = '';
  for (let i = 0; i < 3; i++) result += letters[Math.floor(Math.random() * letters.length)];
  for (let i = 0; i < 3; i++) result += numbers[Math.floor(Math.random() * numbers.length)];
  return result;
};

const generateUniqueCode = async () => {
  let code, taken = true;
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

    if (!groupMembers || !Array.isArray(groupMembers) || groupMembers.length === 0) {
      return res.status(400).json({ error: "Group members are required" });
    }

    const uniqueCode = await generateUniqueCode();
    const qrData = `https://yourdomain.com/scan/${uniqueCode}`;
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
    });

    const members = await createVisitorGroupMembers(registration.id, groupMembers);

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

// // ✅ Manual Check-in using registration_id
// const manualCheckInController = async (req, res) => {
//   try {
//     const { unique_code } = req.body;

//     const userId = req.session.user?.user_id ?? req.session.user?.id;

//     if (!userId) {
//       return res.status(403).json({ error: "Invalid session: missing user ID." });
//     }

//     const attractionId = await getUserAttractionId(userId);

//     if (!attractionId) {
//       return res.status(403).json({ error: "Missing attraction ID for the user." });
//     }

//     if (!unique_code) {
//       return res.status(400).json({ error: "Unique code is required." });
//     }

//     const registration = await getVisitorByUniqueCode(unique_code.trim().toUpperCase());

//     if (!registration) {
//       return res.status(404).json({ error: "Visitor not found with that code." });
//     }

//     const today = new Date().toISOString().split('T')[0];
//     const { rows } = await db.query(
//       `SELECT 1 FROM attraction_visitor_logs 
//        WHERE registration_id = $1 
//          AND tourist_spot_id = $2 
//          AND DATE(visit_date) = $3
//        LIMIT 1`,
//       [registration.id, attractionId, today]
//     );

//     if (rows.length > 0) {
//       return res.status(409).json({ error: "This group has already checked in today." });
//     }

//     const log = await logAttractionVisitByRegistration({
//       registrationId: registration.id,
//       scannedByUserId: userId,
//       touristSpotId: attractionId,
//     });

//     return res.status(200).json({
//       message: "Visitor group checked in manually.",
//       registration,
//       log,
//     });
//   } catch (error) {
//     console.error("Manual check-in error:", error);
//     res.status(500).json({ error: "Internal server error during check-in." });
//   }
// };

const manualCheckInController = async (req, res) => {
  try {
    const { unique_code } = req.body;

    const userId = req.session.user?.user_id ?? req.session.user?.id;

    if (!userId) {
      return res.status(403).json({ error: "Invalid session: missing user ID." });
    }

    const attractionId = await getUserAttractionId(userId);

    if (!attractionId) {
      return res.status(403).json({ error: "Missing attraction ID for the user." });
    }

    if (!unique_code) {
      return res.status(400).json({ error: "Unique code is required." });
    }

    const registration = await getVisitorByUniqueCode(unique_code.trim().toUpperCase());

    if (!registration) {
      return res.status(404).json({ error: "Visitor not found with that code." });
    }

    // Get group members from that registration
    const membersResult = await db.query(
      `SELECT * FROM visitor_group_members WHERE registration_id = $1`,
      [registration.id]
    );
    const groupMembers = membersResult.rows;

    if (groupMembers.length === 0) {
      return res.status(404).json({ error: "No group members found for this registration." });
    }

    // Check if any member has already checked in today
    const today = new Date().toISOString().split('T')[0];
    const existingLogCheck = await db.query(
      `SELECT 1 FROM attraction_visitor_logs 
       WHERE group_member_id = ANY($1::int[]) 
         AND tourist_spot_id = $2 
         AND DATE(visit_date) = $3
       LIMIT 1`,
      [groupMembers.map((m) => m.id), attractionId, today]
    );

    if (existingLogCheck.rows.length > 0) {
      return res.status(409).json({ error: "This group has already checked in today." });
    }

    // Insert logs for all members
    const logs = await logAttractionVisitByRegistration({
      groupMembers,
      scannedByUserId: userId,
      touristSpotId: attractionId,
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


module.exports = {
  registerVisitorController,
  manualCheckInController,
};

