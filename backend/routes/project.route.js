import express from "express";
import { createProject, getProjects, fetchProjectDetails } from "../controllers/project.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { executePipeline, addPipelineComponent, updatePipelineComponent, deletePipelineComponent, movePipelineComponent, selectDataForProject, showPipeline } from "../controllers/pipeline.controller.js";

const router = express.Router();

// Routes
router.post("/create_new", authMiddleware, createProject);
router.get("/get_projects", authMiddleware, getProjects);
router.get("/projects/:project_id",authMiddleware,fetchProjectDetails);
router.post("/components/select_data/:project_id/:fileName", authMiddleware, selectDataForProject);

router.get("/show_pipeline/:project_id", authMiddleware, showPipeline);
router.post("/execute_pipeline/:project_id/:starting_id",authMiddleware,executePipeline);
router.post("/add_pipeline_component/:project_id/:position", authMiddleware, addPipelineComponent);
router.post("/update_pipeline_component/:project_id/:position", authMiddleware, updatePipelineComponent);
router.post("/delete_pipeline_component/:project_id/:position", authMiddleware, deletePipelineComponent);
router.post("/move_pipeline_component/:project_id/:movable_position/:new_position", authMiddleware, movePipelineComponent);

export default router;