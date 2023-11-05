const jwt = require("jsonwebtoken");
const generateAccessToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "2d" });
const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
