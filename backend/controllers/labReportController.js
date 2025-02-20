const LabReport = require("../models/LabReport");

const uploadLabReport = async (req, res) => {
    try {
        const { reportName, reportDate, reportFile } = req.body;
        const { patientId } = req.params;

        let labReport = new LabReport({
            patientId,
            reportName,
            reportDate,
            reportFile,
        });

        await labReport.save();

        res.status(201).json(labReport);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const fetchLabReports = async (req, res) => {
    try {
        const { patientId } = req.params;

        const labReports = await LabReport.find({ patientId });

        res.status(201).json({ labReports });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = { uploadLabReport, fetchLabReports };
