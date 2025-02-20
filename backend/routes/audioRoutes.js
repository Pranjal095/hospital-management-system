const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { processAudio } = require("../controllers/audioController");

const router = express.Router();

router.post("/",upload.single("audio"),processAudio);

module.exports = router;