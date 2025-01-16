import { useState } from 'react';
import { addPipelineComponent } from '../../api/api';

const AddComponent = ({ project_id, position, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    config: '',
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = async () => {
    try {
      await addPipelineComponent(project_id, position, formData);
      onSuccess(); // Refresh pipeline
    } catch (err) {
      console.error("Error adding component:", err);
      setError("Failed to add component.");
    }
  };

  return (
    <div>
      <h4>Add Component at Position {position}</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        name="name"
        placeholder="Component Name"
        value={formData.name}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="type"
        placeholder="Component Type"
        value={formData.type}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="config"
        placeholder="Component Config"
        value={formData.config}
        onChange={handleInputChange}
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};

export default AddComponent;