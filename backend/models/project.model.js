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