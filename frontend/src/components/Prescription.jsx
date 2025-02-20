import React, { useState } from "react";
import DigitalPrescription from "./prescriptionTypes/digitalPrescription"; // Ensure this file exports the component correctly
import ManualPrescription from "./prescriptionTypes/manualPrescription"; // Create this component for paper prescriptions
import VoicePrescription from "./prescriptionTypes/voicePrescription";
import Header from "./header";
import { useLocation } from "react-router-dom";

function Prescription() {
    const location = useLocation();
    const details = location.state
    const [prescriptionType, setPrescriptionType] = useState("digital"); // State to track selected prescription type

    const handleToggle = (type) => {
        setPrescriptionType(type);
    };

    return (
        <div>
            <Header Department={"Pharmacy"} />
            <div className="mb-4 w-full p-4 md:p-6">
                <h2 className="text-xl font-semibold mb-2">Select Prescription Type</h2>
                <button
                    onClick={() => handleToggle("digital")}
                    className={`p-2 ${prescriptionType === "digital" ? "bg-blue-600" : "bg-gray-400"} text-white rounded-lg mr-2`}
                >
                    Digital Prescription
                </button>
                <button
                    onClick={() => handleToggle("manual")}
                    className={`p-2 ${prescriptionType === "manual" ? "bg-blue-600" : "bg-gray-400"} text-white rounded-lg mr-2`}
                >
                    Manual Prescription
                </button>
                <button
                    onClick={() => handleToggle("voice")}
                    className={`p-2 ${prescriptionType === "voice" ? "bg-blue-600" : "bg-gray-400"} text-white rounded-lg`}
                >
                    Voice Prescription
                </button>
            </div>

            {prescriptionType === "digital" && <DigitalPrescription Details={details}/>}
            {prescriptionType === "manual" && <ManualPrescription Details={details}/>}
            {prescriptionType === "voice" && <VoicePrescription Details={details}/>}
        </div>
    );
}

export default Prescription;
