const express = require("express");
const { registerPatient, fetchPatientDetails } = require("../controllers/patientController");
const router = express.Router();

router.post("/register", registerPatient);
router.get("/:patientID", fetchPatientDetails);
module.exports = router;
