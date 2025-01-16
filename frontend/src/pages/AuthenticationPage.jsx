import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

const AuthenticationPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup

  return (
    <div className="auth-container">
      <div className="auth-toggle">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => setIsLogin(false)}
        >
          Signup
        </button>
      </div>
      <div className="auth-form">
        {isLogin ? <Login/> : <Signup/>}
      </div>
    </div>
  );
};

export default AuthenticationPage;