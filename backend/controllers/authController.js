const Auth = require("../models/Auth");

const addUser=async(req,res)=>{
  try{
    const { emailID, authLevel } = req.body;
    let auth = await Auth.findOne({ emailID: emailID });

    //if user already exists, send invalid request message
    if(auth){
      res.json({ message: "Invalid request; user with given email ID already exists" })
    }
    else{
      auth = new Auth({
        emailID: emailID,
        authLevel: authLevel
      })

      await auth.save();

      res.status(200).json({ authLevel: auth["authLevel"] });
    }
  }
  catch(error){
    res.status(500).json({ message: error["message"] });
  }
}

const fetchAuthentication=async(req,res)=>{
  try{
    const { emailID } = req.body;
    let auth = await Auth.findOne({ emailID: emailID });

    //if user is not found in database, save it to the db with Patient status
    if(!auth){
      auth = new Auth({
        emailID: emailID,
        authLevel: "Patient"
      })
      
      await auth.save();
    }
    
    res.status(200).json({ authLevel: auth["authLevel"] });
  } 
  catch(error){
    res.status(500).json({ message: error["message"] });
  }
};

module.exports = { addUser, fetchAuthentication }