"use strict";
// const transporter: nodemailer.Transporter = nodemailer.createTransport({...});
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerifyEmail = exports.sendResetEmail = void 0;
// const sendResetEmail = async (email: string, resetCode: string): Promise<nodemailer.SentMessageInfo> => {
//   const result = await transporter.sendMail(mailOptions);
//   return result;
// };
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Hostinger SMTP credentials
let transporter = nodemailer_1.default.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// Function to send the reset email
const sendResetEmail = async (email, resetCode) => {
    const mailOptions = {
        from: `${process.env.APP_NAME} <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `${process.env.APP_NAME} - Password Reset Request`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>We received a request to reset your password for your ${process.env.APP_NAME} account.</p>
        
        <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; text-align: center;">
          <strong style="font-size: 24px; letter-spacing: 2px;">${resetCode}</strong>
        </div>
        
        <p>This verification code will expire in <strong>5 minutes</strong>.</p>
        
        <p style="color: #666; font-size: 14px;">
          If you didn't request this, please ignore this email or contact support at 
          <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a>.
        </p>
        
        <p>Thanks,<br>The ${process.env.APP_NAME} Team</p>
      </div>
    `,
        text: `
      Password Reset Request\n\n
      We received a request to reset your password for your ${process.env.APP_NAME} account.\n\n
      Your verification code is: ${resetCode}\n\n
      This code will expire in 5 minutes.\n\n
      If you didn't request this, please ignore this email.\n\n
      Thanks,\nThe ${process.env.APP_NAME} Team
    `,
    };
    try {
        const emailResult = await transporter.sendMail(mailOptions);
        return emailResult;
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
};
exports.sendResetEmail = sendResetEmail;
const sendVerifyEmail = async (email, verificationCode) => {
    const mailOptions = {
        from: `${process.env.APP_NAME} <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `${process.env.APP_NAME} - Email Verification Code`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;
                  padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
        
        <p style="font-size: 15px; color: #555;">
          Welcome to <strong>${process.env.APP_NAME}</strong>! To complete your registration, 
          please enter the verification code below:
        </p>
        
        <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; 
                    text-align: center; border-radius: 6px;">
          <strong style="font-size: 26px; letter-spacing: 3px; color: #333;">
            ${verificationCode}
          </strong>
        </div>
        
        <p style="font-size: 14px; color: #555;">
          This code will expire in <strong>5 minutes</strong>.
        </p>
        
        <p style="color: #666; font-size: 13px; margin-top: 25px;">
          If you didn’t request this, you can safely ignore this email or contact support at 
          <a href="mailto:${process.env.SUPPORT_EMAIL}" 
             style="color: #0073e6; text-decoration: none;">
             ${process.env.SUPPORT_EMAIL}
          </a>.
        </p>
        
        <p style="margin-top: 30px; font-size: 14px; color: #333;">
          Thanks,<br>
          The ${process.env.APP_NAME} Team
        </p>
      </div>
    `,
        text: `
      Verify Your Email

      Welcome to ${process.env.APP_NAME}! 
      Your verification code is: ${verificationCode}

      This code will expire in 5 minutes.

      If you didn’t request this, ignore this email or contact support: ${process.env.SUPPORT_EMAIL}

      Thanks,
      The ${process.env.APP_NAME} Team
    `,
    };
    try {
        const emailResult = await transporter.sendMail(mailOptions);
        return emailResult;
    }
    catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email");
    }
};
exports.sendVerifyEmail = sendVerifyEmail;
//# sourceMappingURL=emailerService.js.map