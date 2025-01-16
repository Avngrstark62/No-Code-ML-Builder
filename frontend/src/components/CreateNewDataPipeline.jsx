import { useState, useEffect } from "react";
import { createNewDataPipeline } from "../api/api";
import { fetchTableNames } from "../api/api";

const CreateNewDataPipeline = () => {
  const [pipelineName, setPipelineName] = useState("");
  const [inputData, setInputData] = useState("");
  const [rawDatasets, setRawDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch raw datasets when the component mounts
  useEffect(() => {
    const getRawDatasets = async () => {
      try {
        const response = await fetchTableNames();
        setRawDatasets(response.data); // Assuming the response contains the raw datasets in an array
      } catch (err) {
        setError("Failed to fetch raw datasets.");
        console.error("Error fetching raw datasets:", err);
      }
    };
    getRawDatasets();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!pipelineName || !inputData) {
      setError("Please fill out both fields.");
      return;
    }
    
    setLoading(true);
    setError("");

    const formData = { pipelineName, inputData };

    try {
      await createNewDataPipeline(formData); // Create the new data pipeline
      setPipelineName(""); // Clear the form after submission
      setInputData("");
      alert("Data pipeline created successfully!");
    } catch (err) {
      setError("Failed to create data pipeline.");
      console.error("Error creating data pipeline:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-pipeline-container">
      <h2 className="create-pipeline-title">Create New Data Pipeline</h2>

      {/* Form for creating a new data pipeline */}
      <form className="create-pipeline-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="pipelineName">Pipeline Name</label>
          <input
            className="form-input"
            type="text"
            id="pipelineName"
            value={pipelineName}
            onChange={(e) => setPipelineName(e.target.value)}
            placeholder="Enter pipeline name"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="inputData">Input Data</label>
          <select
            className="form-select"
            id="inputData"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            required
          >
            <option value="">Select Raw Dataset</option>
            {rawDatasets.map((dataset, index) => (
              <option key={index} value={dataset}>{dataset}</option>
            ))}
          </select>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Pipeline"}
        </button>
      </form>
    </div>
  );
};

export default CreateNewDataPipeline;