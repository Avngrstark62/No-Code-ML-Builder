import { useEffect, useState } from "react";
import { fetchTableNames, deleteTable } from "../../../api/api";

const DeleteTable = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");

  useEffect(() => {
    const getTables = async () => {
      try {
        const response = await fetchTableNames();
        setTables(response.data);
      } catch (error) {
        console.error("Error fetching table names:", error);
      }
    };
    getTables();
  }, []);

  const handleDelete = async () => {
    if (!selectedTable) {
      alert("Please select a table to delete");
      return;
    }

    try {
      await deleteTable(selectedTable);
      alert(`Table "${selectedTable}" deleted successfully`);
      setTables(tables.filter((table) => table !== selectedTable));
      setSelectedTable(""); // Reset selection
    } catch (error) {
      console.error("Error deleting table:", error);
      alert(`Failed to delete table "${selectedTable}"`);
    }
  };

  return (
    <div>
      <h2>Delete Data</h2>
      {tables.length ? (
        <div>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
          >
            <option value="">Select a table</option>
            {tables.map((table, index) => (
              <option key={index} value={table}>
                {table}
              </option>
            ))}
          </select>
          <button onClick={handleDelete}>Delete Table</button>
        </div>
      ) : (
        <p>No tables available</p>
      )}
    </div>
  );
};

export default DeleteTable;