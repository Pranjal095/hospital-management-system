const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
    patientId: {
        type: String,
        ref: "Patient",
        required: true,
    },
    doctorName: { type: String, required: true},
    prescribedDate: { type: String, required: true },
    prescribedFile: { type: String, required: true },
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
