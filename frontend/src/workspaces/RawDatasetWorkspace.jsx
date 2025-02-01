import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchCsvData } from "../api/api";

const RawDatasetWorkspace = () => {
  const { dataset } = useParams(); // Get the dataset name from the URL
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const response = await fetchCsvData(dataset); // Fetch data for selected dataset
        setData(response.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    // Fetch data only if dataset is selected
    if (dataset) {
      getData();
    }
  }, [dataset]); // Dependency on dataset

  return (
    <div style={{ margin: 0, padding: 0, height: "100vh", overflow: "auto" }}>
      <h1>Raw Dataset Workspace</h1>
      <p>Dataset Name: {dataset}</p>

      {/* Handle loading and error states */}
      {loading && <p>Loading data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display data if available */}
      {data.length > 0 ? (
        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key} style={{ padding: "8px", backgroundColor: "#f4f4f4" }}>
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx} style={{ padding: "8px", textAlign: "center" }}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No data available</p>
      )}
    </div>
  );
};

export default RawDatasetWorkspace;