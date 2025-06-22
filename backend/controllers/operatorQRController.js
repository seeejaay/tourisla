const e = require("express");
const {
  createOperatorQr,
  getOperatorQrById,
} = require("../models/operatorQRModel");

const {
  getOperatorRegisByOperatorId,
} = require("../models/operatorRegisModel.js");
const { s3Client, PutObjectCommand } = require("../utils/s3.js");

const uploadOperatorQrController = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user || user.role !== "Tour Operator") {
      return res
        .status(403)
        .json({ error: "Only Tour Operators can upload QR codes." });
    }

    const { qr_name } = req.body;

    if (!qr_name || !req.file) {
      return res
        .status(400)
        .json({ error: "QR name and image file are required." });
    }

    const file = req.file;
    const s3Key = `operator-qr-codes/${Date.now()}_${file.originalname}`;
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));
    const qr_image_url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    const newQr = await createOperatorQr({
      tour_operator_id: user.id,
      qr_name,
      qr_image_url,
    });

    res
      .status(201)
      .json({ message: "QR code uploaded successfully", data: newQr });
  } catch (error) {
    console.error("Error uploading QR:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOperatorQrController = async (req, res) => {
  try {
    const operatorId = req.params.operatorId; // <-- get from params
    console.log("Fetching QR codes for Tour Operator ID:", operatorId);

    if (!operatorId) {
      return res.status(400).json({ error: "Tour operator ID is required." });
    }

    // Optional: check user role if needed
    const user = req.session.user;
    if (!user || (user.role !== "Tour Operator" && user.role !== "Tourist")) {
      return res.status(403).json({
        error: "Only Tour Operators and Tourists can access this resource.",
      });
    }

    const operatorQrs = await getOperatorQrById(operatorId);
    console.log("Operator QR codes:", operatorQrs);
    res.status(200).json({ data: operatorQrs });
  } catch (error) {
    console.error("Error fetching operator QR codes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  uploadOperatorQrController,
  getOperatorQrController,
};
