import React, { useState } from "react";
import "../index.css";
import Card from "./card";
import Entries from "./entries";
import Header from "./header";

function Profile({ Details = {} }) {
  const [details, setDetails] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const patientId = e.target.form[0].value;
    try {
      console.log("Fetching patient data for patient ID:", patientId);
      const response = await fetch(import.meta.env.VITE_SERVER_URI+`/api/patients/${patientId}`);
      const data = await response.json();
      data.doctorName = Details.doctorName;
      setDetails(data);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  return (
    <div className="m-0 p-0 w-screen min-h-screen flex-col gap-y-16 overflow-x-hidden justify-center items-center">
      <Header Department={"Pathology"} />

      <div className="identity flex flex-col lg:flex-row m-auto p-0 w-full lg:w-10/12 gap-8 lg:gap-16 mb-20">
        {/* Pass Details as a prop */}
              <div className="m-4">
              <Card Details={details} />
              </div>
              <div className="details flex-1 text-center">
              <div className="text-center lg:text-right text-3xl font-semibold mt-5">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-5">
                <div>
                  <h1 className="text-left lg:text-right">UID:</h1>
                  <h1 className="text-left lg:text-right">{details.rfidCardId || "-------------"}</h1>
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-medium">Doctor Name:</h1>
                  <h1>{Details.doctorName || "Doctor"}</h1>
                </div>
              </div>
              <div className="border-2 mt-5"></div>
            </div>

              <div className="flex-1">
                <h2 className="text-3xl font-semibold mt-5">Get Patient Data</h2>
                <form className="mt-5">
                <input
                  type="text"
                  placeholder="Enter Patient ID"
                  className="border-2 p-2 w-full lg:w-auto"
                />
                <button
                  type="submit"
                  onClick={handleSubmit}
                className="mt-5 bg-blue-500 text-white p-2 rounded"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      <Entries Details={details} />
    </div>
  );
}

export default Profile;
