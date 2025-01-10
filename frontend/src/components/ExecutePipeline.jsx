import { useState } from "react";
import { executePipeline } from "../api/api"; // Import the executePipeline API function

const ExecutePipeline = (project_id) => {
  const [startingId, setStartingId] = useState(""); // State to store the starting ID input
  const [message, setMessage] = useState(""); // State to store success/error messages
  const [error, setError] = useState(""); // State to store any error message

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form default submission behavior
    try {
      console.log(project_id.project_id);
      const response = await executePipeline(project_id.project_id, startingId); // Call the executePipeline API
      setMessage(`Pipeline executed successfully: ${response.data.message}`); // Success message
      setError(""); // Clear any previous error
    } catch (error) {
      console.error("Error executing pipeline:", error);
      setError("Error executing pipeline. Please try again."); // Set error message
      setMessage(""); // Clear success message
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Starting ID:
          <input
            type="text"
            value={startingId}
            onChange={(e) => setStartingId(e.target.value)} // Update startingId state
            placeholder="Enter Starting ID"
          />
        </label>
        <button type="submit">Run Pipeline</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>} {/* Success message */}
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Error message */}
    </div>
  );
};

export default ExecutePipeline;