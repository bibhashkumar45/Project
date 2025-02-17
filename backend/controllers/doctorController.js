import doctorModel from "../models/doctorsModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import appointmentModel from "../models/appointmentModel.js";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for doctors
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const dToken = jwt.sign({ id: doctor._id }, process.env.JWT_SCRETE);
      res.json({ success: true, dToken });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Api to get doctor appointment for doctor panel

const appointsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for mark appointment completed for doctor panel

const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      res.json({ success: true, message: "Appointment Completed" });
    } else {
      res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//  API for cancle appointment by that particular doctor
const appointmentCancle = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      res.json({ success: true, message: "Appointment Cancelled" });
    } else {
      res.json({ success: false, message: "Cancelation Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API To get dashboard data fro doctor  panel
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });
    let earning = 0;
    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earning += item.amount;
      }
    });

    let patients = [];
    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earning,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// API to get doctor profile for Doctor Panel

const  doctoprProfile=async(req,res)=>
{
  try{

    const {docId} =req.body;
    const profiledata=await doctorModel.findById(docId).select('-password');
    res.json({success:true,profiledata});
  }
  catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// API to Update Doctor Profile from doctor Panel

const updateDoctorProfile=async(req,res)=>
{
  try{
    const {docId, fees,address,available}=req.body;
    await doctorModel.findByIdAndUpdate(docId,{fees, address, available});
    res.json({success:true,message:"Profile Updated"});
  }
  catch(error)
  {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}




export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointsDoctor,
  appointmentComplete,
  appointmentCancle,
  doctorDashboard,
  doctoprProfile,
  updateDoctorProfile
};
