// CREATE TABLE data_pipelines (
//   id SERIAL PRIMARY KEY, -- Auto-incrementing primary key
//   pipeline_name VARCHAR(255) NOT NULL,
//   user_id INT NOT NULL,
//   input_data VARCHAR(255) NOT NULL,
//   flow JSONB[],  -- Array of JSON objects
//   output_data VARCHAR(255),
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

import client from '../config/db.js';

export const CreateNewDataPipeline = async (pipelineName, inputData, userId) => {
  const query = `
    INSERT INTO data_pipelines (pipeline_name, user_id, input_data, flow, output_data, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *;
  `;

  const values = [pipelineName, userId, inputData, [], null];

  try {
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Error creating data pipeline:", err.message);
    throw err;
  }
};

export const FetchAllDataPipelines = async (userId) => {
  const query = `
    SELECT id,pipeline_name FROM data_pipelines
    WHERE user_id = $1;
  `;
  
  const values = [userId];
  const result = await client.query(query, values);
  
  return result.rows;
};

export const DeleteDataPipeline = async (id) => {
  const query = `
    DELETE FROM data_pipelines
    WHERE id = $1;
  `;
  
  const values = [id];
  await client.query(query, values);  
};

// export const GetProjectDetails = async (project_id) => {
//   const query = `
//     SELECT * FROM projects
//     WHERE id = $1;
//   `;
  
//   const values = [project_id];
//   const result = await client.query(query, values);

//   return result.rows[0];
// };