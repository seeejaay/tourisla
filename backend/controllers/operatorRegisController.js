const e = require("express");
const {
  createOperatorRegis,
  editOperatorRegis,
  deleteOperatorRegis,
  getAllOperatorRegis,
  getOperatorRegisById,
} = require("../models/operatorRegisModel.js");

// enum for application status 'PENDING', 'APPROVED', 'REVISION', 'REJECTED'

const createOperatorRegisController = async (req, res) => {
  try {
    let {
      operator_name,
      representative_name,
      email,
      mobile_number,
      office_address,
      application_status,
      user_id,
    } = req.body;

    const newoperator_name = operator_name.toUpperCase();
    const newrepresentative_name = representative_name.toUpperCase();
    const newemail = email.toLowerCase();
    const newoffice_address = office_address.toUpperCase();
    const newapplication_status = application_status.toUpperCase();

    const operatorRegis = await createOperatorRegis({
      operator_name: newoperator_name,
      representative_name: newrepresentative_name,
      email: newemail,
      mobile_number: mobile_number,
      office_address: newoffice_address,
      application_status: newapplication_status,
      user_id,
    });

    res.json(operatorRegis);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const editOperatorRegisController = async (req, res) => {
  try {
    const { operatorId } = req.params;
    let {
      operator_name,
      representative_name,
      email,
      mobile_number,
      office_address,
      application_status,
    } = req.body;

    operator_name = operator_name.toUpperCase();
    representative_name = representative_name.toUpperCase();
    email = email.toLowerCase();
    office_address = office_address.toUpperCase();
    application_status = application_status.toUpperCase();

    const operatorRegis = await editOperatorRegis(operatorId, {
      operator_name,
      representative_name,
      email,
      mobile_number,
      office_address,
      application_status,
    });

    res.json(operatorRegis);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const deleteOperatorRegisController = async (req, res) => {
  try {
    const { operatorId } = req.params;
    const operatorRegis = await deleteOperatorRegis(operatorId);
    res.json(operatorRegis);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewAllOperatorRegisController = async (req, res) => {
  try {
    const operatorRegis = await getAllOperatorRegis();
    res.json(operatorRegis);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewOperatorRegisByIdController = async (req, res) => {
  try {
    const { operatorId } = req.params;
    const operatorRegis = await getOperatorRegisById(operatorId);
    res.json(operatorRegis);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

module.exports = {
  createOperatorRegisController,
  editOperatorRegisController,
  deleteOperatorRegisController,
  viewAllOperatorRegisController,
  viewOperatorRegisByIdController,
};
