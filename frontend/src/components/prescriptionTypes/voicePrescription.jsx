import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";

function VoicePrescription({ Details = {} }) {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const audioChunksRef = useRef([]);

    useEffect(() => {
        if (isRecording && mediaRecorder) {
            mediaRecorder.start();
        }

        if (!isRecording && mediaRecorder) {
            mediaRecorder.stop();
        }
    }, [isRecording, mediaRecorder]);

    useEffect(() => {
        const initMediaRecorder = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(stream);

                recorder.ondataavailable = (event) => {
                    // Append new chunks to the ref (avoid state update issues)
                    audioChunksRef.current.push(event.data);
                };

                recorder.onstop = async () => {
                    // Create the audioBlob from collected chunks
                    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });

                    // Check if the audioBlob is empty before sending it
                    if (audioBlob.size === 0) {
                        console.error("Audio Blob is empty, not sending to server.");
                        return;
                    }

                    // Reset audioChunksRef
                    audioChunksRef.current = [];
                    await processAudio(audioBlob);
                };

                setMediaRecorder(recorder);
            } catch (err) {
                console.error("Error accessing microphone:", err);
            }
        };

        initMediaRecorder();
    }, []);

    const processAudio = async (audioBlob) => {
        const formData = new FormData();
        formData.append("audio", audioBlob);

        try {
            const response = await fetch(import.meta.env.VITE_SERVER_URI + "/api/audio", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.transcript) {
                setTranscript((prevTranscript) => prevTranscript + " " + data.transcript);
            }
        } catch (error) {
            console.error("Error processing audio:", error);
        }
    };

    const handleVoiceInput = () => {
        setIsRecording((prev) => !prev);
    };

    const handleClearText = () => {
        setTranscript("");
    };

    const handleGeneratePDF = async () => {
        const doc = new jsPDF();
        doc.setFontSize(12);

        if (!transcript.trim()) {
            alert("No text to save!");
            return;
        }

        doc.text("Prescription", 10, 10);
        doc.text(transcript || "No prescription text provided.", 10, 20);
    
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

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Voice Prescription</h2>
            <button
                onClick={handleVoiceInput}
                className={`p-2 ${isRecording ? "bg-red-600" : "bg-blue-600"} text-white rounded-lg mb-4`}
            >
                {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
            <button
                onClick={handleClearText}
                className="p-2 bg-gray-500 text-white rounded-lg mb-4 ml-2"
            >
                Clear Text
            </button>
            <button
                onClick={handleGeneratePDF}
                className="p-2 bg-green-600 text-white rounded-lg mb-4 ml-2"
            >
                Generate PDF
            </button>
            <div className="border p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Prescription Text</h3>
                <textarea
                    className="w-full border rounded-lg p-2 text-gray-700"
                    rows="6"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Your prescription text will appear here..."
                />
            </div>
        </div>
    );
}

export default VoicePrescription;
