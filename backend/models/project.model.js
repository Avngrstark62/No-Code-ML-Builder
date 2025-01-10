import client from '../config/db.js';

export const CreateNewProject = async (projectName, projectType, userId) => {
  const query = `
    INSERT INTO projects (project_name, project_type, user_id, pipeline, created_at, updated_at)
    VALUES ($1, $2, $3, $4, NOW(), NOW())
    RETURNING *;
  `;

  const values = [projectName, projectType, userId, JSON.stringify({})];
  const result = await client.query(query, values);
  return result.rows[0]; // Return the newly created project
};

export const GetUserProjects = async (userId) => {
  const query = `
    SELECT id,project_name FROM projects
    WHERE user_id = $1;
  `;
  
  const values = [userId];
  const result = await client.query(query, values);
  
  // return result.rows.map(row => row.id);
  return result.rows;
};

export const GetProjectDetails = async (project_id) => {
  const query = `
    SELECT * FROM projects
    WHERE id = $1;
  `;
  
  const values = [project_id];
  const result = await client.query(query, values);

  return result.rows[0];
};

export const PipelineSelectData = async (project_id, fileName) => {
  try {
    // Fetch the current pipeline for the given project_id
    const query = "SELECT pipeline FROM projects WHERE id = $1";
    const { rows } = await client.query(query, [project_id]);

    if (rows.length === 0) {
      throw new Error(`Project with id=${project_id} not found.`);
    }

    // Ensure pipeline is properly parsed and is an array
    let pipeline = rows[0].pipeline;

    // Check if pipeline is already an object
    if (typeof pipeline === "string") {
      pipeline = JSON.parse(pipeline); // Parse if it's a JSON string
    } else if (pipeline === null || pipeline === undefined) {
      pipeline = []; // Initialize as an empty array if null/undefined
    }

    // console.log(pipeline);

    if (!Array.isArray(pipeline)) {
      // If pipeline is not an array, initialize it as an empty array
      pipeline = [];
    }

    // Update the pipeline logic
    if (pipeline.length === 0) {
      // Add the first element to the pipeline
      pipeline.push({
        id: "1",
        type: "DataUpload",
        config: { file_type: "csv" },
        output: fileName,
      });
    } else {
      // Update the "output" of the first element
      pipeline = pipeline.map((element) =>
        element.id === "1"
          ? { ...element, output: fileName }
          : element
      );
    }

    // Update the pipeline back to the database
    const updateQuery =
      "UPDATE projects SET pipeline = $1 WHERE id = $2";
    await client.query(updateQuery, [JSON.stringify(pipeline), project_id]);

    return { success: true, message: "Pipeline updated successfully." };
  } catch (error) {
    console.error("Error in PipelineSelectData:", error);
    return { success: false, message: error.message };
  }
};