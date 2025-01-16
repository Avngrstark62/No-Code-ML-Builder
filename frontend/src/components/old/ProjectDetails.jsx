import { useEffect, useState } from "react";
import { fetchProjectDetails } from "../../api/api";

const ProjectDetails = ({project_id}) => {
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProjectDetails = async () => {
      try {
        const response = await fetchProjectDetails(project_id); // Fetch project details using the project name
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setError("Error fetching project details");
      }
    };
    if (project_id) {
      getProjectDetails();
    }
  }, [project_id]);

  return (
    <div>
    {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error if any */}

    {project ? (
      <div>
        <h2>Project Name: {project.project_name}</h2> {/* Display the project name */}
        <p>Project Type: {project.project_type}</p> {/* Display project type */}
        <p>Created At: {new Date(project.created_at).toLocaleString()}</p>
        <p>Last Updated: {new Date(project.updated_at).toLocaleString()}</p>
      </div>
    ) : (
      <p>Loading project details...</p> // Show a loading message while the project is being fetched
    )}
  </div>
  );
};

export default ProjectDetails;