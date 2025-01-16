import { useEffect, useState } from "react";
import { fetchTableNames, selectCsvData } from "../../api/api"; // Import the fetchTableNames function

const SelectData = (project_id) => {
  const [selectedTable, setSelectedTable] = useState('');
  const [fileName, setFileName] = useState(""); // State to store selected file name
  const [tableNames, setTableNames] = useState([]); // State to store table names
  const [error, setError] = useState(""); // To store any error message
//   console.log(project_id.project_id);

  useEffect(() => {
    const getTableNames = async () => {
      try {
        const response = await fetchTableNames(); // Fetch all table names
        setTableNames(response.data); // Store table names
      } catch (error) {
        console.error("Error fetching table names:", error);
        setError("Error fetching table names");
      }
    };
    getTableNames();
  }, []); // Fetch table names only once when the component mounts

  useEffect(() => {
    // Fetch data only if fileName is selected
    if (fileName) {
      selectCsvData(project_id.project_id,fileName);
    }
  }, [project_id,fileName]); // Dependency on fileName

  const handleSubmit = (e) => {
    e.preventDefault();
    setFileName(selectedTable); // Update fileName only on form submission
  };

  return (
    <div>

        

      <form onSubmit={handleSubmit}>
        <label>
          Select Data:
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
          >
            <option value="">-- Select a table --</option>
            {tableNames.map((tableName, index) => (
              <option key={index} value={tableName}>
                {tableName}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Submit</button>
      </form>
      <div>
        <p>Data: {fileName || 'None'}</p>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>} {/* Error message display */}

    </div>
  );
};

export default SelectData;