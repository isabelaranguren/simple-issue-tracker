import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: { 
    userId: string; 
    email: string };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const decoded = verifyJwt(token);

  if (!decoded || typeof decoded === "string") {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return;
  }

  req.user = decoded as { userId: string; email: string };

  next(); // Proceed to next middleware/handler
};