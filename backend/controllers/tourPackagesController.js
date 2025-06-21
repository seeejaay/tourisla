const e = require("express");
const {
  createTourPackage,
  updateTourPackage,
  deleteTourPackage,
  getAllTourPackagesByOperator,
  getTourPackageById,
} = require("../models/tourPackagesModel.js");

const { getOperatorRegisById } = require("../models/operatorRegisModel.js");
// Tour Operator managing tour packages

const createTourPackageController = async (req, res) => {
  try {
    const touroperator_id = 1;
    let {
      package_name,
      location,
      description,
      price,
      duration_days,
      inclusions,
      exclusions,
      available_slots,
      date_start,
      date_end,
      start_time,
      end_time,
      assigned_guides,
    } = req.body;

    package_name = package_name.toUpperCase();
    location = location.toUpperCase();
    description = description.toUpperCase();
    inclusions = inclusions.toUpperCase();
    exclusions = exclusions.toUpperCase();

    // Validate required fields
    if (
      !package_name ||
      !location ||
      !description ||
      !price ||
      !duration_days ||
      !available_slots ||
      !date_start
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Ensure price and duration_days are numbers
    if (isNaN(price) || isNaN(duration_days) || isNaN(available_slots)) {
      return res.status(400).json({
        error: "Price, duration_days, and available_slots must be numbers",
      });
    }

    // Ensure date_start and date_end are valid dates
    if (available_slots < 0) {
      return res
        .status(400)
        .json({ error: "Available slots cannot be negative" });
    }

    const newPackage = await createTourPackage({
      touroperator_id,
      package_name,
      location,
      description,
      price,
      duration_days,
      inclusions,
      exclusions,
      available_slots,
      date_start,
      date_end,
      start_time,
      end_time,
      assigned_guides,
    });

    res
      .status(201)
      .json({ message: "Tour package created", tourPackage: newPackage });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const updateTourPackageController = async (req, res) => {
  try {
    const { id } = req.params;
    const touroperator_id = req.user.id;
    let {
      package_name,
      location,
      description,
      price,
      duration_days,
      inclusions,
      exclusions,
      available_slots,
      is_active,
      date_start,
      date_end,
      start_time,
      end_time,
    } = req.body;

    package_name = package_name.toUpperCase();
    location = location.toUpperCase();
    description = description.toUpperCase();
    inclusions = inclusions.toUpperCase();
    exclusions = exclusions.toUpperCase();

    // Validate required fields
    if (
      !package_name ||
      !location ||
      !description ||
      !price ||
      !duration_days ||
      !available_slots ||
      !date_start
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Ensure price and duration_days are numbers
    if (isNaN(price) || isNaN(duration_days) || isNaN(available_slots)) {
      return res.status(400).json({
        error: "Price, duration_days, and available_slots must be numbers",
      });
    }
    if (available_slots < 0) {
      return res
        .status(400)
        .json({ error: "Available slots cannot be negative" });
    }

    const updated = await updateTourPackage(id, touroperator_id, {
      package_name,
      location,
      description,
      price,
      duration_days,
      inclusions,
      exclusions,
      available_slots,
      is_active,
      date_start,
      date_end,
      start_time,
      end_time,
    });

    if (!updated)
      return res.status(404).json({ message: "Tour package not found." });

    res.json({ message: "Tour package updated", tourPackage: updated });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const deleteTourPackageController = async (req, res) => {
  try {
    const { id } = req.params;
    const touroperator_id = req.user.id;

    const deleted = await deleteTourPackage(id, touroperator_id);
    if (!deleted)
      return res.status(404).json({ message: "Tour package not found." });

    res.json({ message: "Tour package deleted" });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewTourPackagesController = async (req, res) => {
  try {
    const tourOperator_Id = req.user.id;
    console.log("Tour Operator ID:", tourOperator_Id);
    const operatorRegis = await getOperatorRegisById(tourOperator_Id);
    if (!operatorRegis) {
      return res.status(404).json({ message: "Tour operator not found." });
    }
    const tourOperatorId = operatorRegis.id;

    const packages = await getAllTourPackagesByOperator(tourOperatorId);
    res.json(packages);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewTourPackageByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const tourPackage = await getTourPackageById(id, tourOperatorId);
    if (!tourPackage)
      return res.status(404).json({ message: "Tour package not found." });

    res.json(tourPackage);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

module.exports = {
  createTourPackageController,
  updateTourPackageController,
  deleteTourPackageController,
  viewTourPackagesController,
  viewTourPackageByIdController,
};
