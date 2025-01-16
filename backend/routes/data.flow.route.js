import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addStep, deleteStep, fetchDataPipeline } from "../controllers/data.flow.controller.js";

const router = express.Router();

router.post("/add_step/:pipeline_id", authMiddleware,addStep);
router.get("/fetch_data_pipeline/:pipeline_id", authMiddleware, fetchDataPipeline);
router.delete("/delete_step/:pipeline_id", authMiddleware, deleteStep);

export default router;