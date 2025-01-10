import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // Import centralized API instance

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/api/login", { username, password }); // Use API instance
      localStorage.setItem("token", response.data.token); // Store JWT token
      localStorage.setItem("username", username); // Store username for ProfilePage
      alert("Login successful");
      navigate("/profile");
    } catch (err) {
      alert("Login failed: " + (err.response?.data.message || err.message));
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;