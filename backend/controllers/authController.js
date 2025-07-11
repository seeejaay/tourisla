const bcrypt = require("bcrypt");
const {
  findUserByEmail,
  statusCheck,
  loginDate,
} = require("../models/userModel.js");

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
    };
    await loginDate(email, ipAddress);
    res.status(200).json({
      message: "Login successful",
      user: req.session.user, // Return user from session
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

module.exports = { loginUser, logoutUser };
