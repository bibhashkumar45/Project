import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import {assets} from '../../assets/assets';

const AllApointments = () => {

  const {atoken, appointment, setAppointments, getAllAppointments,cancleAppointment}=useContext(AdminContext);

  const {calculateAge,slotDataFormat,currency}=useContext(AppContext);
  useEffect(()=>
  {
    if(atoken)
    {
      getAllAppointments();
    }
  },[atoken])




  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {appointment.map((item,index)=>
        (
          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-100' key={index}>
            <p className='max-sm:hidden'>{index+1}</p>
            <div className='flex items-center gap-2'>
              <img  className='w-8 rounded-full' src={item.userData.image} alt="" />
              <p className="">{item.userData.name}</p>
            </div>

            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDataFormat(item.slotData)}, {item.slotTime}</p>


            <div className='flex items-center gap-2'>
              <img  className='w-8 rounded-full bg-gray-200' src={item.docData.image} alt="" />
              <p className="w-fit cursor-pointer">{item.docData.name}</p>
            </div>


            <p>{currency}{item.amount}</p>
            {item.cancelled
            ? <p  className='text-red-400 text-xs font-medium'>Cancelled</p>
            :  <img 
            onClick={()=>cancleAppointment(item._id)}
            src={assets.cancel_icon} alt="" />
            }
          


          </div>
        ))}




      </div>
    </div>
  )
}
 
export default AllApointments;