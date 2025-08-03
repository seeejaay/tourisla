const bcrypt = require("bcrypt");
const crypto = require("crypto");
const axios = require("axios");
const {
  createUser,
  editUser,
  deleteUser,
  findUserById,
  setResetPasswordToken,
  findUserByEmail,
  getUserByResetToken,
  updatePassword,
  editUserStatus,
} = require("../models/userModel");
const { editGuideRegisByUserId } = require("../models/guideRegisModel");
const { editOperatorRegisByUserId } = require("../models/operatorRegisModel");
const { sendWelcomeEmail } = require("../utils/email");
const { sendResetPasswordEmail } = require("../utils/email");
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
      birth_date,
      sex,
    } = req.body;
    console.log(req.body);
    console.log("Creating user with email:", email);
    const formatedFirstName = first_name.toUpperCase();
    const formatedLastName = last_name.toUpperCase();
    const formatedEmail = email.toUpperCase();
    const formattedSex = sex.toUpperCase();

    const captchaToken = req.body.captchaToken;
    const isAdmin = req.session.user && req.session.user.role === "Admin";

    // Admin bypasses captcha
    if (!isAdmin) {
      // Special handling for mobile app
      if (captchaToken === "mobile-app-verification-token") {
        console.log(
          "Mobile app verification token received - bypassing reCAPTCHA check"
        );
        // Skip the reCAPTCHA verification for mobile app
      } else if (!captchaToken) {
        return res.status(400).json({ error: "Captcha token is required" });
      } else {
        // Verify captcha for web clients
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
        const captchaRes = await axios.post(verifyUrl);

        if (!captchaRes.data.success) {
          console.log("Captcha verification failed:", captchaRes.data);
          return res.status(400).json({ error: "Captcha verification failed" });
        } else {
          console.log("Captcha verification successful");
        }
      }
    } else {
      console.log("Admin detected - bypassing captcha verification");
    }

    // Default role for new users
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Role assignment logic for admins
    let assignedRole = "";
    if (isAdmin) {
      const allowedRoles = [
        "Tourist",
        "Admin",
        "Tourism Staff",
        "Tourism Officer",
        "Cultural Director",
        "Tour Guide",
        "Tour Operator",
      ];
      if (role && allowedRoles.includes(role)) {
        assignedRole = role; // Allow admins to assign roles
      } else if (role) {
        return res.status(403).json({ error: "Invalid role assignment" });
      }
    } else {
      const allowedSelfSignupRoles = ["Tourist", "Tour Guide", "Tour Operator"];
      if (role && allowedSelfSignupRoles.includes(role)) {
        assignedRole = role; // Allow self-signup for specific roles
      } else {
        assignedRole = "Tourist"; // Default for self-signup
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await createUser({
      first_name: formatedFirstName,
      last_name: formatedLastName,
      email: formatedEmail,
      hashedPassword,
      phone_number,
      role: assignedRole,
      nationality,
      birth_date,
      sex: formattedSex,
    });

    await sendWelcomeEmail(email, first_name, last_name);
    res.status(201).json({
      status: "success",
      data: { user },
    });
    console.log("Account created successfully");
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const currentUserController = async (req, res) => {
  try {
    console.log("Session cookie:", req.headers.cookie);
    console.log("Session object:", req.session);
    console.log("Session user:", req.session.user);
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get the user ID from the session
    const userId = req.session.user.user_id ?? req.session.user.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID missing in session" });
    }

    // Fetch the latest user data from the database
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: { user: req.session.user },
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const editUserController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      first_name,
      last_name,
      email,
      password,
      phone_number,
      nationality,
      role,
      status,
      last_login_at,
    } = req.body;

    let updatedFields = {
      first_name: first_name.toUpperCase(),
      last_name: last_name.toUpperCase(),
      email: email.toUpperCase(),
      phone_number,
      nationality,
      role,
      status,
      last_login_at,
    };

    // Only hash and update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }
    const existingUser = await findUserByEmail(updatedFields.email);
    console.log("Updating user with ID:", userId);
    console.log("Existing user:", existingUser);
    if (existingUser && existingUser.user_id == userId) {
      // If the existing user is the same as the one being updated, skip the email check
      console.log("User is updating their own email, skipping conflict check.");
    } else if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Update user table
    const updatedUser = await editUser(userId, updatedFields);

    // Also update tourguide_applicants table if user is a tour guide
    if (role === "Tour Guide") {
      await editGuideRegisByUserId(userId, {
        first_name: first_name.toUpperCase(),
        last_name: last_name.toUpperCase(),
        mobile_number: phone_number,
        email: email.toUpperCase(),
      });
    } else if (role === "Tour Operator") {
      // If the user is a tour operator, you might want to update the operator registration as well
      // Assuming you have a similar function for operator registration
      await editOperatorRegisByUserId(userId, {
        representative_name:
          first_name.toUpperCase() + " " + last_name.toUpperCase(),
        email: email.toUpperCase(),
        mobile_number: phone_number,
      });
    }

    req.session.user = {
      ...req.session.user,
      first_name: first_name.toUpperCase(),
      last_name: last_name.toUpperCase(),
      email: email.toUpperCase(),
      mobile_number: phone_number,
      nationality,
      role,
      status,
      last_login_at,
    };

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      status: "success",
      data: { user: req.session.user.role },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const editUserStatusController = async (req, res) => {
  try {
    const { userId, status, role } = req.body; // Assuming userId and status are passed in the request body
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const updatedUser = await editUserStatus(userId, status, role);
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const userId = req.params.userId; // <-- get from URL
    const deletedUser = await deleteUser(userId); // <-- pass userId, not email!
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

const viewUserController = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming userId is passed as a URL parameter
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  console.log("Forgot password request for email:", email);
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  const newEmail = email.toUpperCase(); // Ensure email is in uppercase
  try {
    const user = await findUserByEmail(newEmail);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600 * 1000);

    await setResetPasswordToken(newEmail, token, expires);

    //on production, use the actual URL of your frontend
    const resetLink = `https://tourisla.space/auth/reset-password?token=${token}`;
    await sendResetPasswordEmail(newEmail, resetLink);

    res.status(200).json({
      status: "success",
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;
  try {
    if (!password) {
      return res.status(400).json({ error: "Password is required." });
    }

    // Find user by token and check expiry
    const user = await getUserByResetToken(token);

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token/expiry
    await updatePassword(user.user_id, hashedPassword);

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  createUserController,
  currentUserController,
  editUserController,
  deleteUserController,
  viewUserController,
  forgotPasswordController,
  resetPasswordController,
  editUserStatusController,
};
