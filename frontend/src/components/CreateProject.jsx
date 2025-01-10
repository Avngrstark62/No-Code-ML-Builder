import { useState } from "react";
import { createProject } from "../api/api";

const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");

  const handleCreateProject = async (event) => {
    event.preventDefault();

    if (!projectName || !projectType) {
      alert("Please provide both project name and project type!");
      return;
    }

    const formData = {
      projectName,
      projectType,
    };

    try {
      const response = await createProject(formData);
      alert(response.data.message || "Project created successfully!");
      setProjectName("");
      setProjectType("");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Error creating project");
    }
  };

  return (
    <div>
      <h2>Create New Project</h2>
      <form onSubmit={handleCreateProject}>
        <input
          type="text"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter project type"
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          required
        />
        <button type="submit">Create Project</button>
      </form>
    </div>
  );
};

export default CreateProject;