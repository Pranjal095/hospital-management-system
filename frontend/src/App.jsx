import React, { useState } from "react";
import { signInWithGoogle } from "./firebaseConfig";
import FlagImage from "./assets/flag.jpg"
import axios from "axios";
import Profile from "./components/Pathology";
import Prescription from "./components/Prescription";
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";

function App() {
  const [name, setName] = useState("");
  const [authLevel, setAuthLevel] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const { user } = result;
      const emailID = user.email;
      const displayName = user.displayName;

      const response = await axios.post(
        import.meta.env.VITE_SERVER_URI + "/api/auth/fetch",
        { emailID }
      );

      if (response.data.authLevel) {
        setName(displayName);
        setAuthLevel(response.data.authLevel);
        navigate("/profile", { state: { name: displayName, authLevel: response.data.authLevel } });
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
            <div className="w-screen text-center flex w-screen h-screen justify-end items-start overflow-hidden bg-gray-400 bg-no-repeat bg-cover bg-center" style={{backgroundImage:`url(${FlagImage})`}}>
              <div className="bg-gray-200 p-8 rounded shadow-md w-full max-w-md m-10">
                <h1 className="text-center">Hospital Management System</h1>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  onClick={handleLogin}
                >
                  Sign in with Google
                </button>
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
  return <Profile Details={{ doctorName: name, authLevel: "Doctor", img: "" }} />;
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
