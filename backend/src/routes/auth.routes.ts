import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller";
// import {loginLimiter} from '../utils/rateLimit';

const AuthRoutes = Router();

AuthRoutes.post("/register", register);
AuthRoutes.post("/login", login);
AuthRoutes.post("/logout", logout);

export default AuthRoutes;
