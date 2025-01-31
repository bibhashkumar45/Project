import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorsModel.js";
import jwt from "jsonwebtoken";

// API for adding doctors
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      available,
      fees,
      date,
      address,
    } = req.body;
    const imageFile = req.file;
    console.log({name})
    console.log(imageFile);

    // Checking for all data and add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !available ||
      !fees ||
      !address||
      !date
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Deatils" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Valid Email" });
    }

    // Validating Strong Password
    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Strong Password" });
    }

    // hashing doctore Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);



    // Upload Image TO Cloudinary
    // const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
    //   resource_type: "image",
    // });
    // const imageUrl = imageUpload.secure_url;

    // Add Doctore to Database
    const doctoreData={
      name,
      email,
      // image:
      password:hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address:JSON.parse(address),
      available,
      date:Date.now()
    }

    // Make Model
    const newDoctor=new doctorModel(doctoreData);
    await newDoctor.save();
    res.status(200).json({success:true, message:"Doctor Added Successfully"});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false, message:"Internal Server Error"});
  }
};

// API for the Admin Login
const loginAdmin=async(req,res)=>
{
  try{
    const {email,password}=req.body;
    if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD)
    {
      // tokenn generation
      const token=jwt.sign(email+password,process.env.JWT_SCRETE)
      res.json({success:true,token});

    }else
    {
      res.json({success:false, message:"Invalid Credentials"});
    }
  }
  catch(error)
  {
    console.log(error);
    res.json({success:false, message:error.message});
  }
}


export { addDoctor,loginAdmin };
