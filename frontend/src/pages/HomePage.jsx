import CreateProject from "../components/CreateProject";
import ProjectList from "../components/ProjectList";

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Home Page</h1>
      <div>
          <CreateProject/>
      </div>
      <div>
        <ProjectList/>
      </div>
    </div>
  );
};

export default HomePage;