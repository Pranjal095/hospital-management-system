const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
    emailID: { type: String, unique: true, required: true },
    authLevel: { type: String, enum: ["Patient","Doctor","Lab Technician","Pharmacist"], required: true }
});

const Auth = mongoose.model("Auth",authSchema);

module.exports = Auth;