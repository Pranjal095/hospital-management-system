const LabReport = require("../models/LabReport");
const Prescription = require("../models/Prescription");
const { fetchAuthentication } = require("./authController");

const checkAuthentication = async (emailID) => {
    try {
        const { authLevel } = await fetchAuthentication({ emailID });
        return authLevel;
    } catch (error) {
        throw new Error("Authentication check failed: " + error.message);
    }
};

const getDocuments = async (req, res) => {
    try {
        const { type, patientId, emailID } = req.body;

        if (!patientId || !emailID) {
            return res.status(400).json({ message: "Patient ID and Email ID are required" });
        }

        const authLevel = await checkAuthentication(emailID);
    
        let documents;

        if(authLevel === "patient"){
            if (type === 'lab-reports') {
                documents = await LabReport.find({ patientId }).sort({ reportDate: -1 });
                res.status(200).json(documents);
            } else if (type === 'prescriptions') {
                documents = await Prescription.find({ patientId }).sort({ prescribedDate: -1 });
                res.status(200).json(documents);
            } else {
                res.status(400).json({ message: "Invalid type. Must be 'lab-reports' or 'prescriptions'." });
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDocuments };
