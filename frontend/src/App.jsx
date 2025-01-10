import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AddNewData from "./pages/AddNewData";
import ViewData from "./pages/ViewData";
import DeleteTable from "./components/DeleteTable";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./components/PrivateRoute";
import Project from "./pages/ProjectPage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <AddNewData />
              </PrivateRoute>
            }
          />
          <Route
            path="/display"
            element={
              <PrivateRoute>
                <ViewData />
              </PrivateRoute>
            }
            />
          <Route
            path="/delete_table"
            element={
              <PrivateRoute>
                <DeleteTable />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/:project_id"
            element={
              <PrivateRoute>
                <Project/>
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;