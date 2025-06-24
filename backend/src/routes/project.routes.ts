import { Router } from "express";
import { createProject, getProjects, deleteProject, getProjectById } from "../controllers/project.controller";
import { authenticate } from "../middleware/auth";

const projectRoutes = Router();

projectRoutes.post("/", authenticate, createProject);
projectRoutes.get("/", authenticate, getProjects);
projectRoutes.delete("/:projectId", authenticate, deleteProject);
projectRoutes.get("/:projectId", authenticate, getProjectById);

export default projectRoutes;