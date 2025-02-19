import express from "express";
import { bookAppointment, getProfile, loginUser, registerUser, updateUser,listAppointments, cancleAppointment } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter=express.Router();
userRouter.post('/resister',registerUser)
userRouter.post("/login",loginUser);
userRouter.get("/get-profile",authUser,getProfile);
userRouter.post('/update-profile',upload.single('image'),authUser,updateUser);
userRouter.post('/book-appointment',authUser,bookAppointment);

userRouter.get("/appointments",authUser,listAppointments);
userRouter.post('/cancle-appointment',authUser,cancleAppointment);

export default userRouter;    









// bookAppointment