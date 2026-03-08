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

// Shared email wrapper with Skiilify branding
const emailWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f0fdfa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f0fdfa; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(13, 148, 136, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d9488, #0891b2); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 1px;">Skiilify</h1>
              <p style="margin: 6px 0 0; color: #ccfbf1; font-size: 13px; letter-spacing: 0.5px;">Learn. Grow. Achieve.</p>
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
            <td style="background-color: #f0fdfa; padding: 24px 40px; text-align: center; border-top: 1px solid #ccfbf1;">
              <p style="margin: 0; color: #5eead4; font-size: 12px;">&copy; 2026 Skiilify. All rights reserved.</p>
              <p style="margin: 6px 0 0; color: #99f6e4; font-size: 11px;">If you didn't request this email, please ignore it.</p>
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
              <h2 style="margin: 0 0 8px; color: #134e4a; font-size: 22px; font-weight: 700;">Verify Your Email</h2>
              <p style="margin: 0 0 24px; color: #5f6d6a; font-size: 15px; line-height: 1.6;">Thanks for signing up! Use the verification code below to complete your registration.</p>
              
              <div style="background: linear-gradient(135deg, #f0fdfa, #ecfeff); border: 2px solid #99f6e4; border-radius: 12px; padding: 28px; text-align: center; margin: 24px 0;">
                <p style="margin: 0 0 12px; color: #5f6d6a; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Your Verification Code</p>
                <p style="margin: 0; font-size: 36px; font-weight: 800; color: #0d9488; letter-spacing: 6px; font-family: 'Courier New', Courier, monospace;">${formattedCode}</p>
              </div>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="${process.env.FRONTEND_URL}/verify-email?email=${encodeURIComponent(email)}&code=${verificationCode}" 
                       style="display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #0d9488, #0891b2); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600; letter-spacing: 0.5px;">
                      Copy &amp; Verify
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #94a3b8; font-size: 13px; text-align: center;">This code expires in <strong style="color: #0d9488;">24 hours</strong>.</p>
        `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code - Skiilify",
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
                <div style="display: inline-block; background: linear-gradient(135deg, #ccfbf1, #cffafe); border-radius: 50%; width: 72px; height: 72px; line-height: 72px; font-size: 36px; margin-bottom: 16px;">&#10003;</div>
              </div>
              <h2 style="margin: 0 0 8px; color: #134e4a; font-size: 22px; font-weight: 700; text-align: center;">Welcome, ${name}!</h2>
              <p style="margin: 0 0 24px; color: #5f6d6a; font-size: 15px; line-height: 1.6; text-align: center;">Your email has been verified successfully. You're all set to start your learning journey on Skiilify!</p>
              
              <div style="background: linear-gradient(135deg, #f0fdfa, #ecfeff); border-radius: 12px; padding: 24px; margin: 24px 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: #0d9488; font-size: 18px; vertical-align: middle;">&#9733;</span>
                      <span style="color: #374151; font-size: 14px; margin-left: 8px;">Discover courses tailored for you</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: #0d9488; font-size: 18px; vertical-align: middle;">&#9733;</span>
                      <span style="color: #374151; font-size: 14px; margin-left: 8px;">Connect with skilled mentors</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: #0d9488; font-size: 18px; vertical-align: middle;">&#9733;</span>
                      <span style="color: #374151; font-size: 14px; margin-left: 8px;">Track your progress &amp; grow</span>
                    </td>
                  </tr>
                </table>
              </div>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="${process.env.FRONTEND_URL}/login" 
                       style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #0d9488, #0891b2); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600; letter-spacing: 0.5px;">
                      Start Learning
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #94a3b8; font-size: 13px; text-align: center;">Happy Learning! &#127891;</p>
        `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Skiilify! 🎉",
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

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
};
