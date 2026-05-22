import type { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";
import { verifyAccessToken } from "../utils/tokens";

export const authenticate = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  const payload = verifyAccessToken(token);
  if (payload.type !== "access") {
    throw new ApiError(401, "Invalid token type");
  }

  const user = await User.findOne({ _id: payload.sub, deletedAt: null });
  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  req.user = {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    isEmailVerified: user.isEmailVerified
  };
  next();
});

export function requireVerifiedEmail(req: Request, _res: Response, next: NextFunction) {
  if (!req.user?.isEmailVerified) {
    throw new ApiError(403, "Please verify your email before using expense features");
  }
  next();
}
