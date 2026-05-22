import type { Response } from "express";
import { env, isProduction } from "../config/env";

export const refreshCookieName = "expense_refresh";

export function setRefreshCookie(res: Response, token: string) {
  res.cookie(refreshCookieName, token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE || isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: env.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
    path: "/api/v1/auth"
  });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie(refreshCookieName, {
    httpOnly: true,
    secure: env.COOKIE_SECURE || isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api/v1/auth"
  });
}
