const {
  createTouristSpot,
  editTouristSpot,
  deleteTouristSpot,
  getAllTouristSpots,
  getTouristSpotById,
  uploadTouristSpotImages,
  deleteTouristSpotImages,
  getTouristSpotImages,
} = require("../models/touristSpotModel");

const { s3Client, PutObjectCommand } = require("../utils/s3.js");

const createTouristSpotController = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      barangay,
      municipality,
      province,
      longitude,
      latitude,
      opening_time,
      closing_time,
      days_open,
      entrance_fee,
      other_fees,
      contact_number,
      email,
      facebook_page,
      rules,
    } = req.body;

    const spot = await createTouristSpot({
      name: name?.toUpperCase(),
      type: type?.toUpperCase(),
      description: description?.toUpperCase(),
      barangay: barangay?.toUpperCase(),
      municipality: municipality?.toUpperCase(),
      province: province?.toUpperCase(),
      longitude,
      latitude,
      opening_time,
      closing_time,
      days_open: days_open?.toUpperCase(),
      entrance_fee,
      other_fees: other_fees?.toUpperCase(),
      contact_number,
      email,
      facebook_page,
      rules: rules?.toUpperCase(),
    });

    // Upload images to S3
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      for (const file of req.files.slice(0, 5)) {
        const s3Key = `tourist_spots/${Date.now()}_${file.originalname}`;
        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        await s3Client.send(new PutObjectCommand(uploadParams));
        const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazona
 ws.com/${s3Key}`;
        imageUrls.push(imageUrl);
      }
      await uploadTouristSpotImages(spot.id, imageUrls);
    }

    res.json(spot);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

const editTouristSpotController = async (req, res) => {
  try {
    const { touristSpotId } = req.params;
    const {
      name,
      type,
      description,
      barangay,
      municipality,
      province,
      longitude,
      latitude,
      opening_time,
      closing_time,
      days_open,
      entrance_fee,
      other_fees,
      contact_number,
      email,
      facebook_page,
      rules,
    } = req.body;

    const spot = await editTouristSpot(touristSpotId, {
      name: name?.toUpperCase(),
      type: type?.toUpperCase(),
      description: description?.toUpperCase(),
      barangay: barangay?.toUpperCase(),
      municipality: municipality?.toUpperCase(),
      province: province?.toUpperCase(),
      longitude,
      latitude,
      opening_time,
      closing_time,
      days_open: days_open?.toUpperCase(),
      entrance_fee,
      other_fees: other_fees?.toUpperCase(),
      contact_number,
      email,
      facebook_page,
      rules: rules?.toUpperCase(),
    });

    res.json(spot);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

const deleteTouristSpotController = async (req, res) => {
  try {
    const { touristSpotId } = req.params;

    // Delete associated images
    await deleteTouristSpotImages(touristSpotId);

    const result = await deleteTouristSpot(touristSpotId);
    res.json(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};
const viewTouristSpotsController = async (req, res) => {
  try {
    const spots = await getAllTouristSpots();

    // Attach main image to each spot
    for (const spot of spots) {
      const images = await getTouristSpotImages(spot.id);
      spot.image = images[0];
      // Optionally: spot.images = images;
    }

    res.json(spots);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

const viewTouristSpotByIdController = async (req, res) => {
  try {
    const { touristSpotId } = req.params;
    const spot = await getTouristSpotById(touristSpotId);
    const images = await getTouristSpotImages(touristSpotId);

    // Set the main image property for frontend compatibility

    // Optionally, include all images if you want
    // spot.images = images;
    console.log(spot);
    res.json(spot);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tourist spot" });
  }
};

module.exports = {
  createTouristSpotController,
  editTouristSpotController,
  deleteTouristSpotController,
  viewTouristSpotsController,
  viewTouristSpotByIdController,
};
