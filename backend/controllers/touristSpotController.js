const e = require("express");

const {
  createTouristSpot,
  editTouristSpot,
  deleteTouristSpot,
  getAllTouristSpots,
  getTouristSpotById,
} = require("../models/touristSpotModel.js");

const createTouristSpotController = async (req, res) => {
  try {
    const { name, type, description, barangay, municipality, province, location, opening_time, closing_time, days_open, entrance_fee, other_fees,contact_number, email, facebook_page, rules } = req.body;
    const touristSpot = await createTouristSpot({
      name,
      type,
      description,
      barangay,
      municipality,
      province,
      location,
      opening_time,
      closing_time,
      days_open,
      entrance_fee,
      other_fees,
      contact_number,
      email,
      facebook_page,
      rules
    });
    res.json(touristSpot);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const editTouristSpotController = async (req, res) => {
  try {
    const { touristSpotId } = req.params;
    const { name, type, description, barangay, municipality, province,location, opening_time, closing_time, days_open, entrance_fee, other_fees,contact_number, email, facebook_page, rules} = req.body;
    const touristSpot = await editTouristSpot(touristSpotId, {
      name,
      type,
      description,
      barangay,
      municipality,
      province,
      location,
      opening_time,
      closing_time,
      days_open,
      entrance_fee,
      other_fees,
      contact_number,
      email,
      facebook_page,
      rules
    });
    res.json(touristSpot);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const deleteTouristSpotController = async (req, res) => {
  try {
    const { touristSpotId } = req.params;
    const touristSpot = await deleteTouristSpot(touristSpotId);
    res.json(touristSpot);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewTouristSpotsController = async (req, res) => {
  try {
    const touristSpots = await getAllTouristSpots();
    res.json(touristSpots);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewTouristSpotByIdController = async (req, res) => {
  try {
    const { touristSpotId } = req.params;
    const touristSpot = await getTouristSpotById(touristSpotId);
    res.json(touristSpot);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

module.exports = {
  createTouristSpotController,
  editTouristSpotController,
  deleteTouristSpotController,
  viewTouristSpotsController,
  viewTouristSpotByIdController,
};