import { Router } from "express";
import {
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
  markIssueAsSolved,
  deleteIssue,
} from "../controllers/issue.controller";
import { authenticate } from "../middleware/auth";

const issueRoutes =  Router()


issueRoutes.post(
  "/",
  (req, res, next) => {
    console.log("=== ISSUE ROUTE HIT ===");
    console.log("URL:", req.originalUrl);
    console.log("Method:", req.method);
    console.log("Headers:", req.headers);
    console.log("Cookies:", req.cookies);
    console.log("Body:", req.body);
    next();
  },
  authenticate,
  createIssue
);

issueRoutes.post("/", authenticate, createIssue);
issueRoutes.get("/", authenticate, getIssues);
issueRoutes.get("/id/:issueId", authenticate, getIssueById);
issueRoutes.patch("/:issueId", authenticate, updateIssue);
issueRoutes.patch("/:issueId/solve", authenticate, markIssueAsSolved);
issueRoutes.delete("/:issueId", authenticate, deleteIssue);

export default issueRoutes;