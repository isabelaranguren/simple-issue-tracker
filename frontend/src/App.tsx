import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProjectList from "./components/Project/ProjectList";
import CreateProject from "./components/Project/CreateProject";
import CreateIssue from "./components/Issues/CreateIssue";
import ProjectDetails from "./pages/ProjectDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
        <Route path="/projects/new" element={<CreateProject />} />
        <Route
          path="/projects/:projectId/issues/new"
          element={<CreateIssue />}
        />
      </Routes>
    </BrowserRouter>
  );
}
