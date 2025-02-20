const express = require("express");
const { addPrescription, fetchPrescriptions, updatePrescription } = require("../controllers/prescriptionController");
const multer = require("multer");
const path = require("path");

// Configure Multer for PDF uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/prescriptions");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"), false);
        }
    },
});

const router = express.Router();

router.post("/:patientId", upload.single("prescriptionFile"), addPrescription);
router.get("/:patientId", fetchPrescriptions);
// router.post("/:patientId/:prescribedDate", updatePrescription);

module.exports = router;