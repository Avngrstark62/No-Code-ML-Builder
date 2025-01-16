import { useState, useEffect, useCallback } from 'react';
import { showPipeline, deletePipelineComponent } from '../../api/api';
import AddComponent from "./AddComponent";
import UpdateComponent from "./UpdateComponent";

const Pipeline = ({ projectId }) => {
  const [pipeline, setPipeline] = useState([]);
  const [expandAddComponent, setExpandAddComponent] = useState(false);
  const [expandUpdateComponent, setExpandUpdateComponent] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [error, setError] = useState(null);

  // Fetch the pipeline details
  const fetchPipeline = useCallback(async () => {
    try {
      const response = await showPipeline(projectId);
      setPipeline(response.data.pipeline.components || []); // Ensure it's an array
    } catch (err) {
      console.error("Error fetching pipeline:", err);
      setError("Failed to fetch pipeline");
    }
  }, [projectId]);

  // Fetch the pipeline on component mount or projectId change
  useEffect(() => {
    if (projectId) {
      fetchPipeline();
    }
  }, [projectId, fetchPipeline]);

  // Handle delete component
  const handleDeleteComponent = async (position) => {
    try {
      await deletePipelineComponent(projectId, position);
      fetchPipeline(); // Refresh the pipeline after deletion
    } catch (err) {
      console.error("Error deleting component:", err);
      setError("Failed to delete component");
    }
  };

  // Handle add component
  const handleAddComponentToggle = (position) => {
    setExpandAddComponent(!expandAddComponent);
    setCurrentPosition(position);
  };

  // Handle update component
  const handleUpdateComponentToggle = (position) => {
    setExpandUpdateComponent(!expandUpdateComponent);
    setCurrentPosition(position);
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {pipeline.map((component, index) => (
        <div key={index}>
          <div className="mid-add-button" style={{ border: '2px solid red', padding: '10px', margin: '10px 0' }}>
            {index < pipeline.length && (
              <div>
                <button onClick={() => handleAddComponentToggle(index + 1)}>
                  {expandAddComponent && currentPosition === index + 1 ? "Close" : "Add Component"}
                </button>
                {expandAddComponent && currentPosition === index + 1 && (
                  <AddComponent project_id={projectId} position={index + 1} onSuccess={fetchPipeline} />
                )}
              </div>
            )}
          </div>

          <div className="pipeline-component" style={{ border: '2px solid blue', padding: '10px', margin: '10px 0' }}>
            <h3>{component.name}</h3>
            <p>Type: {component.type}</p>
            <button onClick={() => handleUpdateComponentToggle(index + 1)}>
              {expandUpdateComponent && currentPosition === index + 1 ? "Close" : "Update Component"}
            </button>
            {expandUpdateComponent && currentPosition === index + 1 && (
              <UpdateComponent project_id={projectId} position={index + 1} onSuccess={fetchPipeline} />
            )}
            <button onClick={() => handleDeleteComponent(index + 1)}>Delete</button>
          </div>
        </div>
      ))}

      {/* Add button for adding at the end of the pipeline */}
      <div>
        <button onClick={() => handleAddComponentToggle(pipeline.length + 1)}>
          {expandAddComponent && currentPosition === pipeline.length + 1 ? "Close" : "Add Component"}
        </button>
        {expandAddComponent && currentPosition === pipeline.length + 1 && (
          <AddComponent project_id={projectId} position={pipeline.length + 1} onSuccess={fetchPipeline} />
        )}
      </div>
    </div>
  );
};

export default Pipeline;

// import { useState, useEffect, useCallback } from 'react';
// import { showPipeline, deletePipelineComponent } from '../api/api';
// import AddComponent from "./AddComponent";
// import UpdateComponent from "./UpdateComponent";

// const Pipeline = ({ projectId }) => {
//   const [pipeline, setPipeline] = useState([]);
//   const [expandAddComponent, setExpandAddComponent] = useState(false);
//   const [expandUpdateComponent, setExpandUpdateComponent] = useState(false);
//   const [currentPosition, setCurrentPosition] = useState(null);
//   const [error, setError] = useState(null);

//   // Fetch the pipeline details
//   useEffect(() => {
//     const fetchPipeline = async () => {
//       try {
//         const response = await showPipeline(projectId);
//         setPipeline(response.data.pipeline.components || []); // Ensure it's an array
//         console.log(response)
//       } catch (err) {
//         console.error("Error fetching pipeline:", err);
//       }
//     };
  
//     if (projectId) {
//       fetchPipeline();
//     }
//   }, [projectId]);  

//   useEffect(() => {
//     fetchPipeline();
//   }, [fetchPipeline]);

//   // Handle delete component
//   const handleDeleteComponent = async (position) => {
//     try {
//       await deletePipelineComponent(projectId, position);
//       fetchPipeline(); // Refresh the pipeline after deletion
//     } catch (err) {
//       console.error("Error deleting component:", err);
//       setError("Failed to delete component");
//     }
//   };

//   // Handle add component
//   const handleAddComponentToggle = (position) => {
//     setExpandAddComponent(!expandAddComponent);
//     setCurrentPosition(position);
//   };

//   // Handle update component
//   const handleUpdateComponentToggle = (position) => {
//     setExpandUpdateComponent(!expandUpdateComponent);
//     setCurrentPosition(position);
//   };

//   return (
//     <div>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {pipeline.map((component, index) => (
//         <div key={index}>
//           <div className="mid-add-button" style={{ border: '2px solid red', padding: '10px', margin: '10px 0' }}>
//             {index < pipeline.length && (
//               <div>
//                 <button onClick={() => handleAddComponentToggle(index + 1)}>
//                   {expandAddComponent && currentPosition === index + 1 ? "Close" : "Add Component"}
//                 </button>
//                 {expandAddComponent && currentPosition === index + 1 && (
//                   <AddComponent project_id={projectId} position={index + 1} onSuccess={fetchPipeline} />
//                 )}
//               </div>
//             )}
//           </div>

//           <div className="pipeline-component" style={{ border: '2px solid blue', padding: '10px', margin: '10px 0' }}>
//             <h3>{component.name}</h3>
//             <p>Type: {component.type}</p>
//             <button onClick={() => handleUpdateComponentToggle(index + 1)}>
//               {expandUpdateComponent && currentPosition === index + 1 ? "Close" : "Update Component"}
//             </button>
//             {expandUpdateComponent && currentPosition === index + 1 && (
//               <UpdateComponent project_id={projectId} position={index + 1} onSuccess={fetchPipeline} />
//             )}
//             <button onClick={() => handleDeleteComponent(index + 1)}>Delete</button>
//           </div>
//         </div>
//       ))}

//       {/* Add button for adding at the end of the pipeline */}
//       <div>
//         <button onClick={() => handleAddComponentToggle(pipeline.length + 1)}>
//           {expandAddComponent && currentPosition === pipeline.length + 1 ? "Close" : "Add Component"}
//         </button>
//         {expandAddComponent && currentPosition === pipeline.length + 1 && (
//           <AddComponent project_id={projectId} position={pipeline.length + 1} onSuccess={fetchPipeline} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Pipeline;

// import { useState, useEffect, useCallback } from 'react';
// import { showPipeline, addPipelineComponent, updatePipelineComponent, deletePipelineComponent } from '../api/api';
// import AddComponent from "./AddComponent"
// import UpdateComponent from "./UpdateComponent"

// const Pipeline = ({ projectId }) => {
//   const [expandAddComponent, setExpandAddComponent] = useState(false);
//   const [expandUpdateComponent, setExpandUpdateComponent] = useState(false);

//   return (
//       <div>
//         {pipeline.map((component, index) => (
//           <div key={index}>
//               <div className="mid-add-button" style={{ border: '2px solid red', padding: '10px', margin: '10px 0' }}>
//               {index < pipeline.length && (
//                 <div>
//                   <button onClick={() => setExpandAddComponent(!expandAddComponent)}>
//                   {expandAddComponent ? "Close" : "Add Component"}
//                 </button>
//                 {expandAddComponent && <AddComponent project_id={project_id} position={index+1}/>}
//                 </div>
//               )}
//               </div>

//               <div className="pipeline-component" style={{ border: '2px solid blue', padding: '10px', margin: '10px 0' }}>
//                 <h3>{component.name}</h3>
//                 <p>Type: {component.type}</p>

//                   <button onClick={() => setExpandUpdateComponent(!expandUpdateComponent)}>
//                   {expandUpdateComponent ? "Close" : "Update Component"}
//                 </button>
//                 {expandUpdateComponent && <UpdateComponent project_id={project_id} position={index+1}/>}

//                 <button onClick={() => handleDeleteComponent(index+1)}>Delete</button>
//               </div>
//           </div>
//         ))}

//       <div>
//         <button onClick={() => setExpandAddComponent(!expandAddComponent)}>
//         {expandAddComponent ? "Close" : "Add Component"}
//       </button>
//       {expandAddComponent && <AddComponent project_id={project_id} position={index+1}/>}
//       </div>

//       </div>
//   );
// };