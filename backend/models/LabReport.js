const mongoose = require("mongoose");

const labReportSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    reportName: { type: String, required: true },
    reportDate: { type: Date, required: true, default: Date.now },
    reportFile: { type: String, required: true },
    status: { type: String, required: true, default: "pending" },
});

const LabReport = mongoose.model("LabReport", labReportSchema);

module.exports = LabReport;
