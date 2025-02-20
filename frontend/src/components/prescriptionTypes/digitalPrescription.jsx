import React, { useState, useCallback } from "react";
import Header from "../header";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function DigitalPrescription({ Details = {} }) {
    const [prescriptions, setPrescriptions] = useState([]);
    const [newMedicine, setNewMedicine] = useState({
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: ""
    });
    const [currentPrescription, setCurrentPrescription] = useState([]);
    const [error, setError] = useState("");
    const [isPrescriptionAdded, setIsPrescriptionAdded] = useState(false);

    const handleMedicineChange = (e) => {
        const { name, value } = e.target;
        setNewMedicine((prev) => ({ ...prev, [name]: value }));
    };

    const addMedicine = () => {
        if (Object.values(newMedicine).some(value => value === "")) {
            setError("All fields are required for each medicine.");
        } else {
            setCurrentPrescription([...currentPrescription, newMedicine]);
            setNewMedicine({
                medicineName: "",
                dosage: "",
                frequency: "",
                duration: "",
                instructions: ""
            });
            setError("");
        }
    };

    const addPrescription = useCallback(() => {
        if (currentPrescription.length === 0) {
            setError("At least one medicine is required.");
        } else {
            setPrescriptions([currentPrescription, ...prescriptions]);
            setCurrentPrescription([]);
            setIsPrescriptionAdded(false);
            setError("");
        }
    }, [currentPrescription, prescriptions]);

    const handleEditMedicine = (index, field, value) => {
        const updatedPrescription = [...currentPrescription];
        updatedPrescription[index] = { ...updatedPrescription[index], [field]: value };
        setCurrentPrescription(updatedPrescription);
    };

    const generatePDF = async (index) => {
        const prescription = prescriptions[index];
        const doc = new jsPDF('p', 'mm', 'a4');

        doc.setFontSize(12); // Set default font size
        doc.text(`Prescription ${index + 1}`, 14, 20); // Add title

        const columns = [
            { header: 'Medicine Name', dataKey: 'medicineName' },
            { header: 'Dosage', dataKey: 'dosage' },
            { header: 'Frequency', dataKey: 'frequency' },
            { header: 'Duration', dataKey: 'duration' },
            { header: 'Instructions', dataKey: 'instructions' }
        ];

        const data = prescription.map(medicine => ({
            medicineName: medicine.medicineName,
            dosage: medicine.dosage,
            frequency: medicine.frequency,
            duration: medicine.duration,
            instructions: medicine.instructions
        }));

        doc.autoTable({
            head: [columns.map(col => col.header)],
            body: data.map(item => columns.map(col => item[col.dataKey])),
            startY: 30, // Start position of the table
            margin: { top: 20 },
            theme: 'striped',
            headStyles: { fillColor: [22, 160, 133] },
            styles: { fontSize: 10 },
            columnStyles: { 0: { cellWidth: 30 } } // Adjust column width if necessary
        });

        const pdfBlob = doc.output('blob');

        // Create FormData to upload PDF
        const formData = new FormData();
        const date = new Date().toISOString();
        formData.append("prescriptionFile", pdfBlob, `prescription-${date}-${Details.rfID}.pdf`);
        formData.append("doctorName", Details.doctorName);
        formData.append("prescribedDate", date);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_URI}/api/prescriptions/${Details.rfidCardId}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Prescription uploaded successfully:", data);
            } else {
                console.error("Failed to upload prescription:", await response.json());
            }
        } catch (error) {
            console.error("Error uploading prescription:", error);
        }
    };

    return (
        <div className="">
            <div className="mb-4 w-full p-4 md:p-6">
                {!isPrescriptionAdded ? (
                    <button
                        onClick={() => setIsPrescriptionAdded(true)}
                        className="p-2 bg-blue-600 text-white rounded-lg"
                    >
                        Add Prescription
                    </button>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold mb-2">Add New Prescription</h2>
                        {error && <p className="text-red-500 mb-2">{error}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                name="medicineName"
                                value={newMedicine.medicineName}
                                onChange={handleMedicineChange}
                                placeholder="Medicine Name"
                                className="block p-2 border rounded w-full"
                            />
                            <input
                                type="text"
                                name="dosage"
                                value={newMedicine.dosage}
                                onChange={handleMedicineChange}
                                placeholder="Dosage"
                                className="block p-2 border rounded w-full"
                            />
                            <input
                                type="text"
                                name="frequency"
                                value={newMedicine.frequency}
                                onChange={handleMedicineChange}
                                placeholder="Frequency"
                                className="block p-2 border rounded w-full"
                            />
                            <input
                                type="text"
                                name="duration"
                                value={newMedicine.duration}
                                onChange={handleMedicineChange}
                                placeholder="Duration"
                                className="block p-2 border rounded w-full"
                            />
                            <input
                                type="text"
                                name="instructions"
                                value={newMedicine.instructions}
                                onChange={handleMedicineChange}
                                placeholder="Instructions"
                                className="block p-2 border rounded w-full"
                            />
                        </div>
                        <button
                            onClick={addMedicine}
                            className="p-2 bg-green-600 text-white rounded-lg"
                        >
                            Add Medicine
                        </button>

                        {currentPrescription.length > 0 && (
                            <button
                                onClick={addPrescription}
                                className="p-2 bg-blue-600 text-white rounded-lg mt-2"
                            >
                                Save Prescription
                            </button>
                        )}

                        {currentPrescription.length > 0 && (
                            <div className="overflow-x-auto mt-4">
                                <h3 className="text-lg font-semibold mb-2">Current Prescription</h3>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine Name</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentPrescription.map((medicine, medIndex) => (
                                            <tr key={medIndex}>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="text"
                                                        value={medicine.medicineName}
                                                        onChange={(e) => handleEditMedicine(medIndex, 'medicineName', e.target.value)}
                                                        className="w-full border rounded"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="text"
                                                        value={medicine.dosage}
                                                        onChange={(e) => handleEditMedicine(medIndex, 'dosage', e.target.value)}
                                                        className="w-full border rounded"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="text"
                                                        value={medicine.frequency}
                                                        onChange={(e) => handleEditMedicine(medIndex, 'frequency', e.target.value)}
                                                        className="w-full border rounded"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="text"
                                                        value={medicine.duration}
                                                        onChange={(e) => handleEditMedicine(medIndex, 'duration', e.target.value)}
                                                        className="w-full border rounded"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="text"
                                                        value={medicine.instructions}
                                                        onChange={(e) => handleEditMedicine(medIndex, 'instructions', e.target.value)}
                                                        className="w-full border rounded"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
            {prescriptions.length > 0 && (
                <div className="overflow-x-auto mt-4 p-4 md:p-6">
                    {prescriptions.map((prescription, index) => (
                        <div key={index} className="mb-4 text-xl">
                            <h3 className="text-lg font-semibold mb-2">Prescription {index + 1}</h3>
                            <div id={`prescription-${index}`}>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine Name</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {prescription.map((medicine, medIndex) => (
                                            <tr key={medIndex}>
                                                <td className="px-4 py-2">{medicine.medicineName}</td>
                                                <td className="px-4 py-2">{medicine.dosage}</td>
                                                <td className="px-4 py-2">{medicine.frequency}</td>
                                                <td className="px-4 py-2">{medicine.duration}</td>
                                                <td className="px-4 py-2">{medicine.instructions}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button
                                onClick={() => generatePDF(index)}
                                className="mt-2 p-2 bg-gray-800 text-white rounded-lg"
                            >
                                Download PDF
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DigitalPrescription;
