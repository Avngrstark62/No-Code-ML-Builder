import { execFile } from 'child_process';
import { connectDB } from '../config/db.js';
import client from '../config/db.js';
import path from 'path';
import fs from 'fs/promises';
import dotenv from "dotenv";

dotenv.config();

export const ExecutePipeline = async (project_id, starting_id) => {
  try {

    project_id = parseInt(project_id);
    starting_id = parseInt(starting_id);
      // Step 1: Fetch the pipeline
      // await connectDB();
    const query = "SELECT pipeline FROM projects WHERE id = $1";
    const { rows } = await client.query(query, [project_id]);
    
    if (rows.length === 0) {
      throw new Error(`Project with id=${project_id} not found.`);
    }

    let pipeline = rows[0].pipeline;

    if (typeof pipeline === "string") {
      pipeline = JSON.parse(pipeline); // Parse if stored as a JSON string
    }
    
    if (!Array.isArray(pipeline)) {
      throw new Error("Pipeline data is not valid.");
    }

    let lastOutput = pipeline[0].output;

    // Step 3: Execute each element in the pipeline
    for (const element of pipeline) {
        if (parseInt(element.id) < parseInt(starting_id)) { continue; }

        const pathToPython = path.resolve(process.cwd(),"venv/Scripts/python.exe");
        // console.log('Current Working Directory:', process.cwd());
        const scriptPath = path.resolve(
          process.cwd(),
          'backend/scripts',
          element.type,
          `${element.name}.py`
        );

        try {
          await fs.access(scriptPath);
        } catch (err) {
          throw new Error(`Script not found: ${scriptPath}`);
        }

        const scriptOutput = await new Promise((resolve, reject) => {
          execFile(
              pathToPython,
              [scriptPath, lastOutput, project_id, element.id || ""],
              (error, stdout, stderr) => {
                  if (error) {
                      return reject(stderr || error.message);
                  }
                  resolve(stdout.trim()); // Trim any extra whitespace
              }
          );
      });
      
      
      
      const tableName = scriptOutput;
      // console.log('pipeline_model_output:', tableName);
        
        // Step 5: Update element's output
      element.output = tableName;
        
        // Set lastOutput for the next element
      lastOutput = tableName;
      }
      
      
      // Step 6: Update pipeline back to the database
      const updateQuery = "UPDATE projects SET pipeline = $1 WHERE id = $2";
      await client.query(updateQuery, [JSON.stringify(pipeline), project_id]);
      // await client.end();
      // console.log('worked till here');

    return { success: true, message: "Pipeline executed successfully." };
  } catch (error) {
    console.error("Error in ExecutePipeline:", error);
    return { success: false, message: error.message };
  }
};