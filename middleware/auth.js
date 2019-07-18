const config = require("config");
const jwt = require("jsonwebtoken");

// Middleware Fn- a fn that has access to req & res objects
// next is a call back fn that we run so it moves to the next part of the middleware
module.exports = function(req, res, next) {
  // Get the token from the header- we pass the header-key we want to send our token in
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token if there's one
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is invalid" });
  }
};
