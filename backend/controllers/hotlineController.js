const e = require("express");
const {
  createHotline,
  editHotline,
  deleteHotline,
  getAllHotlines,
  getHotlineById,
} = require("../models/hotlineModel.js");

// enum for hotline types
//   'MEDICAL',
//   'POLICE',
//   'BFP',
//   'NDRRMO',
//   'COAST_GUARD'

// enum for municipality types
//   'BANTAYAN',
//   'SANTA_FE',
//   'MADRIDEJOS'

const createHotlineController = async (req, res) => {
    try {
        let { municipality, type, contact_number, address } = req.body;

        municipality = municipality.toUpperCase();
        type = type.toUpperCase();
        contact_number = contact_number.toUpperCase();
        address = address.toUpperCase();
        
        const hotline = await createHotline({
            municipality,
            type,
            contact_number,
            address
            });

        res.json(hotline);
    } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const editHotlineController = async (req, res) => {
    try {
        const { hotlineId } = req.params;
        let { municipality, type, contact_number, address } = req.body;

        municipality = municipality.toUpperCase();
        type = type.toUpperCase();
        contact_number = contact_number.toUpperCase();
        address = address.toUpperCase();
        
        const hotline = await editHotline(hotlineId, {
            municipality,
            type,
            contact_number,
            address
            });

        res.json(hotline);
    } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const deleteHotlineController = async (req, res) => {
  try {
    const { hotlineId } = req.params;
    const hotline = await deleteHotline(hotlineId);

    res.json(hotline);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewHotlinesController = async (req, res) => {
  try {
    const hotlines = await getAllHotlines();

    res.json(hotlines);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewHotlineByIdController = async (req, res) => {
  try {
    const { hotlineId } = req.params;
    const hotline = await getHotlineById(hotlineId);

    res.json(hotline);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

module.exports = {
    createHotlineController, 
    editHotlineController,
    deleteHotlineController,
    viewHotlinesController,
    viewHotlineByIdController
};