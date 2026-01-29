import nodemailer from 'nodemailer';
import { config } from '../config/config';

const smtpHost = config.SMTP.HOST;
const smtpPort = config.SMTP.PORT;
const smtpUser = config.SMTP.USER;
const smtpPass = config.SMTP.PASS;

const fromAddress =
  process.env.EMAIL_FROM || 'PCPS Confess <no-reply@pcps.confess>'; 

if (!smtpHost || !smtpUser || !smtpPass) {
  console.warn(
    'SMTP configuration is incomplete. Email sending will fail until SMTP_HOST, SMTP_USER, and SMTP_PASS are set.'
  );
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
});

export async function sendVerificationEmail(options: {
  to: string;
  name: string;
  verificationLink: string;
}) {
  const { to, name, verificationLink } = options;

  const subject = 'Verify your Authify account';
  const text = `Hi ${name},\n\nPlease verify your email by clicking the link below:\n${verificationLink}\n\nIf you didn’t sign up, you can ignore this email.\n`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Verify your Authify account</h2>
      <p>Hi ${name},</p>
      <p>Please verify your email by clicking the link below:</p>
      <p><a href="${verificationLink}">${verificationLink}</a></p>
      <p>If you didn’t sign up, you can ignore this email.</p>
    </div>
  `;

  return transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    text,
    html,
  });
}
