const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const processAudio = async (req,res) => {
  const audioPath = req.file.path;
  console.log(req.file);

  try {
    const whisperCommand = `whisper ${audioPath} --language en --output_dir results --task transcribe`;
    console.log("Running command:", whisperCommand);

    exec(whisperCommand,(error,stdout,stderr) => {
      if (error) {
        console.error("Whisper error:",stderr);
        res.status(500).json({ error: "Error processing audio" });
        return;
      }

      const resultFile = path.join("results", `${req.file.filename}.txt`);
      console.log("Result file path:", resultFile);

      try {
        const transcript = fs.readFileSync(resultFile,"utf-8");
        res.json({ transcript });
      } catch (err) {
        console.error("Error reading result file:", err);
        res.status(500).json({ error: "Error reading result file" });
      } finally {

        fs.unlink(audioPath,(err) => {
          if (err) {
            console.error("Error deleting audio file:", err);
          } else {
            console.log("Deleted audio file:", audioPath);
          }
        });

        const directory = "results";
        fs.readdir(directory,(err,files) => {
          if(err){
            throw err;
          }

          for(const file of files){
            fs.unlink(path.join(directory,file),(err) => {
              if(err){
                throw err;
              }
            });
          }
        });
      }
    });
  } catch (err) {
    console.error("Processing error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { processAudio };