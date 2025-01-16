import { useEffect, useState } from "react";
import { fetchTableNames, uploadCsv, deleteTable } from "../api/api";

const RawDatasetsPage = () => {
  const [datasets, setDatasets] = useState([]);
  const [expandedDataset, setExpandedDataset] = useState(null);
  const [newDatasetName, setNewDatasetName] = useState("");
  const [newDatasetFile, setNewDatasetFile] = useState(null);

  // Fetch datasets
  useEffect(() => {
    const loadDatasets = async () => {
      try {
        const response = await fetchTableNames();
        setDatasets(response.data);
      } catch (error) {
        console.error("Error fetching datasets:", error);
      }
    };
    loadDatasets();
  }, []);

  // Upload new dataset
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newDatasetName || !newDatasetFile) {
      alert("Please provide both dataset name and file.");
      return;
    }

    const formData = new FormData();
    formData.append("file_name", newDatasetName);
    formData.append("file", newDatasetFile);

    try {
      const response = await uploadCsv(formData);
      alert(response.data.message);
      setDatasets([...datasets, newDatasetName]); // Update datasets
      setNewDatasetName("");
      setNewDatasetFile(null);
    } catch (error) {
      console.error("Error uploading dataset:", error);
      alert("Error uploading dataset.");
    }
  };

  // Open Raw dataset
  const openRawDataset = (dataset) => {
    const url = `${window.location.origin}/raw_dataset_workspace/${dataset}`;
    window.open(url, "_blank"); // Open in a new tab
  };

  // Delete dataset
  const handleDelete = async (datasetName) => {
    try {
      await deleteTable(datasetName);
      alert(`Dataset "${datasetName}" deleted successfully.`);
      setDatasets(datasets.filter((name) => name !== datasetName)); // Remove from list
      if (expandedDataset?.name === datasetName) setExpandedDataset(null); // Collapse if expanded
    } catch (error) {
      console.error("Error deleting dataset:", error);
      alert("Error deleting dataset.");
    }
  };

  return (
    <div className="page">
      <h1 className="page-header">Raw Datasets</h1>
      <form className="upload-form" onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Dataset name"
          value={newDatasetName}
          onChange={(e) => setNewDatasetName(e.target.value)}
          required
        />
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setNewDatasetFile(e.target.files[0])}
          required
        />
        <button type="submit">Add Dataset</button>
      </form>

      <ul className="list-on-page">
        {datasets.map((dataset) => (
          <li key={dataset} className="item-of-list">
            <span className="item-header">{dataset}</span>
            <div className="button-group">
              <button
                className="open-item-btn"
                onClick={() => openRawDataset(dataset)}
              >
                Open
              </button>
              <button
                className="delete-item-btn"
                onClick={() => handleDelete(dataset)}
              >
                Delete
              </button>
            </div>

            {expandedDataset?.name === dataset && (
              <div className="dataset-details">
                <table>
                  <thead>
                    <tr>
                      {Object.keys(expandedDataset.data[0] || {}).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {expandedDataset.data.map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).map((value, idx2) => (
                          <td key={idx2}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RawDatasetsPage;