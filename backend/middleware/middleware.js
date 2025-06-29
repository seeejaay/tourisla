// Middleware to check if the user is authenticated
const authenticateUser = (req, res, next) => {
  console.log("Session:", req.session);
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
    console.log("Session in allowedRoles:", req.session);
    if (!req.session || !req.session.user) {
      console.log("401: No session or user");
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }
    console.log("User role in allowedRoles:", req.session.user.role);
    if (!roles.includes(req.session.user.role)) {
      console.log("403: Role not allowed", req.session.user.role, roles);
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient permissions" });
    }
    req.user = req.session.user;
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
