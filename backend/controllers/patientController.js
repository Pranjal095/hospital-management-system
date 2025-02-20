const Patient = require("../models/Patient");

// Initial registration part
const registerPatient = async (req, res) => {
    try {
        const { name, age, dob, sex, contact, rank, rfidCardId } = req.body;
        const newPatient = new Patient({
            name,
            age,
            dob,
            sex,
            contact,
            rank,
            rfidCardId,
        });
        await newPatient.save();
        res.status(201).json({
            message: "Patient registered successfully",
            patient: newPatient,
        });
    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message,
        });
    }
};

const fetchPatientDetails=async(req,res)=>{
    try{
      const { patientID } = req.params;
      const patient = await Patient.findOne({ rfidCardId: patientID });
      res.status(200).json(patient);
    } 
    catch(error){
      res.status(500).json({ message: error["message"] });
    }
  };

module.exports = { registerPatient, fetchPatientDetails };
