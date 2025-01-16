import CreateNewDataPipeline from "../components/CreateNewDataPipeline";
import { deleteDataPipeline, fetchAllDataPipelines } from "../api/api";
import { useEffect, useState } from "react";

const DataPipelinesPage = () => {

  const [dataPipelines, setDataPipelines] = useState([]);

   useEffect(() => {
      const loadDataPipelines = async () => {
        try {
          const response = await fetchAllDataPipelines();
          setDataPipelines(response.data.data_pipelines);
        } catch (error) {
          console.error("Error fetching data pipelines:", error);
        }
      };
      loadDataPipelines();
    }, []);

  const openDataPipeline = (id) => {
    const url = `${window.location.origin}/data_pipeline_workspace/${id}`;
    window.open(url, "_blank");
  };

  const handleDelete = async (id) => {
    try {
          await deleteDataPipeline(id);
          alert(`Pipeline deleted successfully.`);
          setDataPipelines(dataPipelines.filter((data_pipeline) => data_pipeline.id !== id)); // Remove from list
        } catch (error) {
          console.error("Error deleting dataset:", error);
          alert("Error deleting dataset.");
        }
    console.log(`Deleting pipeline with id: ${id}`);
  };

  return (
    <div className="page">
      <h1 className="page-header">Data Pipelines</h1>
      
        <CreateNewDataPipeline/>
        
      <ul className="list-on-page">
        {dataPipelines.map((data_pipeline) => (
          <li key={data_pipeline.id} className="item-of-list">
            <span className="item-header">{data_pipeline.pipeline_name}</span>
            <div className="button-group">
              <button
                className="open-item-btn"
                onClick={() => openDataPipeline(data_pipeline.id)}
              >
                Open
              </button>
              <button
                className="delete-item-btn"
                onClick={() => handleDelete(data_pipeline.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataPipelinesPage;