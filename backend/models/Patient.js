const mongoose = require("mongoose");

// This schema is flexible for subsequent changes
const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    dob: { type: Date, required: true },
    sex: { type: String, required: true },
    rank: { type: String, required: true},
    contact: { type: String, required: true },
    medicalHistory: { type: Array, default: [] },
    rfidCardId: { type: String, unique: true, required: true },
});
const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
