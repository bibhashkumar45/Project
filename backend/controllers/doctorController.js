import doctorModel from "../models/doctorsModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

const changeAvailability=async(req, res)=>
{
  try{
    const {docId}=req.body;
    const docData=await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId,{available:!docData.available});
    res.json({success:true,message:"Availability Changed"});
  }
  catch(error)
  {
    console.log(error);
    res.json({success:false,message:error.message});
  }
}

const doctorList=async(req,res)=>
{
  try{
    const doctors=await doctorModel.find({}).select(['-password','-email'])
    res.json({success:true,doctors})
  }catch(error)
  {
    console.log(error);
    res.json({success:false,message:error.message});
  }

}



// API for doctors
const loginDoctor=async(req,res)=>
{

  try
  {
    const {email, password}=req.body;
    const doctor=await doctorModel.findOne({email});
    if(!doctor)
    {
      return res.json({success:false,message:"Invalid credentials"});
    }

    const isMatch=await bcrypt.compare(password,doctor.password);
    if(isMatch)
    {
      const docToken=jwt.sign({id:doctor._id},process.env.JWT_SCRETE);
      res.json({success:true,docToken})
    }
    else
    {
      return res.json({success:false,message:"Invalid credentials"});
    }

  }
  catch(error)
  {
    console.log(error);
    res.json({success:false,message:error.message});
  }
}

export {changeAvailability, doctorList,loginDoctor};