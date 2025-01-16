import express from "express";
import { createNewDataPipeline, fetchAllDataPipelines, deleteDataPipeline } from "../controllers/data.pipeline.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create_new", authMiddleware,createNewDataPipeline);
router.get("/fetch_all", authMiddleware, fetchAllDataPipelines);
router.delete("/delete/:id", authMiddleware, deleteDataPipeline);

export default router;