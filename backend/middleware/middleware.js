// Middleware to check if the user is authenticated
const authenticateUser = (req, res, next) => {
  console.log("Session:", req.session.user);
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Unauthorized: Please log in" });
  }

  req.user = req.session.user; // Attach user info to the request object
  next();
};

// Middleware to check if the user is an admin
const authenticateAdmin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Unauthorized: Please log in" });
  }

  if (req.session.user.role !== "Admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }

  req.user = req.session.user; // Attach user info to the request object
  next();
};

const authenticateTourismStaff = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Unauthorized: Please log in" });
  }
  if (req.session.user.role !== "Tourism Staff") {
    return res.status(403).json({ error: "Forbidden: Tourism staff only" });
  }
  req.user = req.session.user; // Attach user info to the request object
  next();
};

const authenticateTourismOfficer = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Unauthorized: Please log in" });
  }
  if (req.session.user.role !== "Tourism Officer") {
    return res.status(403).json({ error: "Forbidden: Tourism officer only" });
  }
  req.user = req.session.user; // Attach user info to the request object
  next();
};

// Middleware to check if the user is a tour guide
const authenticateTourGuide = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Unauthorized: Please log in" });
  }

  if (req.session.user.role !== "Tour Guide") {
    return res.status(403).json({ error: "Forbidden: Tour guides only" });
  }

  req.user = req.session.user; // Attach user info to the request object
  next();
};

// Middleware to check if the user is a tour operator
const authenticateTourOperator = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Unauthorized: Please log in" });
  }

  if (req.session.user.role !== "Tour Operator") {
    return res.status(403).json({ error: "Forbidden: Tour operator only" });
  }

  req.user = req.session.user; // Attach user info to the request object
  next();
};

const allowedRoles = (roles) => {
  return (req, res, next) => {
    // Check if user is logged in
    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.session.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient permissions" });
    }

    req.user = req.session.user; // Attach user info to the request object
    next();
  };
};

module.exports = {
  authenticateUser,
  authenticateAdmin,
  authenticateTourGuide,
  authenticateTourOperator,
  authenticateTourismStaff,
  authenticateTourismOfficer,
  allowedRoles,
};
