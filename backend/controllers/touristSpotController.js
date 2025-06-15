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

const {
  s3Client,
  PutObjectCommand,
  deleteS3Object,
} = require("../utils/s3.js");

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

    // Upload images to S3 and collect URLs
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files.slice(0, 5)) {
        const s3Key = `tourist_spots/${Date.now()}_${file.originalname}`;
        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        await s3Client.send(new PutObjectCommand(uploadParams));
        const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
        imageUrls.push(imageUrl);
      }
    }

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
      days_open,
      entrance_fee,
      other_fees: other_fees?.toUpperCase(),
      contact_number,
      email,
      facebook_page,
      rules: rules?.toUpperCase(),
      images: imageUrls, // Add images directly to the tourist spot
    });

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

    // Get current tourist spot to access existing images
    const currentSpot = await getTouristSpotById(touristSpotId);
    let images = currentSpot.images || [];

    // Handle new images if any
    if (req.files && req.files.length > 0) {
      for (const file of req.files.slice(0, 5)) {
        const s3Key = `tourist_spots/${Date.now()}_${file.originalname}`;
        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        await s3Client.send(new PutObjectCommand(uploadParams));
        const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
        images.push(imageUrl);
      }
    }

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
      days_open,
      entrance_fee,
      other_fees: other_fees?.toUpperCase(),
      contact_number,
      email,
      facebook_page,
      rules: rules?.toUpperCase(),
      images, // Include images directly
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
        const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
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

const deleteTouristSpotController = async (req, res) => {
  try {
    const { touristSpotId } = req.params;

    // Get the tourist spot to access its images
    const spot = await getTouristSpotById(touristSpotId);
    
    // Delete images from S3 if they exist
    if (spot.images && spot.images.length > 0) {
      for (const imageUrl of spot.images) {
        if (imageUrl) {
          const url = new URL(imageUrl);
          const s3Key = url.pathname.startsWith("/")
            ? url.pathname.slice(1)
            : url.pathname;

          try {
            await deleteS3Object(s3Key);
          } catch (error) {
            console.error(`Failed to delete image from S3: ${error.message}`);
          }
        }
      }
    }

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
    
    if (!spot) {
      return res.status(404).json({ error: "Tourist spot not found" });
    }
    
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
