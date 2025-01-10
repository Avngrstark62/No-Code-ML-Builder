import { ExecutePipeline } from "../models/pipeline.model.js";

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