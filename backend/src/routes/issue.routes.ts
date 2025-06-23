import { Router } from "express";
import { createIssue } from "../controllers/issue.controller";
import { authenticate } from "../middleware/auth";

const issueRoutes =  Router()

issueRoutes.post("/", authenticate, createIssue);



export default issueRoutes;