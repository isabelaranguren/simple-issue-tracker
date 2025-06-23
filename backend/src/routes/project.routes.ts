import { Router } from "express";
import { createProject, getProjects } from "../controllers/project.controller";
import { authenticate } from "../middleware/auth";
import { deleteProject } from "../controllers/project.controller";

const projectRoutes = Router();

projectRoutes.post("/", authenticate, createProject);
projectRoutes.get("/", authenticate, getProjects);
projectRoutes.delete("/:projectId", authenticate, deleteProject);

export default projectRoutes;