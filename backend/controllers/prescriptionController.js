const Patient = require("../models/Patient");
const Prescription = require("../models/Prescription");

const addPrescription = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { prescribedFile, doctorName, prescribedDate } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded or invalid file type." });
    }

    const prescription = new Prescription({
        patientId,
        doctorName,
        prescribedDate: prescribedDate,
        prescribedFile: req.file.path,
    });

    await prescription.save();

    const patient = await Patient.findOne({ rfidCardId: patientId });
    patient.medicalHistory.push(prescription);
    patient.save();

    res.status(201).json({ message: "Prescription uploaded successfully", prescription });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

const fetchPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.params;

    const prescriptions = await Prescription.find({ patientId });

    if (!prescriptions || prescriptions.length === 0) {
      return res.status(404).json({
        message: "No prescriptions found for this patient",
      });
    }

    res.status(200).json({ prescriptions });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// const updatePrescription = async (req, res) => {
//   try {
//     const { patientId, prescribedDate } = req.params;
//     const { prescribedFile } = req.body;

//     const prescription = await Prescription.findOne({ patientId, prescribedDate });


//     if (!prescription) {
//       return res.status(404).json({
//         message: "Prescription not found",
//       });
//     }

//     if (prescribedFile) prescription.prescribedFile = prescribedFile;

//     await prescription.save();

//     res.status(200).json({ prescription });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

module.exports = {
  addPrescription,
  fetchPrescriptions
};
