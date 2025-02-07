import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "./firebase";
import "./App.css"; 
import Attendance from "./components/Attendance";
import Dashboard from "./components/Dashboard.jsx"; // Import Dashboard component

const App = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  // State for registration fields
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    address: "",
    contactNumber: "",
    jobPosition: "",
    password: "",
  });

  const handleLogin = async () => {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    
    const result = await loginUser(username, password);
    if (result.success) {
      const userData = result.userData;
      setMessage(`Welcome, ${userData.name}!`);

      // Check if the user is an admin
      if (userData.isAdmin) {
        navigate("/dashboard"); // Redirect to the admin dashboard
      } else {
        navigate("/attendance"); // Redirect normal users to attendance page
      }
    } else {
      setMessage(result.error);
    }
  };

  const handleRegister = async () => {
    const { name, username, address, contactNumber, jobPosition, password } = registerData;
    
    const result = await registerUser(username, password, name, address, contactNumber, jobPosition);
    if (result.success) {
      setMessage("Account created successfully!");
      navigate("/login");
    } else {
      setMessage(result.error);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* Login Form */}
      <Route
        path="/login"
        element={
          <div className="auth-form">
            <img src="/logo.png" alt="Logo" className="logo" />
            <h2>Login</h2>
            <input type="text" placeholder="Username" id="login-username" />
            <input type="password" placeholder="Password" id="login-password" />
            <button onClick={handleLogin}>Login</button>
            <button onClick={() => navigate("/register")}>Switch to Register</button>
            <p>{message}</p>
          </div>
        }
      />

      {/* Register Form */}
      <Route
        path="/register"
        element={
          <div className="auth-form">
            <img src="/logo.png" alt="Logo" className="logo" />
            <h2>Register</h2>
            <input type="text" placeholder="Full Name" onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} />
            <input type="text" placeholder="Username" onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })} />
            <input type="text" placeholder="Address" onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })} />
            <input type="text" placeholder="Contact Number" onChange={(e) => setRegisterData({ ...registerData, contactNumber: e.target.value })} />
            <input type="text" placeholder="Job Position" onChange={(e) => setRegisterData({ ...registerData, jobPosition: e.target.value })} />
            <input type="password" placeholder="Password" onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} />
            <button onClick={handleRegister}>Register</button>
            <button onClick={() => navigate("/login")}>Switch to Login</button>
            <p>{message}</p>
          </div>
        }
      />

      <Route path="/attendance" element={<Attendance />} />
      <Route path="/dashboard" element={<Dashboard />} /> {/* Admin Dashboard Route */}
    </Routes>
  );
};

export default App;
