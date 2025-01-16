import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AuthenticationPage from "./pages/AuthenticationPage";
import RawDatasetsPage from "./pages/RawDatasetsPage";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import SettingsPage from "./pages/SettingsPage";
import DataPipelinesPage from "./pages/DataPipelinesPage";
import ModelsPage from "./pages/ModelsPage";
import DataPipelineWorkspace from "./workspaces/DataPipelineWorkspace";
import RawDatasetWorkspace from "./workspaces/RawDatasetWorkspace";

export default function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Router>
      {isLoggedIn ? (
        <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/raw_datasets" element={<Layout><RawDatasetsPage /></Layout>} />
            <Route path="/data_pipelines" element={<Layout><DataPipelinesPage /></Layout>} />
            <Route path="/models" element={<Layout><ModelsPage /></Layout>} />
            <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
            <Route path="/account" element={<Layout><AccountPage /></Layout>} />
            
            <Route path="/data_pipeline_workspace/:id" element={<DataPipelineWorkspace/>} />
            <Route path="/raw_dataset_workspace/:dataset" element={<RawDatasetWorkspace/>} />
    
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="*" element={<AuthenticationPage />} /> {/* Redirect all to Authentication */}
        </Routes>
      )}
    </Router>
  );
}