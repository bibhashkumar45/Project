import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorsModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

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
      fees,
      address,
    } = req.body;

    console.log("Doctor Details:");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Speciality:", speciality);
    console.log("Degree:", degree);
    console.log("Experience:", experience);
    console.log("About:", about);
    console.log("Fees:", fees);
    console.log("Address:", address);

    const imageFile = req.file;
    console.log({ name });
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
      !fees ||
      !address
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Missing Deatils Mai admin controller se hu bhai",
        });
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
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    // Add Doctore to Database
    const doctoreData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    // Make Model
    const newDoctor = new doctorModel(doctoreData);
    await newDoctor.save();
    res
      .status(200)
      .json({ success: true, message: "Doctor Added Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// API for the Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // tokenn generation
      const token = jwt.sign(email + password, process.env.JWT_SCRETE);
      console.log("Tu Login ho gya hai bhai");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials nhi hai bhai" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all admnin panel

const allDoctors = async (req, res) => {
  try {
    const doctors=await doctorModel.find({}).select('-password');
    res.json({success:true,doctors});

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// API to get all appointment list

const appointmentsAdmin= async (req,res)=>
{
  try{
    const appointments=await appointmentModel.find({})
    res.json({success:true,appointments});
  }
  catch(error)
  {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


// Api for admin cancellation

const appointmentCancleAdmin=async(req,res)=>
  {
    console.log("outside");
    try
    {
      console.log("outside");
      const { appointmentId}=req.body;
      const appointmentData=await appointmentModel.findById(appointmentId);
      console.log(appointmentData);
  
      await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});
      // releasing doctor slot
  
      const {docId, slotData, slotTime}=appointmentData;
      const doctorData=await doctorModel.findById(docId);
      let slots_booked=doctorData.slots_booked;
      slots_booked[slotData]=slots_booked[slotData].filter(e=>e!==slotTime)
      await doctorModel.findByIdAndUpdate(docId, {slots_booked});
      res.json({success:true, message:'Appointment Cancelled'});
  
    }
    catch(error)
    {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  
  }

  // API for get dashboard data for admin panel
  const adminDashboard =async(req,res)=>
  {
    try
    {
      const doctors= await doctorModel.find({});
      const users=await userModel.find({});
      const appointment=await appointmentModel.find({});

      const dashData={
        doctors:doctors.length,
        appointments:appointment.length,
        patients:users.length,
        latestAppointments:appointment.reverse().slice(0,5)
      }
      res.json({success:true, dashData});
    }
    catch(error)
    {
      console.log(error);
      res.json({ success: false, message: error.message });
    }

  }



export { addDoctor, loginAdmin ,allDoctors,appointmentsAdmin,appointmentCancleAdmin,adminDashboard};
