const express = require("express");
const { userValidator } = require("../middlewares/common");
const {
  getMe
} = require('../controllers/me')

const router = express.Router();

router.get("/", userValidator, getMe);

module.exports = router;
