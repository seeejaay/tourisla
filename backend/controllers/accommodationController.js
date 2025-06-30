const {
  createAccommodation,
  editAccommodation,
  deleteAccommodation,
  getAllAccommodations,
  getAccommodationById,
  assignAccommodationToStaff,
  getAllTourismStaff,
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
    // Ensure accommodationId is a number
    const accommodationId = Number(req.params.accommodationId);
    if (isNaN(accommodationId)) {
      return res.status(400).send("Invalid accommodationId");
    }

    // Sanitize number fields in data
    const data = { ...req.body };
    ["no_of_rooms", "number_of_employees", "Year"].forEach((field) => {
      if (data[field] !== undefined) {
        const num = Number(data[field]);
        data[field] = isNaN(num) ? null : num;
      }
    });

    const accommodation = await editAccommodation(accommodationId, data);
    res.json(accommodation);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
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

const assignTourismStaffController = async (req, res) => {
  try {
    let { accommodationId } = req.params;
    const { staffId } = req.body; // staffId sent in request body

    // If accommodationId is "null" or null, treat as unassign
    if (accommodationId === "null" || accommodationId === null) {
      accommodationId = null;
    }

    if (!staffId) {
      return res.status(400).json({ error: "staffId is required." });
    }

    // Assign or unassign the staff to the accommodation (update users table)
    const updatedStaff = await assignAccommodationToStaff(
      staffId,
      accommodationId // can be null
    );

    if (!updatedStaff) {
      return res
        .status(404)
        .json({ error: "Staff or accommodation not found." });
    }

    res.json(updatedStaff);
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .send("Error assigning tourism staff to accommodation: " + err.message);
  }
};

const getAllTourismStaffController = async (req, res) => {
  try {
    const staff = await getAllTourismStaff();
    res.json(staff);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error fetching tourism staff: " + err.message);
  }
};

module.exports = {
  createAccommodationController,
  editAccommodationController,
  deleteAccommodationController,
  viewAccommodationsController,
  viewAccommodationByIdController,
  assignTourismStaffController,
  getAllTourismStaffController,
};
