import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from "cloudinary";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorsModel.js";
import razorpay from "razorpay";

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing Details.." });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter Valid Email..." });
    }

    if (password.length < 0) {
      return res.json({ success: false, message: "Enter strong password" });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    // Create Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SCRETE);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};







// API For User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Ensure email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SCRETE);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API get userProfile Data
const getProfile=async(req,res)=>
{
  try{

    const {userId}=req.body;
    const userData=await userModel.findById(userId).select('-password');
    res.json({success:true,userData});
  }
  catch(error)
  {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}



//Api for update profile
const updateUser=async(req,res)=>
{
  try{
    const {userId, name, phone, address, dob,gender}=req.body;
    const imageFile=req.file;
    console.log(imageFile);

    if(!name || !phone ||!dob || !gender)
    {
      return res.json({success:false, message:"Data Missing"});
    }
    await userModel.findByIdAndUpdate(userId,{name,phone,dob,address:JSON.parse(address),gender});
    if(imageFile)
    {
      // Upload Image to cloudinary
      const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'});
      const imageUrl=imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId,{image:imageUrl});
    }
    res.json({success:true,message:"Profile Updated"});
  }
  catch(error)
  {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


// Api to book appointment

const bookAppointment=async(req,res)=>
{
  try{
    const {userId,docId,slotData, slotTime}=req.body;

    const docData=await doctorModel.findById(docId).select('-password');

    if(!docData.available)
    {
      return res.json({success:false, message:'Doctor not available'});
    }
    let slots_booked=docData.slots_booked;

    // Checking for slot availability
    if(slots_booked[slotData])
    {
      if(slots_booked[slotData].includes(slotTime))
      {
        return res.json({success:false, message:'Slot not available'});
      }
      else
      {
        slots_booked[slotData].push(slotTime);
      slots_booked[slotData].push(slotTime);
      }
    }
    else
    {
      slots_booked[slotData]=[]
      slots_booked[slotData].push(slotTime);
    }

    const userData=await userModel.findById(userId).select('-password');
    delete docData.slots_booked

    const appointmentData={
      userId,
      docId,
      userData,
      docData,
      amount:docData.fees,
      slotTime,
      slotData,
      date:Date.now()
    }

    const newAppointment=new appointmentModel(appointmentData);
    await newAppointment.save();

    // save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId,{slots_booked});
    res.json({success:true,message:'Appointment Booked'});
  }
  catch(error)
  {
    console.log(error);
    res.json({ success: false, message: error.message });
  }

}

// API to get user appointment for frontEnd my-appointment page
const listAppointments=async(req,res)=>
{
  try{
    const {userId}=req.body;
    const  appointments=await appointmentModel.find({userId});
    res.json({success:true,appointments});
  }
  catch(error)
  {
    console.log(error);
    res.json({ success: false, message: error.message });
  }

}


// Api to cancle the appointment
const cancleAppointment=async(req,res)=>
{
  try
  {
    const {userId, appointmentId}=req.body;
    const appointmentData=await appointmentModel.findById(appointmentId);
    console.log(appointmentData);
  
    // Verify appointment User
    if(appointmentData.userId!==userId)
    {
      return res.json({success:false,message:"Unauthorized action"});
    }

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

// Api for payment integration using razorPay

// const razorPayInstance=new razorpay({
//   key_id:'',
//   key_secret:''

// });

// const paymentRazorpay=async(req,res)=>
// {

// }


export { registerUser, loginUser,getProfile,updateUser,bookAppointment,listAppointments,cancleAppointment};
