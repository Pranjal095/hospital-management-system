import React, { useRef, useState, useEffect } from "react";
import jsPDF from "jspdf";
import SignaturePad from "signature_pad";

function ManualPrescription({ Details = {} }) {
    const linesPerPage = 10;
    const canvasRef = useRef([]);
    const signaturePadRef = useRef([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pages, setPages] = useState([true]);
    const [extractedText, setExtractedText] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const initializeSignaturePad = (canvas) => {
            return new SignaturePad(canvas, {
                minWidth: 1.9,
                maxWidth: 1.9,
                penColor: '#000000',
                backgroundColor: '#FFFFFF',
                throttle: 16
            });
        };

        canvasRef.current.forEach((canvas, index) => {
            if (canvas && !signaturePadRef.current[index]) {
                signaturePadRef.current[index] = initializeSignaturePad(canvas);
            }
        });
    }, [pages]);

    const extractTextFromCanvas = async () => {
        setIsProcessing(true);
        let images = [];

        for (let i = 0; i < linesPerPage; i++) {
            const canvas = canvasRef.current[i + currentPage * linesPerPage];
            if (!canvas || signaturePadRef.current[i + currentPage * linesPerPage]?.isEmpty()) continue;
            images.push(canvas.toDataURL("image/png"));
        }

        if (images.length === 0) {
            alert("No text to process!");
            setIsProcessing(false);
            return;
        }

        try {
            console.log("Length",images.length)
            const response = await fetch(`${import.meta.env.VITE_PYTHON_SERVER_URI}/api/ocr`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images })
            });
            const result = await response.json();
            setExtractedText(prev => `${prev}\n${result.text}`);
        } catch (error) {
            console.error("OCR Error:", error);
            alert("Text extraction failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleGeneratePDF = async () => {
        const doc = new jsPDF();
        doc.setFontSize(12);

        if (!extractedText.trim()) {
            alert("No text to save!");
            return;
        }

        doc.text("Prescription", 10, 10);
        doc.text(extractedText || "No prescription text provided.", 10, 20);
    
        // Generate PDF Blob
        const pdfBlob = doc.output("blob");
    
        // Create FormData to upload PDF
        const formData = new FormData();
        const date = new Date().toISOString();
        formData.append("prescriptionFile", pdfBlob, `prescription-${date}-${Details.rfidCardId}.pdf`);
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

    const clearCanvas = () => {
        for (let i = 0; i < linesPerPage; i++) {
            signaturePadRef.current[i + currentPage * linesPerPage]?.clear();
        }
    };

    const addPage = () => {
        setPages(prev => [...prev, true]);
        setCurrentPage(prev => prev + 1);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Write Prescription</h2>
            <div className="overflow-auto">
                {[...Array(linesPerPage)].map((_, index) => (
                    <canvas
                        key={index + currentPage * linesPerPage}
                        ref={(el) => (canvasRef.current[index + currentPage * linesPerPage] = el)}
                        width={window.innerWidth * 0.9}
                        height={250}
                        className="border border-gray-300 mb-2 bg-white"
                    />
                ))}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
                <button onClick={extractTextFromCanvas} disabled={isProcessing} className="p-2 bg-blue-600 text-white rounded-lg">
                    {isProcessing ? "Processing..." : "Extract Text"}
                </button>
                <button onClick={handleGeneratePDF} className="p-2 bg-green-600 text-white rounded-lg">
                    Generate PDF
                </button>
                <button onClick={clearCanvas} className="p-2 bg-red-600 text-white rounded-lg">
                    Clear Page
                </button>
                <button onClick={addPage} className="p-2 bg-purple-600 text-white rounded-lg">
                    Add Next Page
                </button>
            </div>
            <div className="border p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Extracted Text</h3>
                <textarea
                    className="w-full border rounded-lg p-2 text-gray-700"
                    rows="6"
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    placeholder="Your extracted text will appear here..."
                />
            </div>
        </div>
    );
}

export default ManualPrescription;
