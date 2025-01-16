import client from '../config/db.js';
import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

class Step {
    constructor(name,config,input,pipeline_id,index){
        this.name=name
        this.input=input
        this.config=config
        this.analysis=null
        this.output=`pipeline_${pipeline_id}_step_${index}_output`
    }

    return_JSON(){
      return {
        "name":this.name,
        "input":this.input,
        "config":this.config,
        "analysis":this.analysis,
        "output":this.output
      }
    }

    async execute() {
      const configFilePath = path.resolve(process.cwd(),'backend/tmp/config.txt',);
      await fs.writeFile(configFilePath, JSON.stringify(this.config), 'utf-8');


      const pathToPython = path.resolve(process.cwd(), "venv/Scripts/python.exe");
      const scriptpath=path.resolve(
            process.cwd(),
            'backend/scripts',
            'python_entry_point.py'
          );
  
      try {
        await fs.access(scriptpath);
      } catch (err) {
        throw new Error(`Script not found: ${scriptpath}`);
      }
  
      try {
        // const env = { ...process.env, PYTHONPATH: process.cwd() };
        const script_output = await new Promise((resolve, reject) => {
          execFile(
            pathToPython,
            [scriptpath, this.input, this.output],
            (error, stdout, stderr) => {
              if (error) {
                console.log(error)
                return reject(stderr || error.message);
              }
              resolve(stdout.trim());
            }
          );
        });

        console.log(script_output);
      } catch (error) {
        throw new Error(`Error executing script: ${error.message}`);
      }
    }

    // revert(){
    //     delete_this_analysis
    //     delete_this_output
    // }
}

export const AddStep = async (pipeline_id, name, config) => {
  try {
    pipeline_id = parseInt(pipeline_id, 10);
    config = typeof config === "string" ? JSON.parse(config) : config;

    // Fetch the current pipeline data
    const query = "SELECT input_data, flow, output_data FROM data_pipelines WHERE id = $1";
    const result = await client.query(query, [pipeline_id]);

    if (result.rowCount === 0) {
      throw new Error(`Pipeline with ID ${pipeline_id} not found`);
    }

    let { input_data, flow, output_data } = result.rows[0];

    // Ensure flow is a valid JSON array
    flow = Array.isArray(flow) ? flow : [];

    // Determine input for the new step
    const input = flow.length === 0 ? input_data : output_data;

    // Create a new step
    const index = flow.length + 1
    const step = new Step(name, config, input, pipeline_id, index);
    await step.execute();

    // Update flow and output data
    flow.push(step.return_JSON()); // Directly push the step object (it will be serialized by Postgres)
    output_data = step.output;

    // Update the pipeline in the database
    const updateQuery = `
      UPDATE data_pipelines 
      SET flow = $1, output_data = $2, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $3
    `;
    await client.query(updateQuery, [flow, output_data, pipeline_id]);
  } catch (error) {
    console.error("Error in AddStep:", error);
  }
};

export const FetchDataPipeline = async (pipeline_id) => {
  try {
    pipeline_id = parseInt(pipeline_id, 10);

    const query = "SELECT * FROM data_pipelines WHERE id = $1";
    const result = await client.query(query, [pipeline_id]);

    
    if (result.rowCount === 0) {
      throw new Error(`Pipeline with ID ${pipeline_id} not found`);
    }
    
    return result.rows[0]
    
  } catch (error) {
    console.error("Error in AddStep:", error);
  }
};

// export const DeleteStep = (pipeline_id) => {
//     fetch_pipeline_using_pipeline_id
    
//     pipeline.flow[-1].revert()
//     pipeline.flow.pop()
//     pipeline.output=pipeline.flow[-1].output

//     update_pipeline_in_the_database
// }

export const DeleteStep = async (pipeline_id) => {
  try {
    pipeline_id = parseInt(pipeline_id, 10);

    // Fetch the current pipeline data
    const query = "SELECT input_data, flow, output_data FROM data_pipelines WHERE id = $1";
    const result = await client.query(query, [pipeline_id]);

    if (result.rowCount === 0) {
      throw new Error(`Pipeline with ID ${pipeline_id} not found`);
    }

    let { input_data, flow, output_data } = result.rows[0];

    // Ensure flow is a valid JSON array
    flow = Array.isArray(flow) ? flow : JSON.parse(flow);

    // Check if the flow is empty
    if (flow.length === 0) {
      throw new Error("Pipeline flow is already empty; no steps to delete.");
    }

    // Use string interpolation to construct the query
    const deleteQuery = `DROP TABLE IF EXISTS ${output_data}`;
    try {
      await client.query(deleteQuery);
      console.log(`Table ${output_data} deleted successfully`);
    } catch (error) {
      console.error("Error while deleting table:", error);
    }
     
     // Remove the last step from the flow
     flow.pop();
     
     let lastStep = flow[flow.length - 1];
     lastStep = typeof(lastStep)=='string' ? JSON.parse(lastStep) : lastStep;
    output_data = flow.length === 0 ? input_data : lastStep.output;

    // Update the pipeline in the database
    const updateQuery = `
      UPDATE data_pipelines 
      SET flow = $1, output_data = $2, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $3
    `;
    await client.query(updateQuery, [flow, output_data, pipeline_id]);
  } catch (error) {
    console.error("Error in DeleteStep:", error);
  }
};