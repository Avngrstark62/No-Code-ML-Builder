import { useState } from "react";

const StepConfigForm = ({ onSubmit, onCancel }) => {
  const [stepName, setStepName] = useState("");
  const [transformType, setTransformType] = useState("");
  const [config, setConfig] = useState({});

  const handleTransformChange = (e) => {
    setTransformType(e.target.value);
    setConfig({}); // Reset config when transform type changes
  };

  const handleConfigChange = (key, value) => {
    setConfig((prevConfig) => ({ ...prevConfig, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: stepName,
      config: { transform_type: transformType, ...config },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Step Name:
        <input
          type="text"
          value={stepName}
          onChange={(e) => setStepName(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Transform Type:
        <select value={transformType} onChange={handleTransformChange} required>
          <option value="">Select...</option>
          <option value="impute_missing_values">Impute Missing Values</option>
          <option value="delete_columns">Delete Columns</option>
          <option value="add_column">Add Column</option>
        </select>
      </label>
      <br />

      {transformType === "impute_missing_values" && (
        <>
          <label>
            Columns (comma-separated):
            <input
              type="text"
              onChange={(e) =>
                handleConfigChange("columns", e.target.value.split(","))
              }
              required
            />
          </label>
          <br />
          <label>
            Strategy:
            <select
              onChange={(e) => handleConfigChange("strategy", e.target.value)}
              required
            >
              <option value="mean">Mean</option>
              <option value="median">Median</option>
              <option value="most_frequent">Most Frequent</option>
              <option value="constant">Constant</option>
            </select>
          </label>
          <br />
          {config.strategy === "constant" && (
            <>
              <label>
                Fill Value:
                <input
                  type="text"
                  onChange={(e) => handleConfigChange("fill_value", e.target.value)}
                  required
                />
              </label>
              <br />
            </>
          )}
        </>
      )}

      {transformType === "delete_columns" && (
        <>
          <label>
            Columns (comma-separated):
            <input
              type="text"
              onChange={(e) =>
                handleConfigChange("columns", e.target.value.split(","))
              }
              required
            />
          </label>
          <br />
        </>
      )}

      {transformType === "add_column" && (
        <>
          <label>
            Column Name:
            <input
              type="text"
              onChange={(e) => handleConfigChange("column_name", e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Value:
            <input
              type="text"
              onChange={(e) => handleConfigChange("value", e.target.value)}
              required
            />
          </label>
          <br />
        </>
      )}

      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default StepConfigForm;