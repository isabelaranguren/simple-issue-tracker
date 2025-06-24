import { Router } from "express";
import {
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
  changeIssueStatus,
  deleteIssue,
} from "../controllers/issue.controller";
import { authenticate } from "../middleware/auth";

const issueRoutes =  Router()

issueRoutes.post("/", authenticate, createIssue);
issueRoutes.get("/", authenticate, getIssues);
issueRoutes.get("/id/:issueId", authenticate, getIssueById);
issueRoutes.patch("/:issueId", authenticate, updateIssue);
issueRoutes.patch("/:issueId/status", authenticate, changeIssueStatus);
issueRoutes.delete("/:issueId", authenticate, deleteIssue);

export default issueRoutes;