import { Response } from "express";

export function setAuthCookie(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, //  Only true in production over HTTPS
    sameSite: "lax", //  'lax' works for most frontend <-> backend requests
    maxAge: 1000 * 60 * 15, // 15 minutes
    path: "/",
  });
}