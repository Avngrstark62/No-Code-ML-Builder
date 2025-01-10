import { ExecutePipeline } from "./models/pipeline.model.js";

const result = await ExecutePipeline(1, 2); // Await the function's result first
console.log('pipeline_model_output:', result.message); // Access the message after the function has completed