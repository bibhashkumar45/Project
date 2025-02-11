import validator from "validator";
import bcrypt from 'bcrypt';
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

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
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);


    const userData={
      name,
      email,
      password:hashedPassword,
    }

    const newUser=new userModel(userData);
    const user=await newUser.save();

    // Create Token
    const token =jwt.sign({id:user._id},process.env.JWT_SCRETE);
    res.json({success:true,token});

  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message});
  }
}

export {registerUser};
