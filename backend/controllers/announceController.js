const e = require("express");
const {
  createAnnouncement,
  editAnnouncement,
  deleteAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  getAnnouncementsByCategory,
} = require("../models/announceModel.js");

const { s3Client, PutObjectCommand } = require("../utils/s3.js"); // Adjust the path as necessary
// enum for categories
//     'EVENTS',
//     'FIESTA',
//     'CULTURAL_TOURISM',
//     'ENVIRONMENTAL_COASTAL',
//     'HOLIDAY_SEASONAL',
//     'GOVERNMENT_PUBLIC_SERVICE',
//     'STORM_SURGE',
//     'TSUNAMI',
//     'GALE_WARNING',
//     'MONSOON_LOW_PRESSURE',
//     'RED_TIDE',
//     'JELLYFISH_BLOOM',
//     'FISH_KILL',
//     'PROTECTED_WILDLIFE',
//     'OIL_SPILL',
//     'COASTAL_EROSION',
//     'CORAL_BLEACHING',
//     'HEAT_WAVE',
//     'FLOOD_LANDSLIDE',
//     'DENGUE_WATERBORNE',
//     'POWER_INTERRUPTION'

const createAnnouncementController = async (req, res) => {
  try {
    let { title, description, date_posted, location, category, is_pinned } =
      req.body;

    // Validate required fields
    if (!title || !description || !date_posted || !location || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    title = title.toUpperCase();
    description = description.toUpperCase();
    location = location.toUpperCase();
    category = category.toUpperCase();
    let image_url = null;

    // Handle image upload
    if (req.file) {
      const file = req.file;
      const s3Key = `announcements/${Date.now()}_${file.originalname}`;
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      await s3Client.send(new PutObjectCommand(uploadParams));
      image_url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    }

    const announcement = await createAnnouncement({
      title,
      description,
      date_posted,
      location,
      image_url,
      category,
      is_pinned,
    });

    res.json(announcement);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

const editAnnouncementController = async (req, res) => {
  try {
    const { announcementId } = req.params;
    console.log("Edit announcement request body:", req.body);
    console.log("Edit announcement request file:", req.file);

    // Extract fields from request body
    let {
      title,
      description,
      date_posted,
      location,
      image_url,
      category,
      is_pinned,
    } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    // Convert fields to uppercase
    title = title.toUpperCase();
    description = description.toUpperCase();
    location = location ? location.toUpperCase() : "GENERAL";
    category = category.toUpperCase();

    // Handle image upload if there's a new image
    if (req.file) {
      try {
        console.log("New image file detected in update request");
        const file = req.file;
        const s3Key = `announcements/${Date.now()}_${file.originalname}`;
        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        // Add timeout and retry logic for S3 upload
        let s3Retries = 0;
        const maxS3Retries = 2;
        let s3Success = false;

        while (s3Retries <= maxS3Retries && !s3Success) {
          try {
            await s3Client.send(new PutObjectCommand(uploadParams));
            s3Success = true;
          } catch (s3Error) {
            console.error(
              `S3 upload attempt ${s3Retries + 1} failed:`,
              s3Error
            );
            if (s3Retries === maxS3Retries) {
              throw s3Error;
            }
            s3Retries++;
            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }

        image_url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
        console.log("New image uploaded to:", image_url);
      } catch (imageError) {
        console.error("Error uploading image to S3:", imageError);
        // Continue without updating the image
        console.log("Continuing with update without changing the image");
      }
    }

    // Prepare update data with all required fields
    const updateData = {
      title,
      description,
      date_posted: date_posted || new Date().toISOString().split("T")[0],
      location: location || "GENERAL",
      image_url,
      category,
      is_pinned,
    };

    console.log("Updating announcement with data:", updateData);

    // Edit the announcement in the database
    const announcement = await editAnnouncement(announcementId, updateData);

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.json(announcement);
  } catch (err) {
    console.log("Error in editAnnouncementController:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const deleteAnnouncementController = async (req, res) => {
  try {
    const { announcementId } = req.params;

    // Delete the announcement in the database
    const announcement = await deleteAnnouncement(announcementId);

    res.json(announcement);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewAnnouncementController = async (req, res) => {
  try {
    // Get all announcements from the database
    const announcements = await getAllAnnouncements();

    res.json(announcements);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewAnnouncementByIdController = async (req, res) => {
  try {
    const { announcementId } = req.params;

    // Get the announcement by ID from the database
    const announcement = await getAnnouncementById(announcementId);

    res.json(announcement);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const getByCategoryController = async (req, res) => {
  try {
    const { category } = req.params;
    const announcements = await getAnnouncementsByCategory(category);

    res.json(announcements);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

module.exports = {
  createAnnouncementController,
  editAnnouncementController,
  deleteAnnouncementController,
  viewAnnouncementController,
  viewAnnouncementByIdController,
  getByCategoryController,
};
