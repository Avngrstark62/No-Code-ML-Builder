import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectDetails } from "../api/api"; // Function to fetch project details
import SelectData from "./SelectData";
import PipelineManager from "./PipelineManager";
// import ExecutePipeline from "./ExecutePipeline";

const ProjectDetails = () => {
  const { project_id } = useParams(); // Extract the project name from the URL
  const [project, setProject] = useState(null); // Store project details
  const [error, setError] = useState(""); // Store any error message
  const [showSelectData, setShowSelectData] = useState(false);

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
        {/* Button to toggle the SelectData component */}
        <button onClick={() => setShowSelectData(!showSelectData)}>
            {showSelectData ? "Close" : "Select Data"}
          </button>

          {/* Conditionally render SelectData based on state */}
          {showSelectData && <SelectData project_id={project.id} />}
        {/* <ExecutePipeline project_id={project.id}/> */}
        <PipelineManager projectId={toString(project.id)}/>
        {/* <p>Pipeline: <Pipeline pipeline={project.pipeline}/></p> */}
      </div>
    ) : (
      <p>Loading project details...</p> // Show a loading message while the project is being fetched
    )}
  </div>
  );
};

export default ProjectDetails;