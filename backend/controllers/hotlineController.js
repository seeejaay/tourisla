const e = require("express");
const {
  createHotline,
  editHotline,
  deleteHotline,
  getAllHotlines,
  getHotlineById,
} = require("../models/hotlineModel.js");

const createHotlineController = async (req, res) => {
    try {
        const { municipality, type, contact_number, address } = req.body;
        
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
        const { municipality, type, contact_number, address } = req.body;
        
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