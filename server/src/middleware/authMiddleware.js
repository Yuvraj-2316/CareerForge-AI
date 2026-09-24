
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // 1. Read the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in."
      });
    }

    // 2. Extract the token
    const token = authHeader.split(" ")[1];

    // 3. Verify its signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find the user in MongoDB
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists."
      });
    }

    // 5. Attach the authenticated user to the request
    req.user = user;

    // 6. Continue to the protected route
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again."
    });
  }
};

module.exports = { protect };