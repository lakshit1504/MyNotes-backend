const jwt = require("jsonwebtoken");
var JWT_SECRET = "lakshitgoesto@you";

const fetchuser = (req, res, next) => {
  // get the user from jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401), send({ error: "please use valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401), send({ error: "please use valid token" });
  }
};

module.exports = fetchuser;
