import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let emailTransporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    emailTransporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for 587
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    // Verify email configuration
    emailTransporter.verify()
        .then(() => console.log("Email service configured successfully"))
        .catch(err => console.log("Email service not configured:", err.message));
} else {
    console.log("Email service not configured - running in development mode");
}
// Export transporter for use in other files
export default emailTransporter;