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

// Send verification email
const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: email,
            subject: "Email Verification - Skiilify",
            html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #333;">Welcome to Skiilify!</h2>
          <p>Thank you for signing up. Please verify your email address to get started.</p>
          <p>
            <a href="${verificationUrl}" style="display: inline-block; padding: 12px 30px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
              Verify Email Address
            </a>
          </p>
          <p>Or copy and paste this link in your browser:</p>
          <p>${verificationUrl}</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">This link will expire in 24 hours.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;">
          <p style="color: #999; font-size: 12px;">If you didn't sign up for Skiilify, please ignore this email.</p>
        </div>
      `,
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
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to Skiilify!",
            html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #333;">Welcome, ${name}!</h2>
          <p>Your email has been successfully verified.</p>
          <p>You can now log in and start exploring amazing courses on Skiilify.</p>
          <p>
            <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; padding: 12px 30px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
              Go to Login
            </a>
          </p>
          <p>Happy Learning!</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;">
          <p style="color: #999; font-size: 12px;">© 2026 Skiilify. All rights reserved.</p>
        </div>
      `,
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
