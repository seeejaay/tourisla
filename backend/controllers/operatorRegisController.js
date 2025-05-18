const e = require("express");
const {
    createOperatorRegis,
    editOperatorRegis,
    deleteOperatorRegis,
    getAllOperatorRegis,
    getOperatorRegisById,
} = require("../models/operatorRegisModel.js");

const createOperatorRegisController = async (req, res) => {
  try {
    const { operator_name, representative_name, email, mobile_number, office_address, application_status } = req.body;

    const operatorRegis = await createOperatorRegis({
      operator_name,
      representative_name,
      email,
      mobile_number,
      office_address,
      application_status
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
        const { operator_name, representative_name, email, mobile_number, office_address, application_status } = req.body;
        
        const operatorRegis = await editOperatorRegis(operatorId, {
            operator_name,
            representative_name,
            email,
            mobile_number,
            office_address,
            application_status
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
  viewOperatorRegisByIdController
};