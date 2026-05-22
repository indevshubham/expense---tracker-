import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { env } from "../config/env";
import { RefreshToken } from "../models/refresh-token.model";
import { User } from "../models/user.model";
import { createDefaultCategories } from "../services/category.service";
import { sendPasswordResetEmail, sendVerificationEmail } from "../services/mailer.service";
import { writeAuditLog } from "../services/audit.service";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";
import { clearRefreshCookie, refreshCookieName, setRefreshCookie } from "../utils/cookies";
import { randomToken, sha256 } from "../utils/crypto";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens";

async function createRefreshSession(req: Request, user: { id: string; email: string }) {
  const refreshToken = signRefreshToken(user);
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    user: user.id,
    tokenHash: sha256(refreshToken),
    expiresAt,
    createdByIp: req.ip,
    userAgent: req.get("user-agent")
  });

  return refreshToken;
}

function publicUser(user: { _id: unknown; name: string; email: string; isEmailVerified: boolean; createdAt?: Date }) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt
  };
}

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const existing = await User.findOne({ email: req.body.email, deletedAt: null });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const verificationToken = randomToken();
  const passwordHash = await bcrypt.hash(req.body.password, env.BCRYPT_SALT_ROUNDS);
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    passwordHash,
    emailVerificationTokenHash: sha256(verificationToken),
    emailVerificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });

  await createDefaultCategories(user._id.toString());
  await sendVerificationEmail(user.email, verificationToken);
  await writeAuditLog(req, { action: "auth.signup", entity: "User", entityId: user._id });

  const accessToken = signAccessToken({ id: user._id.toString(), email: user.email });
  const refreshToken = await createRefreshSession(req, { id: user._id.toString(), email: user.email });
  setRefreshCookie(res, refreshToken);

  res.status(201).json({
    user: publicUser(user),
    accessToken
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email, deletedAt: null }).select("+passwordHash");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const passwordOk = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!passwordOk) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = signAccessToken({ id: user._id.toString(), email: user.email });
  const refreshToken = await createRefreshSession(req, { id: user._id.toString(), email: user.email });
  setRefreshCookie(res, refreshToken);
  await writeAuditLog(req, { action: "auth.login", entity: "User", entityId: user._id });

  res.json({
    user: publicUser(user),
    accessToken
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[refreshCookieName];
  if (!token) {
    throw new ApiError(401, "Refresh token missing");
  }

  const payload = verifyRefreshToken(token);
  if (payload.type !== "refresh") {
    throw new ApiError(401, "Invalid token type");
  }

  const tokenHash = sha256(token);
  const stored = await RefreshToken.findOne({
    tokenHash,
    user: payload.sub,
    revokedAt: null,
    deletedAt: null,
    expiresAt: { $gt: new Date() }
  });

  if (!stored) {
    throw new ApiError(401, "Refresh session expired");
  }

  const user = await User.findOne({ _id: payload.sub, deletedAt: null });
  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  stored.revokedAt = new Date();
  await stored.save();

  const accessToken = signAccessToken({ id: user._id.toString(), email: user.email });
  const refreshToken = await createRefreshSession(req, { id: user._id.toString(), email: user.email });
  setRefreshCookie(res, refreshToken);

  res.json({
    user: publicUser(user),
    accessToken
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[refreshCookieName];
  if (token) {
    await RefreshToken.findOneAndUpdate({ tokenHash: sha256(token), revokedAt: null }, { revokedAt: new Date() });
  }
  clearRefreshCookie(res);
  await writeAuditLog(req, { action: "auth.logout", entity: "User" });
  res.status(204).send();
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findOne({ _id: req.user?.id, deletedAt: null });
  if (!user) throw new ApiError(404, "User not found");
  res.json({ user: publicUser(user) });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const tokenHash = sha256(req.body.token);
  const user = await User.findOne({
    emailVerificationTokenHash: tokenHash,
    emailVerificationExpiresAt: { $gt: new Date() },
    deletedAt: null
  }).select("+emailVerificationTokenHash +emailVerificationExpiresAt");

  if (!user) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  user.isEmailVerified = true;
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationExpiresAt = undefined;
  await user.save();
  await writeAuditLog(req, { action: "auth.verifyEmail", entity: "User", entityId: user._id });

  res.json({ user: publicUser(user) });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email, deletedAt: null }).select(
    "+passwordResetTokenHash +passwordResetExpiresAt"
  );

  if (user) {
    const token = randomToken();
    user.passwordResetTokenHash = sha256(token);
    user.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    await sendPasswordResetEmail(user.email, token);
    await writeAuditLog(req, { action: "auth.forgotPassword", entity: "User", entityId: user._id });
  }

  res.json({ message: "If an account exists, a password reset email has been sent" });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const tokenHash = sha256(req.body.token);
  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpiresAt: { $gt: new Date() },
    deletedAt: null
  }).select("+passwordHash +passwordResetTokenHash +passwordResetExpiresAt");

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  user.passwordHash = await bcrypt.hash(req.body.password, env.BCRYPT_SALT_ROUNDS);
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpiresAt = undefined;
  await user.save();
  await RefreshToken.updateMany({ user: user._id, revokedAt: null }, { revokedAt: new Date() });
  await writeAuditLog(req, { action: "auth.resetPassword", entity: "User", entityId: user._id });

  res.json({ message: "Password reset successfully" });
});
