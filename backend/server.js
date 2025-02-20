const express = require("express");
const cors = require('cors');
const { exec } = require('child_process');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const patientRoutes = require("./routes/patientRoutes");
const labReportRoutes = require("./routes/labReportRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const audioRoutes = require("./routes/audioRoutes");
const pdfRoutes = require("./routes/pdfRoutes");

dotenv.config();
connectDB();

const app = express();
// for testing purposes
// app.use(cors());
app.use(express.json());
app.use("/api/patients", patientRoutes);
app.use("/api/lab-reports", labReportRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/getDocuments", documentRoutes);
app.use("/api/audio", audioRoutes);
app.use("/api/pdf", pdfRoutes);

const PORT = 3000;

const pythonServer = exec('backend/venv/bin/python backend/server.py', (error, stdout, stderr) => {
    if (error) console.error(`Python server error: ${error}`);
    if (stderr) console.error(`Python server stderr: ${stderr}`);
    console.log(`Python server stdout: ${stdout}`);
});

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`Express server running on http://127.0.0.1:${PORT}`);
});

// Cleanup on exit
process.on('exit', () => {
    pythonServer.kill();
});
