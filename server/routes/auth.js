const express = require("express");
const { validate } = require("../validations/common");
const { signinValidationRules, signupValidationRules } = require("../validations/sign");
const {
  signIn,
  signUp,
  logout,
  retrieveNewToken
} = require('../controllers/auth');
const { userValidator, tokenDecoder } = require("../middlewares/common");

const router = express.Router();

router.post("/login", signinValidationRules(), validate, signIn);
router.post("/signup", signupValidationRules(), validate, signUp);
router.get("/logout", userValidator, logout);
router.get("/token/new", tokenDecoder, retrieveNewToken);

module.exports = router;
