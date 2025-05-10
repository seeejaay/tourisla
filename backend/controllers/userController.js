const bcrypt = require("bcrypt");
const { createUser, editUser, deleteUser } = require("../models/userModel");
const { findUserByEmail } = require("../models/userModel");
const createUserController = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone_number,
      role,
      nationality,
    } = req.body;

    // Default role for new users
    let assignedRole = "Tourist";

    // Check if the authenticated user is an admin
    if (req.session && req.session.user && req.session.user.role === "Admin") {
      const allowedRoles = [
        "Tourist",
        "Admin",
        "Tourism Staff",
        "Tourism Officer",
        "Cultural Director",
        "Tour Guide",
      ];
      if (role && allowedRoles.includes(role)) {
        assignedRole = role; // Allow admins to assign roles
      } else if (role) {
        return res.status(403).json({ error: "Invalid role assignment" });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await createUser({
      first_name,
      last_name,
      email,
      hashedPassword,
      phone_number,
      role: assignedRole, // Use the assigned role
      nationality,
    });

    res.status(201).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const currentUserController = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = req.session.user; // Assuming user info is stored in session
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const editUserController = async (req, res) => {
  try {
    const oldEmail = req.session.user.email;
    const {
      first_name,
      last_name,
      email,
      password,
      phone_number,
      nationality,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await editUser(oldEmail, {
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone_number,
      nationality,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      status: "success",
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const email = req.session.user.email;
    const deletedUser = await deleteUser(email);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createUserController,
  currentUserController,
  editUserController,
  deleteUserController,
};
