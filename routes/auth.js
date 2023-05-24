const express = require("express");
const model = require("../models/User");
const user = model.user;
const Route = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser=require('../middleware/fetchuser');

var JWT_SECRET = "lakshitgoesto@you";

//Route 1:new user created by post request '/api/auth/createUser'
Route.post(
  "/createUser",
  [
    body("name", "name length error").isLength({ min: 3 }),
    body("email", "email is too short").isLength({ min: 3 }).isEmail(),
    body("password", "not a valid password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    // if there are any errors ,return bad request
    let success=false
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ errors: errs.array() });
    }
    try {
      // check if user already exis or not
      let users = await user.findOne({ email: req.body.email });
      if (users) {
        return res.status(400).json({error: "this email already exist" });
      }
      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);
      users = await user.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: users.id,
        },
      };
      // .then(user=>res.json(user))
      // .catch(err=>{console.log(err),
      // res.json({error:'please enter your valid email'})})
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({success, authToken });
      success=false;
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//Route 2:authenticate the user by post request '/api/auth/createUser' no login required
Route.post(
  "/authenticateUser",
  [
    body("email", "email is too short").isLength({ min: 3 }).isEmail(),
    body("password", "password can't be blank").exists(),
  ],
  async (req, res) => {
    let success=false;
    // if there are any errors ,return bad request
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ errors: errs.array() });
    }

    const { email, password } = req.body;
    try {
      let users = await user.findOne({ email });
      if (!users) {
        return res.status(400).json({ error: "try with right credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, users.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "try with right credentials" });
      }
      const data = {
        user: {
          id: users.id,
        },
      }; 
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.send({success, authToken });
      success=false;
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//Route 3:get loggined user details

Route.post("/userDetails",fetchuser,async (req, res) => {
  try {
    let users = await user.findOne({userId:req.user.id}).select("-password");
    res.send(users)
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

exports.Route = Route;
