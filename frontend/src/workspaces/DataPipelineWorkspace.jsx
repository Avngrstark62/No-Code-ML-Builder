import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDataPipeline, addStep, deleteStep } from "../api/api";

const DataPipelineWorkspace = () => {
  const { id } = useParams();
  const [pipeline, setPipeline] = useState(null);
  const [selectedView, setSelectedView] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);
  const [showAddStepForm, setShowAddStepForm] = useState(false);

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

  const handleAddStep = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const stepData = {
      name: formData.get("name"),
      config: formData.get("config"),
    };

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
      console.log('Step Delete Succesfully')
    }catch(error){
      console.error("Error Deleting Step:", error)
    }
  }

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
                className={`step-box ${
                  expandedStep === step ? "step-box-highlight" : ""
                }`}
              >
                <div className="step-name">{step.name}</div>
                <div className="step-actions">
                  <button
                    onClick={() => {
                      setExpandedStep(step);
                      setSelectedView("details");
                      setShowAddStepForm(false);
                    }}
                  >
                    Expand
                  </button>
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
            <button
              className="delete-step-box"
              onClick={handleDeleteStep}
            >
              -
            </button>
            </div>
          </div>
          <div className="main-content">
            {selectedView === "details" && expandedStep && (
              <div>
                <h3>Step Details: {expandedStep.name}</h3>
                <pre>{JSON.stringify(expandedStep, null, 2)}</pre>
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
                <form onSubmit={handleAddStep}>
                  <label>
                    Step Name:
                    <input type="text" name="name" required />
                  </label>
                  <br />
                  <label>
                    Configuration (JSON):
                    <textarea name="config" required></textarea>
                  </label>
                  <br />
                  <button type="submit">Submit</button>
                  <button
                    type="button"
                    onClick={() => setShowAddStepForm(false)}
                  >
                    Cancel
                  </button>
                </form>
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

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { fetchDataPipeline, addStep } from "../api/api";

// const DataPipelineWorkspace = () => {
//   const { id } = useParams(); // Get the pipeline ID from the URL
//   const [pipeline, setPipeline] = useState(null);
//   const [selectedView, setSelectedView] = useState(null); // To track the view (step details, analysis, add step)
//   const [expandedStep, setExpandedStep] = useState(null); // To track the currently expanded step
//   const [showAddStepForm, setShowAddStepForm] = useState(false);

//   // Fetch pipeline data on mount
//   useEffect(() => {
//     const getPipeline = async () => {
//       try {
//         const response = await fetchDataPipeline(id);
//         if (response.data?.data_pipeline) {
//           setPipeline(response.data.data_pipeline);
//         } else {
//           console.error("Invalid response format:", response);
//         }
//       } catch (error) {
//         console.error("Error fetching pipeline:", error);
//       }
//     };

//     getPipeline();
//   }, [id]);

//   // Handle form submission for adding a new step
//   const handleAddStep = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);

//     const stepData = {
//       name: formData.get("name"),
//       config: formData.get("config"),
//     };

//     try {
//       await addStep(id, stepData);
//       setShowAddStepForm(false);
//       setSelectedView(null);

//       // Re-fetch pipeline to update the steps without refreshing the page
//       const updatedPipeline = await fetchDataPipeline(id);
//       if (updatedPipeline?.data?.data_pipeline) {
//         setPipeline(updatedPipeline.data.data_pipeline);
//       }
//     } catch (error) {
//       console.error("Error adding step:", error);
//     }
//   };

//   return (
//     <div className="pipeline-workspace">
//       <h1 className="workspace-title">Data Pipeline Workspace</h1>
//       {pipeline ? (
//         <>
//           <h2 className="pipeline-title">{pipeline.pipeline_name}</h2>
//           <div className="pipeline-flow">
//             {/* Input data */}
//             <div className="input-data">
//               <span>{pipeline.input_data}</span>
//               <span className="arrow">→</span>
//             </div>

//             {/* Steps */}
//             {pipeline.flow.map((step, index) => (
//               <div key={index} className="pipeline-step">
//                 <div
//                   className={`step-circle ${
//                     expandedStep === step ? "highlighted" : ""
//                   }`}
//                 >
//                   {step.name}
//                   <button
//                     className="step-button"
//                     onClick={() => {
//                       setExpandedStep(step);
//                       setSelectedView("details");
//                       setShowAddStepForm(false);
//                     }}
//                   >
//                     Expand
//                   </button>
//                   <button
//                     className="step-button"
//                     onClick={() => {
//                       setExpandedStep(step);
//                       setSelectedView("analyse");
//                       setShowAddStepForm(false);
//                     }}
//                   >
//                     Analyse
//                   </button>
//                 </div>
//                 <span className="arrow">→</span>
//               </div>
//             ))}

//             {/* Add step button */}
//             <button
//               className="add-step-button"
//               onClick={() => {
//                 setShowAddStepForm(true);
//                 setSelectedView(null);
//                 setExpandedStep(null);
//               }}
//             >
//               +
//             </button>
//           </div>

//           {/* Selected View */}
//           <div className="pipeline-details">
//             {selectedView === "details" && expandedStep && (
//               <div>
//                 <h3>Step Details: {expandedStep.name}</h3>
//                 <pre>{JSON.stringify(expandedStep, null, 2)}</pre>
//               </div>
//             )}
//             {selectedView === "analyse" && (
//               <div>
//                 <h3>Analyse Component</h3>
//                 <p>This is a placeholder for the analysis component.</p>
//               </div>
//             )}
//             {showAddStepForm && (
//               <div>
//                 <h3>Add New Step</h3>
//                 <form onSubmit={handleAddStep}>
//                   <label>
//                     Step Name:
//                     <input type="text" name="name" required />
//                   </label>
//                   <br />
//                   <label>
//                     Configuration (JSON):
//                     <textarea name="config" required></textarea>
//                   </label>
//                   <br />
//                   <button type="submit">Submit</button>
//                   <button
//                     type="button"
//                     onClick={() => setShowAddStepForm(false)}
//                   >
//                     Cancel
//                   </button>
//                 </form>
//               </div>
//             )}
//           </div>
//         </>
//       ) : (
//         <p>Loading pipeline...</p>
//       )}
//     </div>
//   );
// };

// export default DataPipelineWorkspace;