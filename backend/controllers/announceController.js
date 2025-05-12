const e = require("express");
const { createAnnouncement, editAnnouncement, deleteAnnouncement } = require("../models/announceModel.js");

const createAnnouncementController = async (req, res) => {
  try {
    const {
      title,
      description,
      date_posted,
      location,
      image_url
    } = req.body;

    // Create the announcement in the database
    const announcement = await createAnnouncement({
      title,
      description,
      date_posted,
      location,
      image_url
    });

    res.json(announcement);

  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
}

const editAnnouncementController = async (req, res) => {
  try {
    const { announcementId } = req.params;
    const {
      title,
      description,
      date_posted,
      location,
      image_url
    } = req.body;

    // Edit the announcement in the database
    const announcement = await editAnnouncement(announcementId, {
      title,
      description,
      date_posted,
      location,
      image_url
    });

    res.json(announcement);

  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
}

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
}

module.exports = {
  createAnnouncementController,
  editAnnouncementController,
  deleteAnnouncementController
}