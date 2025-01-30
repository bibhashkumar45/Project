import { createContext, useState } from "react";

export const  AdminContext = createContext();
const AdminContextProvider = (props) => {
  const [atoken, setATOKEN]=useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'');
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
  const value = {
    atoken,setATOKEN, backendUrl
  };
  return <AdminContext.Provider value={value}>{props.children}</AdminContext.Provider>;
};

export default AdminContextProvider;
