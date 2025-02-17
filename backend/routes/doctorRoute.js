import express from 'express';
import { appointsDoctor, doctorList, loginDoctor,appointmentComplete,appointmentCancle,doctorDashboard ,doctoprProfile, updateDoctorProfile} from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter=express.Router();
doctorRouter.get('/list',doctorList);
doctorRouter.post('/login',loginDoctor);
doctorRouter.get('/appointment',authDoctor,appointsDoctor);
doctorRouter.post('/complete-appointment',authDoctor,appointmentComplete);
doctorRouter.post('/cancle-appointment',authDoctor,appointmentCancle);
doctorRouter.get('/dashboard',authDoctor,doctorDashboard);
doctorRouter.get('/profile',authDoctor,doctoprProfile);
doctorRouter.post('/update-profile',authDoctor,updateDoctorProfile);


export default doctorRouter;