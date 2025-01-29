import React, { useState } from "react";
import { assets } from "../assets/assets_frontend/assets";

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: "Bibhash Kumar",
    image: assets.profile_pic,
    email: "bittu@gmail.com",
    phone: "7261896262",
    address: {
      line1: "Mohali Panjab",
      line2: "India",
    },
    gender: "Male",
    dob: "2000-01-20",
  });
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm mt-4">
      <img className="w-36 rounded" src={userData.image} alt="" />
      {isEdit ? (
        <input
        className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
          type="text"
          value={userData.name}
          onChange={(e) =>
            setUserData((pre) => ({ ...pre, name: e.target.value }))
          }
        />
      ) : (
        <p
        className="font-medium text-2xl text-neutral-900 mt-4"
        >{userData.name}</p>
      )}
      <hr className="bg-zinc-400 h-[1px] border-none " />
      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">   
          <p className="font-medium">Email id :</p>
          <p  className="text-blue-800"> {userData.email}</p>
          <p className="font-medium">Phone : </p>
          {isEdit ? (
            <input
            className="bg-gray-100 max-w-20"
              type="text"
              value={userData.phone}
              onChange={(e) =>
                setUserData((pre) => ({ ...pre, phone: e.target.value }))
              }
            />
          ) : (
            <p className="text-blue-800">{userData.phone}</p>
          )}

          <p className="font-medium">Address :</p>
          {isEdit ? (
            <p>
              <input
               className="bg-gray-50 "
              value={userData.address.line1}
              onChange={(e)=>setUserData(pre=>({...pre, address:{...pre.address, line1:e.target.value}}))}
              type="text" />
              <br />

              <input 
               className="bg-gray-50"
                value={userData.address.line2}
              onChange={(e)=>setUserData(pre=>({...pre, address:{...pre.address, line2:e.target.value}}))}
              type="text" />
            </p>
          ) : (
            <p className="text-gray-500">
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] mt-3 text-neutral-700">
          <p className="font-medium">Gender: </p>
          {isEdit 
          ?
          <select 
          className="max-w-20 bg-gray-50 "
          onChange={(e)=>setUserData(prev=>({...prev, gender:e.target.value}))}
          value={userData.gender}>
  
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          : <p className="text-gray-500">{userData.gender}</p>
        }

        <p className="font-medium mt-3">Birthday: </p>
        {
          isEdit?
          <input 
          className='max-w-28 bg-gray-50 mt-2'  
          type="date" 
          onChange={(e)=>setUserData(prev=>({...prev, dob:e.target.value}))}
           />
          :
          <p className="text-gray-400 mt-3">{userData.dob}</p>
        }
        </div>
      </div>

      <div>
        {
          isEdit
          ?
          <button className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all" onClick={()=>setIsEdit(false)}>Save Information</button>
          :
          <button className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all "  onClick={()=>setIsEdit(true)}>Edit</button>
        }
      </div>

  
    </div>
  );
};

export default MyProfile;
