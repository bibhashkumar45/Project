import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const DoctorContext = createContext();
const DoctorContextProvider = (props) => {
  const backUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profiledata, setProfileData]=useState(false);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(backUrl + "/api/doctor/appointment", {
        headers: { dToken },
      });
      if (data.success) {
        setAppointments(data.appointments);
        // console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.log(error);
        toast.error(error.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const CancleAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backUrl + "/api/doctor/cancle-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.log(error);
        toast.error(error.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backUrl + "/api/doctor/dashboard", {
        headers: { dToken },

      });

      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };





  const getProfileData=async()=>{
    try
    {
      const {data}=await axios.get(backUrl+'/api/doctor/profile',{headers:{dToken}});
      // console.log(data.profiledata);
      if(data.success)
      {
        setProfileData(data.profiledata);
        // console.log(data.profiledata);
      }
    }
    catch(error)
    {
      console.log(error);
      toast.error(error.message);
    }
  }



  const value = {
    dToken,
    setDToken,
    backUrl,
    getAppointments,
    appointments,
    setAppointments,
    completeAppointment,
    CancleAppointment,
    dashData,
    setDashData,
    getDashData,
    profiledata, 
    setProfileData,
    getProfileData
  };
  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
