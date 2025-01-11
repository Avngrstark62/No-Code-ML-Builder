import {CreateNewProject, GetUserProjects, GetProjectDetails} from "../models/project.model.js";

export const createProject = async (req, res) => {
  try {
    const { projectName, projectType } = req.body;
    const userId = req.user.id; // Assume `req.user` is populated by the auth middleware.

    if (!projectName || !projectType) {
      return res.status(400).json({ error: "Project name and type are required" });
    }

    // Create a new project
    
    const newProject = await CreateNewProject(projectName, projectType, userId);

    return res.status(201).json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while creating the project" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const userId = req.user.id; // Assume `req.user` is populated by the auth middleware.
    
    const userProjects = await GetUserProjects(userId);
    return res.status(201).json({ message: "Project created successfully", projects: userProjects });
    // return res.status(201).json({ message: "Project created successfully", project_ids: userProjects.map(row => row.id), project_names: userProjects.map(row => row.projet_name) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while creating the project" });
  }
};

export const fetchProjectDetails = async (req, res) => {
  try {
    const { project_id } = req.params;
    const project = await GetProjectDetails(project_id); // Function to get project details
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};