import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { AdminContext } from "../context/AdminContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext.jsx";

const Login = () => {
  const [state, setState] = useState("Admin");
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const { setATOKEN, backendUrl } = useContext(AdminContext);
  const {dToken, setDToken, backUrl}=useContext(DoctorContext);

  console.log(state);



  const onSumitHandler=async(event)=>
  {
    event.preventDefault();
    try{
      if(state==='Admin')
      {
        const {data}=await axios.post(backendUrl+'/api/admin/login',{email,password});
        if(data.success)
        {
          localStorage.setItem('atoken',data.token);   //Token save on local Storage 
          setATOKEN(data.token);
          toast.success('Login successful! Welcome, Admin.');
        }
        else{
          toast.error(data.message);
        }
      }
      else
      {
        const {data} =await axios.post(backUrl+'/api/doctor/login',{email,password})
        console.log(data);
        if(data.success)
          {
            localStorage.setItem('dToken',data.dToken);   //Token save on local Storage 
            setDToken(data.dToken);
            console.log(data.dToken);
            
            toast.success('Login successful! Welcome, Doctor.');
          }
          else{
            toast.error(data.message);
          }
      }

    }catch(error)
    {

    }
  }



  return (
    <form onSubmit={onSumitHandler} className="min-h-[80vh] flex item-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-ww-96 border rounded-lg text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="text"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>
        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          Login
        </button>
        {state === "Admin" ? (
          <p>
            Doctor login?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState("Doctor")}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState("Admin")}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
