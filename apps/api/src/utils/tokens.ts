import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface TokenPayload {
  sub: string;
  email: string;
  type: "access" | "refresh";
}

export function signAccessToken(user: { id: string; email: string }) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      type: "access"
    } satisfies TokenPayload,
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"] }
  );
}

export function signRefreshToken(user: { id: string; email: string }) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      type: "refresh"
    } satisfies TokenPayload,
    env.JWT_REFRESH_SECRET,
    { expiresIn: `${env.REFRESH_TOKEN_DAYS}d` }
  );
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
}
