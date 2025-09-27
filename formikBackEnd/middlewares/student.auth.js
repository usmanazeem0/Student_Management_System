const jwt = require("jsonwebtoken");

const studentAuth = (req, res, next) => {
  try {
    // Get token from headers
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // Token format: "Bearer <token>"
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check role
    if (decoded.role !== "student") {
      return res
        .status(403)
        .json({ message: "Access denied. Only students allowed." });
    }

    // Attach student info to request
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};

module.exports = studentAuth;
