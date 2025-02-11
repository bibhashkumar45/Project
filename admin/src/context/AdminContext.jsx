import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();
const AdminContextProvider = (props) => {
  const [atoken, setATOKEN] = useState(
    localStorage.getItem("atoken") ? localStorage.getItem("atoken") : ""
  );
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-doctors",
        {},
        { headers: { atoken } }
      );
      if (data.success) {
        setDoctors(data.doctors);
        // console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeAvailabolity=async(docId)=>
  {
    try{
      const {data}=await axios.post(backendUrl+"/api/admin/change-availability",{docId},{headers:{atoken}});
      if(data.success)
      {
        toast.success(data.message);
        getAllDoctors();
      }
      else
      {
        toast.error(data.error);
      }

    }
    catch(error)
    {
      toast.error(error.message);
    }
  }


  const value = {
    atoken,
    setATOKEN,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailabolity,
  };
  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
