import { Request, Response } from "express";
import { hashPassword, comparePasswords } from "../utils/hash";
import { signJwt } from "../utils/jwt";
import prisma from "../utils/prisma";
import { setAuthCookie } from "../utils/cookie";

/**
 * Register a new user.
 * Validates input, checks for existing email, hashes password,
 * creates user in DB, and returns a JWT token in a cookie.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    // Hash the password before saving
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    // Generate JWT token
    const token = signJwt({ userId: user.id, email: user.email });

    // Send token as httpOnly cookie and user info in response
    res
      .cookie("token", token, { httpOnly: true, secure: false }) // Set secure: true if HTTPS
      .status(201)
      .json({ id: user.id, email: user.email, name: user.name });
  } catch (error: any) {
    console.error("Register error:", error);
    console.error(error.stack);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

/**
 * Login an existing user.
 * Validates credentials, compares password, and sends JWT token in cookie.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Missing email or password" });
      return;
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Compare provided password with stored hash
    const passwordValid = await comparePasswords(password, user.password);
    if (!passwordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT token
    const token = signJwt({ userId: user.id, email: user.email });
    setAuthCookie(res, token);
    res.status(200).json({ id: user.id, email: user.email, name: user.name });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

import { Request, Response } from "express";

/**
 * Logout user by clearing the auth token cookie.
 */
export const logout = (req: Request, res: Response): void => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    domain:
      process.env.NODE_ENV === "production"
        ? process.env.COOKIE_DOMAIN
        : undefined,
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
};