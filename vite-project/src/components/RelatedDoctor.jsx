import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const RelatedDoctor= ({docId,speciality}) => {
  const navigate=useNavigate();
  const {doctors}=useContext(AppContext);
  const [relDoc,setRelDoc]=useState([]);

  useEffect(()=>{
    if(doctors.length>0 && speciality)
    {
      const doctoreData=doctors.filter((doc)=> doc.speciality===speciality && doc._id!=docId)
      setRelDoc(doctoreData);
    }

  },[doctors,speciality,docId]);
  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10 '>
    <h1 className='text-3xl font-medium'>Related Doctors</h1>
    <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>

    <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
      {relDoc.slice(0,5).map((items,index)=>
      (
        <div key={index}
        onClick={()=>{navigate(`/appointment/${items._id}`); scrollTo(0,0)}}
        className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 '
        >
          <img className='bg-blue-50' src={items.image} alt="" />
          <div className='p-4'>
            <div className='flex items-center gap-2 text-sm text-center text-green-500 '>
              <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
            </div>
            <p className='text-gray-900 text-lg font-medium'>{items.name}</p>
            <p className='text-gray-600 text-sm '>{items.speciality}</p>
            <p></p>
          </div>
        </div>
      ))}
    </div>
    <button 
    onClick={()=>{navigate('/doctors'); scrollTo(0,0)}}
     className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'>more</button>
  </div>
  )
}

export default RelatedDoctor;