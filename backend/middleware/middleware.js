// Middleware to check if the user is authenticated
const authenticateUser = (req, res, next) => {
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

module.exports = {
  authenticateUser,
  authenticateAdmin,
  authenticateTourGuide,
  authenticateTourOperator,
};
