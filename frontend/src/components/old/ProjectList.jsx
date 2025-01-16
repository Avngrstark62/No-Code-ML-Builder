import { useEffect, useState } from "react";
import { getUserProjects } from "../../api/api"; // Import the function to fetch user projects

const ProjectList = () => {
  const [projects, setProjects] = useState([]); // State to store project names
  const [error, setError] = useState(""); // To store any error message

  // Fetch projects when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getUserProjects(); // Fetch all user projects
        setProjects(response.data.projects); // Store project names
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Error fetching projects");
      }
    };
    fetchProjects();
  }, []); // Fetch projects only once when the component mounts

  // Function to handle project click (opens the project in a new tab)
  const handleProjectClick = (project_id) => {
    // Open the project in a new tab (assuming you will route to a project details page)
    window.open(`/projects/${project_id}`, "_blank");
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Error message display */}
      
      {projects.length > 0 ? (
        <div>
          <h3>Your Projects:</h3>
          {projects.map((project, index) => (
            <div key={index}>
              <button onClick={() => handleProjectClick(project.id)}>
                {project.project_name}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No projects available</p>
      )}
    </div>
  );
};

export default ProjectList;