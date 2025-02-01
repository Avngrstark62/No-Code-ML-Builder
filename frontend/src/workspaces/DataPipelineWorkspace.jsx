import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDataPipeline, addStep, deleteStep, fetchCsvData } from "../api/api";
import StepConfigForm from "../components/StepConfigForm.jsx"

const DataPipelineWorkspace = () => {
  const { id } = useParams();
  const [pipeline, setPipeline] = useState(null);
  const [selectedView, setSelectedView] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);
  const [showAddStepForm, setShowAddStepForm] = useState(false);
  const [outputData, setOutputData] = useState(null);

  useEffect(() => {
    const getPipeline = async () => {
      try {
        const response = await fetchDataPipeline(id);
        if (response.data?.data_pipeline) {
          setPipeline(response.data.data_pipeline);
        } else {
          console.error("Invalid response format:", response);
        }
      } catch (error) {
        console.error("Error fetching pipeline:", error);
      }
    };
    getPipeline();
  }, [id]);

  const handleAddStep = async (stepData) => {
    try {
      await addStep(id, stepData);
      setShowAddStepForm(false);
      setSelectedView(null);
      const updatedPipeline = await fetchDataPipeline(id);
      if (updatedPipeline?.data?.data_pipeline) {
        setPipeline(updatedPipeline.data.data_pipeline);
      }
    } catch (error) {
      console.error("Error adding step:", error);
    }
  };

  const handleDeleteStep = async () => {
    try {
      await deleteStep(id);
      console.log("Step Deleted Successfully");
    } catch (error) {
      console.error("Error Deleting Step:", error);
    }
  };

  const handleExpandStep = async (step) => {
    setExpandedStep(step);
    setSelectedView("details");
    setShowAddStepForm(false);
    setOutputData(null);

    if (step.output) {
      try {
        const response = await fetchCsvData(step.output);
        setOutputData(response.data);
      } catch (error) {
        console.error("Error fetching output data:", error);
      }
    }
  };

  return (
    <div className="workspace-container">
      <h1 className="workspace-title">Data Pipeline Workspace</h1>
      {pipeline ? (
        <>
          <div className="step-chain">
            <div className="input-data-box">{pipeline.input_data}</div>
            {pipeline.flow.map((step, index) => (
              <div
                key={index}
                className={`step-box ${expandedStep === step ? "step-box-highlight" : ""}`}
              >
                <div className="step-name">{step.name}</div>
                <div className="step-actions">
                  <button onClick={() => handleExpandStep(step)}>Expand</button>
                  <button
                    onClick={() => {
                      setExpandedStep(step);
                      setSelectedView("analyse");
                      setShowAddStepForm(false);
                    }}
                  >
                    Analyse
                  </button>
                </div>
              </div>
            ))}
            <div className="add-delete-box">
              <button
                className="add-step-box"
                onClick={() => {
                  setShowAddStepForm(true);
                  setSelectedView(null);
                  setExpandedStep(null);
                }}
              >
                +
              </button>
              <button className="delete-step-box" onClick={handleDeleteStep}>
                -
              </button>
            </div>
          </div>
          <div className="main-content">
            {selectedView === "details" && expandedStep && (
              <div>
                <h3>Step Name: {expandedStep.name}</h3>
                <h4>Configuration:</h4>
                <pre>{JSON.stringify(expandedStep.config, null, 2)}</pre>
                <h4>Output Data:</h4>
                {outputData ? (
                  <table className="csv-table">
                    <thead>
                      <tr>
                        {Object.keys(outputData[0]).map((header, index) => (
                          <th key={index}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {outputData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {Object.values(row).map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Loading output data...</p>
                )}
              </div>
            )}
            {selectedView === "analyse" && (
              <div>
                <h3>Analyse Component</h3>
                <p>This is a placeholder for the analysis component.</p>
              </div>
            )}
            {showAddStepForm && (
              <div>
                <h3>Add New Step</h3>
                <StepConfigForm onSubmit={handleAddStep} onCancel={() => setShowAddStepForm(false)} />
              </div>
            )}
          </div>
        </>
      ) : (
        <p>Loading pipeline...</p>
      )}
    </div>
  );
};

export default DataPipelineWorkspace;