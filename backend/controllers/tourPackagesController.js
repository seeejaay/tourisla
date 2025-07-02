const e = require("express");
const {
  createTourPackage,
  updateTourPackage,
  deleteTourPackage,
  getAllTourPackagesByOperator,
  getTourPackageById,
  getAssignedGuidesByPackage,
  getTourPackagesByTourGuide,
  getAllTourPackages,
} = require("../models/tourPackagesModel.js");

const { getOperatorRegisById } = require("../models/operatorRegisModel.js");
const { getGuideRegisById } = require("../models/guideRegisModel.js");
// Tour Operator managing tour packages

const createTourPackageController = async (req, res) => {
  try {
    console.log("BackEnd Creating Tour Package with data:", req.body);
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
      touroperator_id,
      cancellation_days,
      cancellation_note,
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
      !date_start ||
      !assigned_guides
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
    console.log(touroperator_id);
    const operatorRegis = await getOperatorRegisById(touroperator_id);
    if (!operatorRegis) {
      return res.status(404).json({ message: "Tour operator not found." });
    }
    touroperator_id = operatorRegis.id;
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
      cancellation_days,
      cancellation_note,
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
    console.log("Backend Updating Tour Package with data:", req.body);

    const user = req.session.user;
    const userId = user.id;
    const operatorRegis = await getOperatorRegisById(userId);
    if (!operatorRegis) {
      return res.status(404).json({ message: "Tour operator not found." });
    }
    const touroperator_id = operatorRegis.id;

    let {
      id,
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
      cancellation_days,
      cancellation_note,
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
      cancellation_days,
      cancellation_note,
    });

    if (!updated || updated.length === 0) {
      return res.status(404).json({ message: "Tour package not found." });
    }

    res.json({ message: "Tour package updated", tourPackage: updated[0] });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const deleteTourPackageController = async (req, res) => {
  try {
    const { id } = req.params;
    const touroperator_id = req.user.id;
    console.log("Deleting" + id);
    const deleted = await deleteTourPackage(id);
    if (!deleted)
      return res.status(404).json({ message: "Tour package not found." });

    res.json({ message: "Tour package deleted" });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewAllTourPackages = async (req, res) => {
  try {
    const packages = await getAllTourPackages();
    if (!packages || packages.length === 0) {
      return res.status(404).json({ message: "No tour packages found." });
    }
    res.json(packages);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewTourPackagesController = async (req, res) => {
  try {
    const tourOperator_Id = req.user.id;
    console.log("Fetching tour packages for operator ID:", tourOperator_Id);

    const operatorRegis = await getOperatorRegisById(tourOperator_Id);
    if (!operatorRegis) {
      return res.status(404).json({ message: "Tour operator not found." });
    }
    const tourOperatorId = operatorRegis.id;

    const packages = await getAllTourPackagesByOperator(tourOperatorId);

    // Fetch assigned guides for each package in parallel
    const packagesWithGuides = await Promise.all(
      packages.map(async (pkg) => {
        const assigned_guides = await getAssignedGuidesByPackage(pkg.id);
        return {
          ...pkg,
          assigned_guides, // array of guides (can be empty)
        };
      })
    );

    res.json(packagesWithGuides);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewTourPackageByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("BAckend Fetching tour package with ID:", id);
    const tourPackage = await getTourPackageById(id);
    if (!tourPackage)
      return res.status(404).json({ message: "Tour package not found." });

    res.json(tourPackage);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewAssignedGuidesController = async (req, res) => {
  try {
    const { id } = req.params;
    const assignedGuides = await getAssignedGuidesByPackage(id);
    if (!assignedGuides || assignedGuides.length === 0) {
      return res
        .status(404)
        .json({ message: "No guides assigned to this package." });
    }
    res.json(assignedGuides);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const getTourPackagesByGuideController = async (req, res) => {
  try {
    const { tourguide_id } = req.params;
    console.log("Fetching tour packages for guide ID:", tourguide_id);
    const guideRegis = await getGuideRegisById(tourguide_id);
    if (!guideRegis) {
      return res.status(404).json({ message: "Tour guide not found." });
    }
    const tourGuide_Id = guideRegis.id;
    console.log("Tour Guide ID:", tourGuide_Id);
    const packages = await getTourPackagesByTourGuide(tourGuide_Id);
    if (!packages || packages.length === 0) {
      return res.status(404).json({ message: "No tour packages found." });
    }
    console.log("Tour Packages for Guide:", packages);
    res.status(200).json({ tourPackages: packages });
  } catch (err) {
    console.error("Error fetching tour packages for guide:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createTourPackageController,
  updateTourPackageController,
  deleteTourPackageController,
  viewTourPackagesController,
  viewTourPackageByIdController,
  viewAssignedGuidesController,
  getTourPackagesByGuideController,
  viewAllTourPackages,
};
