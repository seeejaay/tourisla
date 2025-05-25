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
    let { title, description, date_posted, location, category } = req.body;

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

    let { title, description, date_posted, location, image_url, category } =
      req.body;

    title = title.toUpperCase();
    description = description.toUpperCase();
    location = location.toUpperCase();
    category = category.toUpperCase();

    // Edit the announcement in the database
    const announcement = await editAnnouncement(announcementId, {
      title: title.toUpperCase(),
      description,
      date_posted,
      location: location.toUpperCase(),
      image_url,
      category: category.toUpperCase(),
    });

    res.json(announcement);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
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
