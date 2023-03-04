const express = require("express");
const { validate } = require("../validations/common");
const { signinValidationRules, signupValidationRules } = require("../validations/sign");
const {
  signIn,
  signUp,
  logout
} = require('../controllers/auth');
const { userValidator } = require("../middlewares/common");

const router = express.Router();

router.post("/login", signinValidationRules(), validate, signIn);
router.post("/signup", signupValidationRules(), validate, signUp);
router.get("/logout", userValidator, logout);

module.exports = router;
