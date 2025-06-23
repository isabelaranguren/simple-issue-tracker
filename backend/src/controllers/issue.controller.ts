import prisma from "../utils/prisma";
import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";


/**
 * Get all issues for the logged-in user.
 * Fetches issues from all projects owned by the user.
 */
export const getIssues = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Get issues where the project's owner is the logged-in user
    const issues = await prisma.issue.findMany({
      where: {
        project: {
          ownerId: userId,
        },
      },
      include: {
        project: true,
        author: true,
      },
    });

    res.status(200).json(issues);
  } catch (error) {
    console.error("Get issues error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Create a new issue for a project.
 * Requires title, projectId, and user from JWT middleware.
 */
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

    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        project: {
          connect: { id: projectId },
        },
        author: {
          connect: { id: userId },
        },
      },
    });

    res.status(201).json(issue);
  } catch (error) {
    console.error("Create issue error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


/**
 * Update an existing issue.
 * Only allows update if the logged-in user owns the project.
 */
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

    // Find the issue and include its project ownerId
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

    // Update issue fields if provided
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


/**
 * Mark an issue as solved by updating its status to "solved".
 */
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

    // Find the issue including the related project owner
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: { project: true },
    });

    if (!issue) {
      res.status(404).json({ message: "Issue not found" });
      return;
    }

    // Check ownership
    if (issue.project.ownerId !== userId) {
      res.status(403).json({ message: "Forbidden: Not your issue" });
      return;
    }

    // Update status to "solved"
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


export const deleteIssue = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const issueId = req.params.issueId;
    const userId = req.user?.userId;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
    }

    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
    });

    if (!issue) {
        res.status(404).json({ message: "Issue not found" });
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