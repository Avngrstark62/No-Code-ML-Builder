import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import {
  showPipeline,
  addPipelineComponent,
  updatePipelineComponent,
  deletePipelineComponent,
  movePipelineComponent,
} from "../api/api";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Modal from "react-modal";

const PipelineManager = ({ projectId }) => {
    // projectId = projectId.projectId;
    // console.log(projectId);
  const [pipeline, setPipeline] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [formData, setFormData] = useState({ name: "", type: "", config: {} });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  console.log(selectedComponent)

  const fetchPipeline = useCallback(async () => {
    const response = await showPipeline(projectId);
    if (response.data.success) {
      setPipeline(response.data.pipeline.components);
    }
  }, [projectId]);

  useEffect(() => {
    fetchPipeline();
  }, [fetchPipeline]);

  const handleAddComponent = async (position) => {
    if (!window.confirm("Are you sure you want to add this component?")) return;
    await addPipelineComponent(projectId, position, formData);
    fetchPipeline();
    setIsModalOpen(false);
  };

  const handleUpdateComponent = async (position) => {
    if (!window.confirm("Are you sure you want to update this component?")) return;
    await updatePipelineComponent(projectId, position, formData);
    fetchPipeline();
    setIsModalOpen(false);
  };

  const handleDeleteComponent = async (position) => {
    if (!window.confirm("Are you sure you want to delete this component?")) return;
    await deletePipelineComponent(projectId, position);
    fetchPipeline();
  };

  const handleMoveComponent = async (movablePosition, newPosition) => {
    if (!window.confirm("Are you sure you want to move this component?")) return;
    await movePipelineComponent(projectId, movablePosition, newPosition);
    fetchPipeline();
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    handleMoveComponent(result.source.index, result.destination.index);
  };

  const openModal = (type, component = null, position = null) => {
    setModalType(type);
    setSelectedComponent(component);
    setFormData(component || { name: "", type: "", config: {} });
    setIsModalOpen(true);
    if (position !== null) setFormData((prev) => ({ ...prev, position }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedComponent(null);
    setFormData({ name: "", type: "", config: {} });
  };

  return (
    <div>
      <h2>Pipeline Manager</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="pipeline">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {pipeline.map((component, index) => (
                <Draggable key={index} draggableId={`component-${index}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="pipeline-component"
                    >
                      <div onClick={() => openModal("update", component, index)}>
                        <h3>{component.name || `Component ${index + 1}`}</h3>
                        <p>Type: {component.type || "N/A"}</p>
                        <pre>{JSON.stringify(component.config, null, 2)}</pre>
                      </div>
                      <button onClick={() => handleDeleteComponent(index)}>Delete</button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button onClick={() => openModal("add")}>Add Component</button>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
        <h2>{modalType === "add" ? "Add Component" : "Update Component"}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            modalType === "add"
              ? handleAddComponent(formData.position || pipeline.length)
              : handleUpdateComponent(formData.position);
          }}
        >
          <input
            type="text"
            placeholder="Component Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Component Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
          />
          <textarea
            placeholder="Component Config (JSON)"
            value={JSON.stringify(formData.config, null, 2)}
            onChange={(e) => {
              try {
                setFormData({ ...formData, config: JSON.parse(e.target.value) });
              } catch {
                // Handle invalid JSON gracefully (e.g., display error message)
              }
            }}
          ></textarea>
          <button type="submit">Save</button>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
};

PipelineManager.propTypes = {
  projectId: PropTypes.string.isRequired,
};

export default PipelineManager;