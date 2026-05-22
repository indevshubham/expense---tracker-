import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  me,
  refresh,
  resetPassword,
  signup,
  verifyEmail
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";
import { authLimiter } from "../middleware/rate-limits";
import { validate } from "../middleware/validate";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  tokenSchema
} from "../validators/auth.validators";

export const authRouter = Router();

authRouter.post("/signup", authLimiter, validate({ body: signupSchema }), signup);
authRouter.post("/login", authLimiter, validate({ body: loginSchema }), login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
authRouter.get("/me", authenticate, me);
authRouter.post("/verify-email", validate({ body: tokenSchema }), verifyEmail);
authRouter.post("/forgot-password", authLimiter, validate({ body: forgotPasswordSchema }), forgotPassword);
authRouter.post("/reset-password", authLimiter, validate({ body: resetPasswordSchema }), resetPassword);
