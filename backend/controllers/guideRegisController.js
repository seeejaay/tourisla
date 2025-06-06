const e = require("express");
const {
  createGuideRegis,
  editGuideRegis,
  deleteGuideRegis,
  getAllGuideRegis,
  getGuideRegisById,
} = require("../models/guideRegisModel.js");

// enum for sex types: 'MALE', 'FEMALE'
// enum for application status types: 'PENDING', 'APPROVED', 'REJECTED'

const createGuideRegisController = async (req, res) => {
  try {
    let {
      first_name,
      last_name,
      birth_date,
      sex,
      mobile_number,
      email,
      profile_picture,
      reason_for_applying,
      application_status,
    } = req.body;
    first_name = first_name.toUpperCase();
    last_name = last_name.toUpperCase();
    sex = sex.toUpperCase();
    email = email.toUpperCase();
    reason_for_applying = reason_for_applying.toUpperCase();
    application_status = application_status.toUpperCase();

    const guideRegis = await createGuideRegis({
      first_name,
      last_name,
      birth_date,
      sex,
      mobile_number,
      email,
      profile_picture,
      reason_for_applying,
      application_status,
    });
    console.log("Tour Guide Application Created Successfully");
    res.json(guideRegis);
  } catch (err) {
    console.log(error);
    res.send(errror);
  }
};

const editGuideRegisController = async (req, res) => {
  try {
    const { guideId } = req.params;
    let {
      first_name,
      last_name,
      birth_date,
      sex,
      mobile_number,
      email,
      profile_picture,
      reason_for_applying,
      application_status,
    } = req.body;

    first_name = first_name.toUpperCase();
    last_name = last_name.toUpperCase();
    birth_date = birth_date.toUpperCase();
    sex = sex.toUpperCase();
    email = email.toUpperCase();
    reason_for_applying = reason_for_applying.toUpperCase();
    application_status = application_status.toUpperCase();

    const guideRegis = await editGuideRegis(guideId, {
      first_name,
      last_name,
      birth_date,
      sex,
      mobile_number,
      email,
      profile_picture,
      reason_for_applying,
      application_status,
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
