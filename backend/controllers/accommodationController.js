const {
  createAccommodation,
  editAccommodation,
  deleteAccommodation,
  getAllAccommodations,
  getAccommodationById,
} = require("../models/accommodationModel.js");

const createAccommodationController = async (req, res) => {
  try {
    const data = req.body;
    const accommodation = await createAccommodation(data);
    res.json(accommodation);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const editAccommodationController = async (req, res) => {
  try {
    const { accommodationId } = req.params;
    const data = req.body;
    const accommodation = await editAccommodation(accommodationId, data);
    res.json(accommodation);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const deleteAccommodationController = async (req, res) => {
  try {
    const { accommodationId } = req.params;
    const accommodation = await deleteAccommodation(accommodationId);
    res.json(accommodation);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewAccommodationsController = async (req, res) => {
  try {
    const accommodations = await getAllAccommodations();
    res.json(accommodations);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewAccommodationByIdController = async (req, res) => {
  try {
    const { accommodationId } = req.params;
    const accommodation = await getAccommodationById(accommodationId);
    res.json(accommodation);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

module.exports = {
  createAccommodationController,
  editAccommodationController,
  deleteAccommodationController,
  viewAccommodationsController,
  viewAccommodationByIdController,
};
