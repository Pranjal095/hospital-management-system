const express = require("express");
const {
    uploadLabReport,
    fetchLabReports,
} = require("../controllers/labReportController");

const router = express.Router();

router.post("/:patientId", uploadLabReport);

router.get("/:patientId", fetchLabReports);

module.exports = router;
