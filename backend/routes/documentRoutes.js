const express = require("express");
const { getDocuments } = require("../controllers/documentController");

const router = express.Router();

router.post("/Documents", getDocuments);

module.exports = router;
