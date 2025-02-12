import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctor from "../components/RelatedDoctor";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, token, getDoctorData } =
    useContext(AppContext);

  const navigate = useNavigate();

  const dayOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [docInfo, setDocInfo] = useState(null);
  // Slots useState
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSloatIndex] = useState(0);
  const [slotTime, setSlotTime] = useState();

  const fetcDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlot = async () => {
    setDocSlot([]);
    // Getting Current Date
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      // getting data of next 7 days with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // Setting End time of date with index

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // Setting hours if you are same date
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() >= 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlot = [];
      while (currentDate < endTime) {
        let formatedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        // add slot to array

        let day = currentDate.getDate();
        let month = currentDate.getMonth()+1;
        let year = currentDate.getFullYear();

        const slotData = day + "_" + month + "_" + year;
        const slotTime = formatedTime;

        // Add only that whose is not booked
        const isSlotAvailable =
          docInfo.slots_booked[slotData] &&
          docInfo.slots_booked[slotData].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          timeSlot.push({
            dateTime: new Date(currentDate),
            time: formatedTime,
          });
        }

        // increment current timr by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlot((pre) => [...pre, timeSlot]);
    }
  };

  const BookAppoitment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    try {
      const date = docSlot[slotIndex][0].dateTime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotData = day + "_" + month + "_" + year;
      console.log(slotData);

      const { data } = await axios.post(
        "http://localhost:4000/api/user/book-appointment",
        { docId, slotData, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAvailableSlot();
  }, [docInfo]);

  useEffect(() => {
    fetcDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    // console.log(docSlot);
    // console.log(slotIndex);
  }, [docSlot]);

  return (
    docInfo && (
      <div className="mt-4">
        {/* Doctore Details */}

        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>
          {/* -------- Doc Info : name, degree , experience  -------  */}
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 ">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}{" "}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree}-{docInfo.speciality}
              </p>
              <button className="">{docInfo.experience}</button>
            </div>

            {/* ---------- Doctor About------------------------- */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img className="w-3" src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4 ">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/*----- Booking Slots--------  */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlot.length &&
              docSlot.map((items, index) => (
                <div
                  onClick={() => setSloatIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white "
                      : "border border-gray-200"
                  }`}
                  key={index}
                >
                  <p>{items[0] && dayOfWeek[items[0].dateTime.getDay()]}</p>
                  <p>{items[0] && items[0].dateTime.getDate()}</p>
                </div>
              ))}
          </div>

          <div className=" flex items-center gap-3  overflow-x-scroll mt-4">
            {docSlot.length &&
              docSlot[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light  px-5 py-2  rounded-xl cursor-pointer ${
                    item.time === slotTime
                      ? "bg-primary text-white"
                      : "text-gray-400 border border-gray-300"
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>

          <button
            onClick={BookAppoitment}
            className="bg-primary text-white text-sm font-light px-14 py-3 my-6 rounded-full"
          >
            Book an appointment
          </button>
          <RelatedDoctor docId={docId} speciality={docInfo.speciality} />
        </div>
      </div>
    )
  );
};

export default Appointment;
