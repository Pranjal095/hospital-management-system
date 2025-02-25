import React, { useState } from "react";
import axios from "axios";
import Profile from "./components/Pathology";
import Prescription from "./components/Prescription";
import { HashRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import FlagImage from "./assets/flag.jpg";

function App() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [name, setName] = useState("");
  const [authLevel, setAuthLevel] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        import.meta.env.VITE_SERVER_URI + "/api/auth/fetch",
        { emailID: email }
      );

      if (response.data.authLevel) {
        setName(displayName);
        setAuthLevel(response.data.authLevel);
        navigate("/profile", {
          state: { name: displayName, authLevel: response.data.authLevel },
        });
      }
    } catch (error) {
      console.error(error);
      alert("Authentication failed");
    }
  };

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <div
              className="w-screen h-screen flex justify-center items-center overflow-hidden bg-gray-400 bg-no-repeat bg-cover bg-center"
              style={{ backgroundImage: `url(${FlagImage})` }}
            >
              <div className="bg-gray-200 p-8 rounded shadow-md w-full max-w-md m-10">
                <h1 className="text-center">Hospital Management System</h1>
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1 block w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="displayName" className="block text-gray-700">
                      Display Name
                    </label>
                    <input
                      type="text"
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                      className="mt-1 block w-full p-2 border rounded"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    Sign in
                  </button>
                </form>
              </div>
            </div>
          }
        />
        <Route path="/profile" element={<ProfileWrapper />} />
        <Route path="/prescription" element={<Prescription />} />
      </Routes>
    </div>
  );
}

function ProfileWrapper() {
  const location = useLocation();
  const { name, authLevel } = location.state || {};
  return (
    <Profile
      Details={{ doctorName: name, authLevel: authLevel || "Doctor", img: "" }}
    />
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;