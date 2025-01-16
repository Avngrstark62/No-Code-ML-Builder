import { CreateNewDataPipeline, FetchAllDataPipelines, DeleteDataPipeline } from "../models/data.pipeline.model.js";

export const createNewDataPipeline = async (req, res) => {
  try {
    const { pipelineName, inputData } = req.body;
    console.log(req.user)
    const userId = req.user.id; // Assume `req.user` is populated by the auth middleware.

    if (!pipelineName || !inputData) {
      return res.status(400).json({ error: "Pipeline name and input data is required" });
    }
    
    const newDataPipeline = await CreateNewDataPipeline(pipelineName, inputData, userId);

    return res.status(201).json({ message: "Data pipeline created successfully", data_pipeline: newDataPipeline });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "An error occurred while creating the data pipeline" });
  }
};

export const fetchAllDataPipelines = async (req, res) => {
  try {
    const userId = req.user.id; // Assume `req.user` is populated by the auth middleware.
    
    const allDataPipelines = await FetchAllDataPipelines(userId);
    return res.status(201).json({ message: "Project created successfully", data_pipelines: allDataPipelines });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while creating the project" });
  }
};

export const deleteDataPipeline = async (req, res) => {
  const { id } = req.params;

  try {
    await DeleteDataPipeline(id);
    res.status(200).json({ message: 'Pipeline deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting pipeline', error: error.message });
  }
};