import React, { useState } from "react";
import FilterIcon from "../assets/filter.svg";
import AddIcon from "../assets/add.svg";
import SearchIcon from "../assets/search.svg";
import AddEntry from "./addEntry";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

function Entries({ Details = {} }) {
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  const toggleAddEntry = () => {
    navigate("/prescription", {
      state: Details
    });
  };

  const handleAddEntry = async (newEntry) => {
    setEntries((prevEntries) => [...prevEntries, newEntry]);
    setShowAddEntry(false);
  };

  const viewPDF = async (filePath) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/api/pdf?filePath=${encodeURIComponent(filePath)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch PDF");
      }

      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="w-full md:w-10/12 m-auto p-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-5 text-center md:text-left">
        Entries
      </h1>
      <div className="flex flex-col border-2 border-gray-300 p-5 rounded-lg mb-10">
        <div className="flex gap-4 md:gap-6 items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={FilterIcon}
              className="bg-gray-200 p-2 rounded-lg"
              alt="Filter"
            />
            <div className="flex items-center gap-2 bg-gray-200 p-2 rounded-lg border-b-2 border-r-2 border-gray-300 flex-1">
              <img src={SearchIcon} alt="Search" />
              <input
                type="text"
                className="bg-gray-200 text-black border-none focus:outline-none w-2/4"
                placeholder="Search..."
              />
            </div>
          </div>

          {(
            <button
              className="p-2 bg-indigo-800 text-white rounded-lg flex items-center gap-2"
              onClick={toggleAddEntry}
            >
              <img src={AddIcon} alt="Add" />
              <span className="hidden sm:inline-block">Add</span>
            </button>
          )}
        </div>

        {showAddEntry && (
          <div className="mt-4">
            <AddEntry onAdd={handleAddEntry} />
          </div>
        )}

        <div className="max-h-80 overflow-y-scroll overflow-x-hidden mt-4">
          <table className="text-left w-full mt-2">
            <thead>
              <tr className="text-xs md:text-sm justify-between gap-4 p-2">
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Date</th>
                <th className="text-right">Property</th>
              </tr>
            </thead>
            <tbody>

              {Details.medicalHistory && Details.medicalHistory.map((entry, index) => (
                <tr key={index} className="text-sm md:text-normal bg-gray-100">
                  <td className="p-2 md:p-4">{index + 1}</td>
                  <td>{Details.medicalHistory[index].doctorName}</td>
                  <td>
                    Standard Medical Prescription (Ready to Download/Print)
                  </td>
                  <td>
                    <span className="p-2 pl-4 pr-4 bg-gray-400 text-black text-center rounded-3xl mt-2">
                      {formatDate(Details.medicalHistory[index].prescribedDate)}
                    </span>
                  </td>
                  <td className="text-right p-2 md:p-4">
                    <a
                      onClick={() => viewPDF(Details.medicalHistory[index].prescribedFile)}
                      className="underline cursor-pointer"
                    >
                      View PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Entries;