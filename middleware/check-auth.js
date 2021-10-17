const jwt = require("jsonwebtoken");

exports.validateAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY);
    next();
  } catch (err) {
    res.status(401).json({
      message: "Auth failed - Couldn't validate token",
    });
  }
};
