import express from "express";
import { createProject, getProjects, fetchProjectDetails, selectDataForProject } from "../controllers/project.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { executePipeline } from "../controllers/pipeline.controller.js";

const router = express.Router();

// Routes
router.post("/create_new", authMiddleware, createProject);
router.get("/get_projects", authMiddleware, getProjects);
router.get("/projects/:project_id",authMiddleware,fetchProjectDetails);
router.post("/components/select_data/:project_id/:fileName", authMiddleware, selectDataForProject);
router.post("/execute_pipeline/:project_id/:starting_id",authMiddleware,executePipeline)

export default router;