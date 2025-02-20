const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
    const filePath = req.query.filePath;
    if (!filePath) {
        return res.status(400).json({ error: "File path is required" });
    }
  
    const absolutePath = path.join(process.cwd(), filePath);
    res.sendFile(absolutePath, (err) => {
        if (err) {
            res.status(500).json({ error: "Error serving PDF file" });
        }
    });
});

module.exports = router;