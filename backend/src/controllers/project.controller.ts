import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { AuthRequest } from "../middleware/auth";

/**
 * Create a new project.
 * Requires userId from JWT middleware (attached to req.user).
 */
export const createProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!name) {
      res.status(400).json({ message: "Project name is required" });
      return;
    }

    const project = await prisma.project.create({
      data: {
        name,
        ownerId: userId,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get all projects for logged-in user.
 */
export const getProjects = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const projects = await prisma.project.findMany({
      where: { ownerId: userId },
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProjectById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const projectId = req.params.projectId;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return; 
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.ownerId !== userId) {
    res.status(404).json({ message: "Project not found or access denied" });
    return; 
  }

  res.json(project);
};

/**
 * Delete Project
 */
export const deleteProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const projectId = req.params.projectId;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    if (project.ownerId !== userId) {
      res.status(403).json({ message: "Forbidden: Not your project" });
      return;
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
