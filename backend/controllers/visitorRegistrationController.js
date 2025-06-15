const QRCode = require("qrcode");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const {
  createVisitorRegistration,
  createVisitorGroupMembers,
} = require("../models/visitorRegistrationModel");

// ✅ Same S3 config style you're already using elsewhere
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const registerVisitorController = async (req, res) => {
  try {
    const { groupMembers } = req.body;

    if (!groupMembers || !Array.isArray(groupMembers) || groupMembers.length === 0) {
      return res.status(400).json({ error: "Group members are required" });
    }

    // Generate unique code
    const uniqueCode = uuidv4();

    // Generate QR Code buffer
    const qrData = `https://yourdomain.com/scan/${uniqueCode}`;
    const qrBuffer = await QRCode.toBuffer(qrData);

    // ✅ Upload QR code to S3 using your group's standard template
    const s3Key = `visitor_qrcodes/${Date.now()}_${uniqueCode}.png`;
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: s3Key,
      Body: qrBuffer,
      ContentType: "image/png",
    };

    await s3Client.send(new PutObjectCommand(uploadParams));
    const qrCodeUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    // Save registration
    const registration = await createVisitorRegistration({
      unique_code: uniqueCode,
      qr_code_url: qrCodeUrl,
    });

    // Save group members
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

module.exports = {
  registerVisitorController,
};