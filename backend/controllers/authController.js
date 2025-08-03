const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {
  findUserByEmail,
  statusCheck,
  loginDate,
  verifyUser,
  setVerificationToken,
  findUserById,
} = require("../models/userModel.js");

const { sendVerificationEmail } = require("../utils/email.js");
const loginUser = async (req, res) => {
  let { email, password } = req.body;
  const Upperemail = email.toUpperCase();
  console.log("Uppercase Email:", Upperemail);
  const ipAddress = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;

  try {
    const user = await findUserByEmail(Upperemail);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const status = await statusCheck(Upperemail);
    if (status && status.status === "Inactive") {
      return res.status(401).json({ error: "Account is inactive" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    req.session.user = {
      id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
      nationality: user.nationality,
      birthDate: user.birth_date,
      sex: user.sex,
      status: user.status,
    };
    await loginDate(email, ipAddress);
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      user: req.session.user.role,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" + err });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logout successful" });
  });
};

const verifyUserController = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await verifyUser(token);
    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification token" });
    }
    if (req.session.user) {
      req.session.user.status = user.status;
    }
    return res
      .status(200)
      .json({ message: "User verified successfully", user });
  } catch (error) {
    console.error("Error during user verification:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const resendVerificationController = async (req, res) => {
  const userId = req.session.user.id; // or get from req.body/email if not authenticated
  try {
    const user = await findUserById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.status === "Active")
      return res.status(400).json({ error: "User already verified" });

    const verify_token = crypto.randomBytes(32).toString("hex");
    const verify_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await setVerificationToken(userId, verify_token, verify_token_expires);

    await sendVerificationEmail(
      user.email,
      user.first_name,
      user.last_name,
      verify_token,
      verify_token_expires
    );

    res.json({ message: "Verification email resent" });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ error: "Failed to resend verification email" });
  }
};

module.exports = {
  loginUser,
  logoutUser,
  verifyUserController,
  resendVerificationController,
};
