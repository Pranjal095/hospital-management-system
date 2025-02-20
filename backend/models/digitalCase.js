const mongoose = require("mongoose");

const digitalCaseSchema = new mongoose.Schema({
    rfidCardId: { type: String, ref: 'Patient', unique: true, required: true },
    DocName: { type: String, required: true},
    pdfLink: {type: String, required: true}
});
const digitalCase = mongoose.model("Case", digitalCaseSchema);
module.exports = digitalCase;