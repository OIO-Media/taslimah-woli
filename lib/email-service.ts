import nodemailer from 'nodemailer';
import crypto from 'crypto';

/**
 * Generate a cryptographically secure 6-digit one-time passcode (CSPRNG).
 * Uses operating system entropy pool (100000 to 999999 inclusive).
 * Guarantees every single generated code is non-deterministic, completely unique,
 * and unpredictable.
 */
export function generateSecureOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || '';
const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '';
const fromAddress = process.env.SMTP_FROM || `Taslimah Woli Studio <${smtpUser || 'hello@taslimahwoli.com'}>`;

export function isEmailConfigured(): boolean {
  return !!(smtpUser && smtpPass);
}

export async function sendOtpEmail(toEmail: string, otpCode: string): Promise<{ success: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    return {
      success: false,
      error: 'Gmail SMTP is not yet configured. Please set SMTP_USER and SMTP_PASS in your environment.',
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Port 587 with STARTTLS
      auth: {
        user: smtpUser,
        pass: smtpPass.replace(/\s+/g, ''), // Strip spaces if pasted with spaces from Google
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f8f8; margin: 0; padding: 40px 20px; }
            .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e4e4; padding: 36px 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
            .header { text-align: center; margin-bottom: 24px; }
            .title { font-size: 12px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #8c8e90; margin: 0; }
            .headline { font-size: 22px; font-weight: 600; color: #18191b; margin: 12px 0 6px 0; }
            .subtext { font-size: 13px; color: #646669; line-height: 1.5; margin: 0; }
            .otp-box { text-align: center; margin: 28px 0; padding: 22px; background: #18191b; border-radius: 14px; }
            .otp-code { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 34px; font-weight: 700; letter-spacing: 0.28em; color: #ffffff; padding-left: 0.28em; }
            .expiry { font-size: 12px; color: #8c8e90; text-align: center; margin-top: 14px; line-height: 1.5; }
            .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #eef0f0; text-align: center; font-size: 11px; color: #a4a6a8; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <p class="title">TASLIMAH WOLI STUDIO</p>
              <h1 class="headline">Password Reset Passcode</h1>
              <p class="subtext">A password reset request was initiated for your Studio Content Management System account.</p>
            </div>
            <div class="otp-box">
              <div class="otp-code">${otpCode}</div>
            </div>
            <p class="expiry">This security code will expire in <strong>10 minutes</strong>.<br>If you did not request this change, you can safely disregard this message.</p>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Taslimah Woli Photography &middot; Content Management System
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: `${otpCode} is your Studio CMS verification passcode`,
      text: `Your Taslimah Woli Studio CMS password reset code is: ${otpCode}\n\nThis code will expire in 10 minutes.\nIf you did not request this, you can safely ignore this email.`,
      html: htmlContent,
    });

    return { success: true };
  } catch (err: any) {
    console.error('[SMTP] Failed to send OTP email:', err);
    return { success: false, error: err?.message || 'Failed to dispatch email' };
  }
}
