import { useState } from "react";
import { uploadCsv } from "../api/api";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file || !fileName) {
      alert("Please provide both file and filename!");
      return;
    }

    const formData = new FormData();
    formData.append("file_name", fileName);
    formData.append("file", file);

    try {
      const response = await uploadCsv(formData);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Error uploading file");
    }
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Enter table name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          required
        />
        <input type="file" accept=".csv" onChange={handleFileChange} required />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default FileUpload;