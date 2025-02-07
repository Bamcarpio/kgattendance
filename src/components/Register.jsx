import { useState } from "react";
import { registerUser } from "../firebase";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    const result = await registerUser(username, password, name, address, contactNumber, jobPosition);
    if (result.success) {
      setMessage("Account created successfully!");
    } else {
      setMessage(result.error);
    }
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
      <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="text" placeholder="Address" onChange={(e) => setAddress(e.target.value)} />
      <input type="text" placeholder="Contact Number" onChange={(e) => setContactNumber(e.target.value)} />
      <input type="text" placeholder="Job Position" onChange={(e) => setJobPosition(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
      <p>{message}</p>
    </div>
  );
};

export default Register;
