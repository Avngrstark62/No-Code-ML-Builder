import { AddStep, FetchDataPipeline, DeleteStep } from "../models/data.flow.model.js"

export const addStep = async (req,res) => {
  try {
    const { pipeline_id } = req.params;
    const {name, config} = req.body;
    // console.log(req.params)
    // console.log(req.body)
    await AddStep(pipeline_id,name,config);
    return res.status(201).json({ message: "Step added successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchDataPipeline = async (req,res) => {
  try {
    const { pipeline_id } = req.params;
    const data_pipeline = await FetchDataPipeline(pipeline_id);
    return res.status(201).json({ message: "Fetched data pipeline succesfully", data_pipeline: data_pipeline});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteStep = async (req,res) => {
    try {
      const { pipeline_id } = req.params;
      await DeleteStep(pipeline_id);
      return res.status(201).json({ message: "Step deleted successfully"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };