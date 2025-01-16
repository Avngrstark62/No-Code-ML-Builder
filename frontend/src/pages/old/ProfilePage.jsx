import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in first.");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <p>Manage your files and data securely.</p>
    </div>
  );
};

export default ProfilePage;