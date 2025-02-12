import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from "cloudinary";

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
    const imageFile=req.File;
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

export { registerUser, loginUser,getProfile,updateUser };
