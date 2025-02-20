const digitalCase = require("../models/digitalcase");

const addCase = async(req, res) =>{
    try{
        const { rfidCardId, docName, pdfLink } =req.body;
        const newCase = new digitalCase({
            rfidCardId,
            docName,
            pdfLink,
        });
        await newCase.save();
        res.status(201).json({
            message: "Case Added successfully",
            case: newCase,
        });


    }catch(e){
        res.status(500).json({
            message: "Case Was not Added",
            error: e.message
        });
    }
};

module.exports = { addCase };


