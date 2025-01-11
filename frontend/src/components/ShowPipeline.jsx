import { useEffect, useState } from "react";
import { showPipeline } from "../api/api"; // Import the showPipeline function

const ShowPipeline = ({ projectId }) => {
  const [pipeline, setPipeline] = useState(null); // State to store the pipeline
  const [error, setError] = useState(""); // To store any error message

  useEffect(() => {
    const getPipeline = async () => {
      try {
        const response = await showPipeline(projectId); // Fetch the pipeline for the project
        setPipeline(response.data.pipeline); // Store the pipeline data
      } catch (error) {
        console.error("Error fetching pipeline:", error);
        setError("Error fetching pipeline data");
      }
    };

    if (projectId) {
      getPipeline();
    }
  }, [projectId]); // Dependency on projectId to fetch pipeline when it changes

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Error message display */}

      {pipeline ? (
        <div>
          <h2>Pipeline for Project ID: {projectId}</h2>
          <pre>{JSON.stringify(pipeline, null, 2)}</pre> {/* Displaying the pipeline as JSON */}
        </div>
      ) : (
        <p>No pipeline data available</p>
      )}
    </div>
  );
};

export default ShowPipeline;