import express from "express";
import upload from "../middleware/multer.js";
import { uploadCsv, fetchCsvData, fetchTableNames, deleteTable } from "../controllers/csv.controller.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Import authentication middleware

const router = express.Router();

// Routes
router.post("/upload", authMiddleware, upload.single("file"), uploadCsv); // Protected upload route
router.get("/data/:fileName", authMiddleware, fetchCsvData); // Protected data fetch route
router.get("/tables", authMiddleware, fetchTableNames); // Protected fetch tables route
router.delete("/delete_table/:tableName", authMiddleware, deleteTable); // Protected delete route

export default router;