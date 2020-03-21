const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json({ message: "error, bad request 1" });
  }

  jwt.verify(token, "Oreos are the best", (error, decode) => {
    if (error) {
      return res.status(400).json({ message: "error, bad request 2" });
    }
  });

  next();
};
