// src/utils/cookie.ts
import { Response } from "express";

export function setAuthCookie(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    domain: process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : undefined,
    maxAge: 1000 * 60 * 15, // 15 mins
    path: "/",
  });
}
