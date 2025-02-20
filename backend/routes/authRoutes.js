const express = require("express");
const { addUser, fetchAuthentication } = require("../controllers/authController");

const router = express.Router();

router.post("/new",addUser);
router.post("/fetch",fetchAuthentication);

module.exports = router;