import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// CSV
export const uploadCsv = (formData) => API.post("/api/csv/upload", formData);
export const fetchCsvData = (fileName) => API.get(`/api/csv/data/${fileName}`);
export const fetchTableNames = () => API.get("/api/csv/tables");
export const deleteTable = (tableName) => API.delete(`/api/csv/delete_table/${tableName}`);

// Data Pipelines
export const createNewDataPipeline = (formData) => API.post(`/api/data_pipelines/create_new`, formData)
export const fetchAllDataPipelines = () => API.get(`/api/data_pipelines/fetch_all`)
export const deleteDataPipeline = (id) => API.delete(`/api/data_pipelines/delete/${id}`)

// Data Flow
export const addStep = (pipeline_id,formData) => API.post(`/api/data_flow/add_step/${pipeline_id}`, formData);
export const fetchDataPipeline = (pipeline_id) => API.get(`/api/data_flow/fetch_data_pipeline/${pipeline_id}`)
export const deleteStep = (pipeline_id) => API.delete(`/api/data_flow/delete_step/${pipeline_id}`)

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // Create New Project
// export const createProject = (formData) => API.post("/api/project/create_new", formData);

// // Get User Projects
// export const getUserProjects = () => API.get("/api/project/get_projects");

// // Fetch User Project Details
// export const fetchProjectDetails = (project_id) => API.get(`/api/project/projects/${project_id}`);

// export const selectCsvData = (project_id,fileName) => API.post(`/api/project/components/select_data/${project_id}/${fileName}`);


// // pipeline operations
// export const showPipeline = (project_id) => API.post(`/api/project/show_pipeline/${project_id}`);
// export const executePipeline = (project_id,starting_id) => API.post(`/api/project/execute_pipeline/${project_id}/${starting_id}`);
// export const addPipelineComponent = (project_id,position,formData) => API.post(`/api/project/add_pipeline_component/${project_id}/${position}`, formData);
// export const updatePipelineComponent = (project_id,position,formData) => API.post(`/api/project/update_pipeline_component/${project_id}/${position}`, formData);
// export const deletePipelineComponent = (project_id,position) => API.post(`/api/project/delete_pipeline_component/${project_id}/${position}`);
// export const movePipelineComponent = (project_id,movable_position,new_position) => API.post(`/api/project/move_pipeline_component/${project_id}/${movable_position}/${new_position}`);


export default API;