import { execFile } from 'child_process';
import client from '../config/db.js';
import path from 'path';
import fs from 'fs/promises';
import dotenv from "dotenv";
import Pipeline from '../classes/Pipeline.js';
import Component from '../classes/Component.js';

dotenv.config();

export const PipelineSelectData = async (project_id, fileName) => {
  try {
    let pipeline = new Pipeline({
      "name":`pipeline_${project_id}_0`,
      "base_file": fileName,
      "components": []
    });

    // Update the pipeline back to the database
    const updateQuery =
      "UPDATE projects SET pipeline = $1 WHERE id = $2";
    await client.query(updateQuery, [JSON.stringify(pipeline.get_as_JSON()), project_id]);

    return { success: true, message: "Pipeline updated successfully." };
  } catch (error) {
    console.error("Error in PipelineSelectData:", error);
    return { success: false, message: error.message };
  }
};

export const AddPipelineComponent = async (project_id, component, position) => {
  try {
    project_id = parseInt(project_id);
    position = parseInt(position);
    component = typeof component === 'string' ? new Component(JSON.parse(component)) : new Component(component);

    const query = "SELECT pipeline FROM projects WHERE id = $1";
    const { rows } = await client.query(query, [project_id]);
    
    if (rows.length === 0) {
      throw new Error(`Project with id=${project_id} not found.`);
    }

    let pipeline = new Pipeline(JSON.parse(rows[0].pipeline));
    await pipeline.add_component(component, position);
      
    const updateQuery = "UPDATE projects SET pipeline = $1 WHERE id = $2";
    await client.query(updateQuery, [JSON.stringify(pipeline.get_as_JSON()), project_id]);

    return { success: true, message: "Pipeline updated successfully." };
  } catch (error) {
    console.error("Error in AddPipelineComponent:", error);
    return { success: false, message: error.message };
  }
};

export const DeletePipelineComponent = async (project_id, position) => {
  try {
    project_id = parseInt(project_id);
    position = parseInt(position);

    const query = "SELECT pipeline FROM projects WHERE id = $1";
    const { rows } = await client.query(query, [project_id]);
    
    if (rows.length === 0) {
      throw new Error(`Project with id=${project_id} not found.`);
    }

    let pipeline = new Pipeline(JSON.parse(rows[0].pipeline));
    await pipeline.delete_component(position);
      
    const updateQuery = "UPDATE projects SET pipeline = $1 WHERE id = $2";
    await client.query(updateQuery, [JSON.stringify(pipeline.get_as_JSON()), project_id]);

    return { success: true, message: "Pipeline updated successfully." };
  } catch (error) {
    console.error("Error in AddPipelineComponent:", error);
    return { success: false, message: error.message };
  }
};

export const UpdatePipelineComponent = async (project_id, component, position) => {
  try {
    project_id = parseInt(project_id);
    position = parseInt(position);
    component = typeof component === 'string' ? new Component(JSON.parse(component)) : new Component(component);

    const query = "SELECT pipeline FROM projects WHERE id = $1";
    const { rows } = await client.query(query, [project_id]);
    
    if (rows.length === 0) {
      throw new Error(`Project with id=${project_id} not found.`);
    }

    let pipeline = new Pipeline(JSON.parse(rows[0].pipeline));
    await pipeline.update_component(component, position);
      
    const updateQuery = "UPDATE projects SET pipeline = $1 WHERE id = $2";
    await client.query(updateQuery, [JSON.stringify(pipeline.get_as_JSON()), project_id]);

    return { success: true, message: "Pipeline updated successfully." };
  } catch (error) {
    console.error("Error in AddPipelineComponent:", error);
    return { success: false, message: error.message };
  }
};

export const MovePipelineComponent = async (project_id, movable_position, new_position) => {
  try {
    project_id = parseInt(project_id);
    movable_position = parseInt(movable_position);
    new_position = parseInt(new_position);

    const query = "SELECT pipeline FROM projects WHERE id = $1";
    const { rows } = await client.query(query, [project_id]);
    
    if (rows.length === 0) {
      throw new Error(`Project with id=${project_id} not found.`);
    }

    let pipeline = new Pipeline(JSON.parse(rows[0].pipeline));
    await pipeline.move_component(movable_position, new_position);
      
    const updateQuery = "UPDATE projects SET pipeline = $1 WHERE id = $2";
    await client.query(updateQuery, [JSON.stringify(pipeline.get_as_JSON()), project_id]);

    return { success: true, message: "Pipeline updated successfully." };
  } catch (error) {
    console.error("Error in AddPipelineComponent:", error);
    return { success: false, message: error.message };
  }
};

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


export const ShowPipeline = async (project_id) => {
  try {
    // Query the database to get the pipeline for the given project_id
    const query = "SELECT pipeline FROM projects WHERE id = $1";
    const values = [project_id];
    const result = await client.query(query, values);

    // Check if pipeline exists
    if (result.rows.length === 0) {
      return { success: false, message: "no components in the pipeline right now." };
    }

    const pipelineData = result.rows[0].pipeline;

    // If pipeline exists, return it
    return { success: true, pipeline: JSON.parse(pipelineData) };
  } catch (error) {
    console.error("Error in ShowPipeline:", error);
    return { success: false, message: error.message };
  }
};