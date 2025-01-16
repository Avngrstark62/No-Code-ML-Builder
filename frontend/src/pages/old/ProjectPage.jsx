import { useState } from "react";
import { useParams } from "react-router-dom";
import ProjectDetails from "../components/ProjectDetails";
import SelectData from "../components/SelectData";
import Pipeline from "../components/Pipleline";

const Project = () => {
  const { project_id } = useParams();
  const [showSelectData, setShowSelectData] = useState(false);

  return (
    <div>

      <div>
        <ProjectDetails project_id={project_id}/>
      </div>

      <div>
        <button onClick={() => setShowSelectData(!showSelectData)}>
        {showSelectData ? "Close" : "Select Data"}
        </button>
        {showSelectData && <SelectData project_id={project_id} />}
      </div>

      <div>
        <Pipeline projectId={project_id}/>
      </div>

    </div>
  );
};

export default Project;