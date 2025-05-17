const e = require("express");
const {
  createGuideRegis,
  editGuideRegis,
  deleteGuideRegis,
  getAllGuideRegis,
  getGuideRegisById,
} = require("../models/guideRegisModel.js");

const createGuideRegisController = async (req, res) => {
  try {
    const { first_name, last_name, birth_date, sex, mobile_number, email, profile_picture, reason_for_applying, application_status } = req.body;

    const guideRegis = await createGuideRegis({
      first_name,
      last_name,
      birth_date,
      sex, 
      mobile_number,
      email,
      profile_picture,
      reason_for_applying,
      application_status
    });

    res.json(guideRegis);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const editGuideRegisController = async (req, res) => {
    try {
        const { guideId } = req.params;
        const { first_name, last_name, birth_date, sex, mobile_number, email, profile_picture, reason_for_applying, application_status } = req.body;
        
        const guideRegis = await editGuideRegis(guideId, {
            first_name,
            last_name,
            birth_date,
            sex, 
            mobile_number,
            email,
            profile_picture,
            reason_for_applying,
            application_status
            });

        res.json(guideRegis);
    } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const deleteGuideRegisController = async (req, res) => {
  try {
    const { guideId } = req.params;
    const guideRegis = await deleteGuideRegis(guideId);

    res.json(guideRegis);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewGuideRegisController = async (req, res) => {
  try {
    const guideRegis = await getAllGuideRegis();

    res.json(guideRegis);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewGuideRegisByIdController = async (req, res) => {
  try {
    const { guideId } = req.params;
    const guideRegis = await getGuideRegisById(guideId);

    res.json(guideRegis);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

module.exports = {
  createGuideRegisController,
  editGuideRegisController,
  deleteGuideRegisController,
  viewGuideRegisController,
  viewGuideRegisByIdController,
};