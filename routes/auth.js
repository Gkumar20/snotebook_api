const express = require('express')
const router = express.Router()
const User = require("../models/User")
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');


//json web tool used for secret communication between client and server :- create token
const jwtSecret = "Secret$Client&Server"

//Route- 1: create a user using : POST at "/api/auth/createuser" no login require
router.post('/createuser', [

  //here chekcing  of email name and password is valid or not 
  body('name', "Enter Valid Name").isLength({ min: 3 }),
  body('email', "Enter valid Email").isEmail(),
  // password must be at least 5 chars long min:5
  body('password', "pasword must be greater than 5 character").isLength({ min: 5 }),
],

  async (req, res) => {
    console.log(req.body)

    //validator check the error of email name and password
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let success = false;
      // check whether user email is unique on not means USER exist already or not 
      let user = await User.findOne({ email: req.body.email })
      console.log(user)
      if (user) {
        success = false;
        return res.status(400).json({success, error: "this email is already registered" })
      }

      //generate salt and addition of bcrypt to secure password 
      const salt = await bcrypt.genSaltSync(10); // generate 10 bit hash password
      const securePass = await bcrypt.hash(req.body.password, salt);

      // create  new user 
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePass
      })

      // send response in json file after creating user & creating token for client
      const data = {
        user: {
          id: user.id
        }
      }
      const ClientToken = jwt.sign(data, jwtSecret);
      success = true;
      res.json({success, ClientToken })

    } catch (error) {
      console.error(error.message)
      // error send as a response at status 500
      res.status(500).send("Internal Error Occured")
    }
  })








//Routes-2: Login user using : POST at "/api/auth/login" no login require
router.post('/login', [

  //here chekcing  of email only  is valid or not ... if email is wrong then program will not allow 
  body('email', "Enter valid Email").isEmail(),
  body('password', "Password cannot be blanck").exists(),
],
  async (req, res) => {

    //validator check the validation or error of email name and password
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // login data by user 
    const { email, password } = req.body;
    try {
      let success = false;
      //find email in database and compare that email by stored email
      const user = await User.findOne({ email })
      if (!user) {
        success = false;
        res.status(400).json({success, error: "Please login with corret credentials" })
        return
      }

      //user password compare with stored password
      const passwordComapre = await bcrypt.compare(password, user.password)
      if (!passwordComapre) {
        success = false;
        res.status(400).json({ success, error: "Please login with corret credentials" })
        return
      }

      // send response in json file after creating user & creating token for client
      const data = {
        user: {
          id: user.id
        }
      }
      const ClientToken = jwt.sign(data, jwtSecret);
      success = true;
      res.json({ success,ClientToken })

    } catch (error) {
      console.error(error.message)
      // error send as a response at status 500
      res.status(500).send("Internal Error Occured")
    }

  })






//Route- 3: Get  user logedIn  detail using : POST at "/api/auth/getuser"  login require
router.post('/getuser',fetchuser,async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user)
      return
    } catch (error) {
      console.error(error.message)
      // error send as a response at status 500
      res.status(500).send("Internal Error Occured")
    }
  })


  
module.exports = router