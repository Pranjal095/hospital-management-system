import React, { useState } from "react";
import AddIcon from "../assets/add.svg";

function AddEntry({ onAdd }) {
    console.log('onAdd prop in AddEntry:', onAdd); // Debugging log
  
    const [newEntry, setNewEntry] = useState({
      name: "",
      description: "",
      status: "",
      property: ""
    });
    const [isFormVisible, setIsFormVisible] = useState(true);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewEntry((prevEntry) => ({
        ...prevEntry,
        [name]: value
      }));
    };
  
    const handleAddEntry = () => {
      if (newEntry.name && newEntry.description && newEntry.status && newEntry.property) {
        if (typeof onAdd === 'function') {
          onAdd(newEntry);
          setNewEntry({
            name: "",
            description: "",
            status: "",
            property: ""
          });
          setIsFormVisible(false); // Hide the form after submission
        } else {
          console.error('onAdd is not a function:', onAdd);
        }
      } else {
        alert("Please fill in all fields");
      }
    };
  
    return (
      <div className="border-2 border-gray-300 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Add New Entry</h2>
        <input
          type="text"
          name="name"
          value={newEntry.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="block mb-2 p-2 w-full border rounded"
        />
        <textarea
          name="description"
          value={newEntry.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="block mb-2 p-2 w-full border rounded"
        />
        <input
          type="text"
          name="status"
          value={newEntry.status}
          onChange={handleInputChange}
          placeholder="Status"
          className="block mb-2 p-2 w-full border rounded"
        />
        <input
          type="text"
          name="property"
          value={newEntry.property}
          onChange={handleInputChange}
          placeholder="Property"
          className="block mb-4 p-2 w-full border rounded"
        />
        <button
          onClick={handleAddEntry}
          className="p-2 bg-green-600 text-white rounded-lg"
        >
          Add Entry
        </button>
      </div>
    );
  };
  
  export default AddEntry;
  
