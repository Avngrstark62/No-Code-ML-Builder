import { useState, useEffect } from 'react';
import { showPipeline, addPipelineComponent, updatePipelineComponent, deletePipelineComponent } from '../../api/api';

const PipelineComponent = ({ component, position }) => {

  return (
    <div>

        <div>
        <button onClick={() => handleAddComponent(component)}>Add</button>
        <button onClick={() => handleUpdateComponent(component)}>Update</button>
        <button onClick={() => handleDeleteComponent()}>Delete</button>
        </div>

        <div>
            <p>Name: {pipeline.name}</p>
            <p>Type: {pipeline.type}</p>
            <p>Config: {pipeline.config}</p>
        </div>

    </div>

  );
};