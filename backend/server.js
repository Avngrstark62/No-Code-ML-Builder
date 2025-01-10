import express from 'express';
import dotenv from "dotenv"
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from './config/db.js';
import csvRoutes from './routes/csv.route.js';
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.route.js";

dotenv.config();

const app = express();
// const PORT = process.env.PORT || 5000;
const PORT = 5000;

app.use(express.json());

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
connectDB();

// Routes
app.use('/api/csv', csvRoutes);
app.use("/api", authRoutes);
app.use("/api/project", projectRoutes);




app.get('/', (req, res) => {
    res.send('Server is running');
});

// Start Server
app.listen(PORT, () => {
	console.log("Server started at http://localhost:" + PORT);
});