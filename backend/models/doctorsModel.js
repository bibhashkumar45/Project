import mongoose from "mongoose";



const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password:{
      type:String,
      required:true
    },
    image: {
      type: String,
    
    },
    speciality: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      required: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
    slots_booked: {
      type: Object,
      default: {},
    },
  },
  { minimize: false }
); // imp

const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
  export default doctorModel;
