import prisma from "../utils/prisma";
import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";

export const getIssues = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const projectId = req.query.projectId as string;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!projectId) {
      res.status(400).json({ message: "Missing projectId in query" });
      return;
    }

    // Validate project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.ownerId !== userId) {
      res.status(403).json({ message: "Forbidden or project not found" });
      return;
    }

    const issues = await prisma.issue.findMany({
      where: { projectId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(200).json(issues);
  } catch (error) {
    console.error("Get issues error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getIssueById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const issueId = req.params.issueId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            ownerId: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!issue) {
      res.status(404).json({ message: "Issue not found" });
      return;
    }

    if (issue.project.ownerId !== userId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    res.status(200).json(issue);
  } catch (error) {
    console.error("Get issue by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateIssue = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const issueId = req.params.issueId;
    const { title, description } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Find the issue and include project ownerId to verify ownership
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: { project: true },
    });

    if (!issue) {
      res.status(404).json({ message: "Issue not found" });
      return;
    }

    if (issue.project.ownerId !== userId) {
      res.status(403).json({ message: "Forbidden: Not your issue" });
      return;
    }

    // Update fields if provided
    const updatedIssue = await prisma.issue.update({
      where: { id: issueId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
      },
    });

    res.status(200).json(updatedIssue);
  } catch (error) {
    console.error("Update issue error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markIssueAsSolved = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const issueId = req.params.issueId;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Verify issue exists and ownership
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: { project: true },
    });

    if (!issue) {
      res.status(404).json({ message: "Issue not found" });
      return;
    }

    if (issue.project.ownerId !== userId) {
      res.status(403).json({ message: "Forbidden: Not your issue" });
      return;
    }

    // Update status
    const updatedIssue = await prisma.issue.update({
      where: { id: issueId },
      data: { status: "solved" },
    });

    res.status(200).json(updatedIssue);
  } catch (error) {
    console.error("Mark issue as solved error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteIssue = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const issueId = req.params.issueId;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Check ownership by fetching issue with project owner
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: { project: true },
    });

    if (!issue) {
      res.status(404).json({ message: "Issue not found" });
      return;
    }

    if (issue.project.ownerId !== userId) {
      res.status(403).json({ message: "Forbidden: Not your issue" });
      return;
    }

    await prisma.issue.delete({
      where: { id: issueId },
    });

    res.status(200).json({ message: "Issue deleted successfully" });
  } catch (error) {
    console.error("Delete issue error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createIssue = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description, projectId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!title || !projectId) {
      res.status(400).json({ message: "Title and projectId are required" });
      return;
    }

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.ownerId !== userId) {
      res
        .status(403)
        .json({ message: "Forbidden: Project not found or access denied" });
      return;
    }

    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        projectId,
        authorId: userId,
      },
    });

    res.status(201).json(issue);
  } catch (error) {
    console.error("Create issue error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
