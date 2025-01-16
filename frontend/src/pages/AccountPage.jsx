import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
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
    <div className="account-page">
      <div className="account-header">
        <h1>Welcome, {username}!</h1>
        <p>Your account is your gateway to manage your projects and data.</p>
      </div>
      <div className="account-options">
        <button className="btn">View Profile</button>
        <button className="btn">Edit Account</button>
        <button
          className="btn btn-logout"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default AccountPage;