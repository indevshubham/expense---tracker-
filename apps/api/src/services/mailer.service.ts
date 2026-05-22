import nodemailer from "nodemailer";
import { env, isProduction } from "../config/env";
import { ApiError } from "../utils/api-error";

function getTransport() {
  if (env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    });
  }

  if (isProduction) {
    throw new ApiError(500, "SMTP is not configured");
  }

  return null;
}

export async function sendEmail(input: { to: string; subject: string; html: string; text: string }) {
  const transport = getTransport();

  if (!transport) {
    console.info(`[email:development] ${input.subject}\nTo: ${input.to}\n${input.text}`);
    return;
  }

  await transport.sendMail({
    from: env.MAIL_FROM,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text
  });
}

export async function sendVerificationEmail(email: string, token: string) {
  const link = `${env.CLIENT_URL}/verify-email?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to: email,
    subject: "Verify your Expense Tracker email",
    text: `Verify your email: ${link}`,
    html: `<p>Verify your email to activate your Expense Tracker account.</p><p><a href="${link}">Verify email</a></p>`
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const link = `${env.CLIENT_URL}/reset-password?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to: email,
    subject: "Reset your Expense Tracker password",
    text: `Reset your password: ${link}`,
    html: `<p>Use this secure link to reset your password.</p><p><a href="${link}">Reset password</a></p>`
  });
}
