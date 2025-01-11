import { ExecutePipeline, AddPipelineComponent, UpdatePipelineComponent, DeletePipelineComponent, MovePipelineComponent, PipelineSelectData, ShowPipeline } from "../models/pipeline.model.js";

export const executePipeline = async (req,res) => {
  try {
    const { project_id, starting_id } = req.params;
    await ExecutePipeline(project_id,starting_id);
    return res.status(201).json({ message: "Pipeline excecuted successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const selectDataForProject = async (req,res) => {
  try {
    const { project_id,fileName } = req.params;
    await PipelineSelectData(project_id,fileName);
    return res.status(201).json({ message: "Project data selected successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addPipelineComponent = async (req,res) => {
  try {
    const { project_id, position } = req.params;
    const component = req.body;
    await AddPipelineComponent(project_id, component, position);
    return res.status(201).json({ message: "Pipeline updated successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePipelineComponent = async (req,res) => {
  try {
    const { project_id, position } = req.params;
    const component = req.body;
    await UpdatePipelineComponent(project_id, component, position);
    return res.status(201).json({ message: "Pipeline updated successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePipelineComponent = async (req,res) => {
  try {
    const { project_id, position } = req.params;
    await DeletePipelineComponent(project_id, position);
    return res.status(201).json({ message: "Pipeline updated successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const movePipelineComponent = async (req,res) => {
  try {
    const { project_id, movable_position, new_position } = req.params;
    await MovePipelineComponent(project_id, movable_position, new_position);
    return res.status(201).json({ message: "Pipeline updated successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const showPipeline = async (req, res) => {
  const { project_id } = req.params;

  try {
    const result = await ShowPipeline(project_id);

    if (result.success) {
      return res.status(200).json({ success: true, pipeline: result.pipeline });
    } else {
      return res.status(404).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error("Error in showPipeline:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};