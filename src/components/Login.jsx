import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../firebase";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const result = await loginUser(username, password);
    if (result.success) {
      setMessage("Login successful!");
      // Redirect to the attendance page or dashboard
      navigate("/attendance");
    } else {
      setMessage(result.error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
    </div>
  );
};

export default Login;
