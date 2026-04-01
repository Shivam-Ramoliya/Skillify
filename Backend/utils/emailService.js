const nodemailer = require("nodemailer");

// Debug: Check if env variables are loaded
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✓ Loaded" : "✗ Missing");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✓ Loaded" : "✗ Missing");

// Create transporter with explicit SMTP settings
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email service error:", error.message);
    console.log("Credentials - User:", process.env.EMAIL_USER);
    console.log(
      "Credentials - Pass length:",
      process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0,
    );
  } else {
    console.log("✅ Email service ready");
  }
});

// Shared email wrapper with Skillify branding
const emailWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #F9FAFB; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F9FAFB; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(37, 99, 235, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #2563EB; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 1px;">Skillify</h1>
              <p style="margin: 6px 0 0; color: #BFDBFE; font-size: 13px; letter-spacing: 0.5px;">Exchange. Learn. Grow.</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #EFF6FF; padding: 24px 40px; text-align: center; border-top: 1px solid #DBEAFE;">
              <p style="margin: 0; color: #3B82F6; font-size: 12px;">&copy; 2026 Skillify. All rights reserved.</p>
              <p style="margin: 6px 0 0; color: #93C5FD; font-size: 11px;">If you didn't request this email, please ignore it.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Send verification email with 8-digit code
const sendVerificationEmail = async (email, verificationCode) => {
  try {
    // Format code as spaced groups for readability: 1234 5678
    const formattedCode =
      verificationCode.slice(0, 4) + " " + verificationCode.slice(4);

    const content = `
              <h2 style="margin: 0 0 8px; color: #1E3A8A; font-size: 22px; font-weight: 700;">Verify Your Email</h2>
              <p style="margin: 0 0 24px; color: #6B7280; font-size: 15px; line-height: 1.6;">Thanks for signing up! Use the verification code below to complete your registration.</p>
              
              <div style="background-color: #EFF6FF; border: 2px solid #BFDBFE; border-radius: 12px; padding: 28px; text-align: center; margin: 24px 0;">
                <p style="margin: 0 0 12px; color: #6B7280; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Your Verification Code</p>
                <p style="margin: 0; font-size: 36px; font-weight: 800; color: #2563EB; letter-spacing: 6px; font-family: 'Courier New', Courier, monospace;">${formattedCode}</p>
              </div>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="${process.env.FRONTEND_URL}/verify-email?email=${encodeURIComponent(email)}&code=${verificationCode}" 
                       style="display: inline-block; padding: 14px 36px; background-color: #2563EB; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600; letter-spacing: 0.5px;">
                      Copy &amp; Verify
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #9CA3AF; font-size: 13px; text-align: center;">This code expires in <strong style="color: #2563EB;">24 hours</strong>.</p>
        `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code - Skillify",
      html: emailWrapper(content),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Verification email error:", error.message);
    throw new Error("Failed to send verification email");
  }
};

// Send welcome email after verification
const sendWelcomeEmail = async (email, name) => {
  try {
    const content = `
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; background-color: #DCFCE7; border-radius: 50%; width: 72px; height: 72px; line-height: 72px; font-size: 36px; margin-bottom: 16px; color: #22C55E;">&#10003;</div>
              </div>
              <h2 style="margin: 0 0 8px; color: #1E3A8A; font-size: 22px; font-weight: 700; text-align: center;">Welcome, ${name}!</h2>
              <p style="margin: 0 0 24px; color: #6B7280; font-size: 15px; line-height: 1.6; text-align: center;">Your email has been verified successfully. You're all set to start your journey on Skillify!</p>
              
              <div style="background-color: #EFF6FF; border-radius: 12px; padding: 24px; margin: 24px 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: #2563EB; font-size: 18px; vertical-align: middle;">&#9733;</span>
                      <span style="color: #374151; font-size: 14px; margin-left: 8px;">Discover opportunities tailored for you</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: #2563EB; font-size: 18px; vertical-align: middle;">&#9733;</span>
                      <span style="color: #374151; font-size: 14px; margin-left: 8px;">Exchange skills with talented people</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: #2563EB; font-size: 18px; vertical-align: middle;">&#9733;</span>
                      <span style="color: #374151; font-size: 14px; margin-left: 8px;">Track your progress &amp; grow</span>
                    </td>
                  </tr>
                </table>
              </div>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="${process.env.FRONTEND_URL}/login" 
                       style="display: inline-block; padding: 14px 40px; background-color: #2563EB; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600; letter-spacing: 0.5px;">
                      Get Started
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #9CA3AF; font-size: 13px; text-align: center;">Welcome aboard! &#127891;</p>
        `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Skillify! 🎉",
      html: emailWrapper(content),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Welcome email error:", error.message);
    throw new Error("Failed to send welcome email");
  }
};

// Send account deletion OTP email
const sendDeleteAccountOtpEmail = async (email, otp, name) => {
  try {
    const formattedOtp = otp.slice(0, 3) + " " + otp.slice(3);

    const content = `
              <h2 style="margin: 0 0 8px; color: #991b1b; font-size: 22px; font-weight: 700;">Account Deletion Request</h2>
              <p style="margin: 0 0 24px; color: #6B7280; font-size: 15px; line-height: 1.6;">Hi ${name || "there"}, we received a request to permanently delete your Skillify account. Use the code below to confirm this action.</p>
              
              <div style="background-color: #fef2f2; border: 2px solid #fecaca; border-radius: 12px; padding: 28px; text-align: center; margin: 24px 0;">
                <p style="margin: 0 0 12px; color: #92400e; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Deletion Confirmation Code</p>
                <p style="margin: 0; font-size: 40px; font-weight: 800; color: #dc2626; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace;">${formattedOtp}</p>
              </div>

              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <p style="margin: 0; color: #991b1b; font-size: 14px; font-weight: 600;">⚠️ Warning: This action is irreversible</p>
                <p style="margin: 8px 0 0; color: #7f1d1d; font-size: 13px; line-height: 1.5;">Deleting your account will permanently remove all your data including your profile, job posts, applications, and uploaded files. This cannot be undone.</p>
              </div>

              <p style="margin: 0; color: #9CA3AF; font-size: 13px; text-align: center;">This code expires in <strong style="color: #dc2626;">10 minutes</strong>.</p>
              <p style="margin: 8px 0 0; color: #9CA3AF; font-size: 12px; text-align: center;">If you did not request this, please ignore this email and your account will remain safe.</p>
        `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "⚠️ Account Deletion Confirmation - Skillify",
      html: emailWrapper(content),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Delete account OTP email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Delete account OTP email error:", error.message);
    throw new Error("Failed to send account deletion OTP email");
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendDeleteAccountOtpEmail,
};
