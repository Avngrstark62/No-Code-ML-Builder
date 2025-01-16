import { useLocation, NavLink } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="logo">MyApp</div>
        <ul className="menu">
          <li>
            <NavLink
              to="/"
              className={location.pathname === "/" ? "active" : ""}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/raw_datasets"
              className={location.pathname === "/raw_datasets" ? "active" : ""}
            >
              Raw Datasets
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/data_pipelines"
              className={location.pathname === "/data_pipelines" ? "active" : ""}
            >
              Data Pipelines
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/models"
              className={location.pathname === "/models" ? "active" : ""}
            >
              Models
            </NavLink>
          </li>
        </ul>
        <div className="sidebar-footer">
          <NavLink
            to="/settings"
            className={location.pathname === "/settings" ? "active" : ""}
          >
            Settings
          </NavLink>
          <NavLink
            to="/account"
            className={location.pathname === "/account" ? "active" : ""}
          >
            Account
          </NavLink>
        </div>
      </nav>
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

// const Layout = ({ children }) => {
//   const navigate = useNavigate();
//   const isLoggedIn = !!localStorage.getItem("token");

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     alert("Logged out successfully");
//     navigate("/");
//   };
        

//   return (
//     <div>
//       <nav>
//         <Link to="/">Home</Link>
//         {isLoggedIn ? (
//           <>
//             <Link to="/upload">Add Data</Link>
//             <Link to="/display">View Data</Link>
//             <Link to="/delete_table">Delete Data</Link>
//             <Link to="/profile">Profile</Link>
//             <button onClick={handleLogout}>Logout</button>
//           </>
//         ) : (
//           <>
//             <Link to="/login">Login</Link>
//             <Link to="/signup">Signup</Link>
//           </>
//         )}
//       </nav>
//       <main>{children}</main>
//     </div>
//   );
// };

// export default Layout;