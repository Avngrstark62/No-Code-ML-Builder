import { useEffect, useState } from "react";
import { fetchTableNames, fetchCsvData } from "../../../api/api"; // Import the fetchTableNames function

const DataDisplay = () => {
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState(""); // State to store selected file name
  const [tableNames, setTableNames] = useState([]); // State to store table names
  const [error, setError] = useState(""); // To store any error message

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
    const getData = async () => {
      if (!fileName) {
        setError("Please select a file name.");
        return;
      }

      try {
        const response = await fetchCsvData(fileName); // Fetch data for selected table
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      }
    };

    // Fetch data only if fileName is selected
    if (fileName) {
      getData();
    }
  }, [fileName]); // Dependency on fileName

  return (
    <div>

      {/* Dropdown to select file name */}
      <div>
        <label>
          Select Table:
          <select
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          >
            <option value="">-- Select a table --</option>
            {tableNames.map((tableName, index) => (
              <option key={index} value={tableName}>
                {tableName}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>} {/* Error message display */}

      {data.length ? (
        <table border="1">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default DataDisplay;