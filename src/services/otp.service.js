import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

const sentOtps = new Map();

const generateOtp = () =>
  otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });

async function sendEmail(to, otp) {
  console.log("⚙️ Preparing to send email to:", to);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"ServiceHub OTP" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Code",
      html: `<p>Your OTP is: <b>${otp}</b></p><p>It expires in 5 minutes.</p>`,
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Failed to send OTP email:", err);
    throw new Error("Failed to send OTP email. Please try again.");
  }
}

const otpService = {
  async sendOtp(email) {
    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    sentOtps.set(email, { otp, expiresAt });

    console.log(`📩 Generated OTP for ${email}:`, otp);
    await sendEmail(email, otp);
    return otp;
  },

  async verifyOtp(email, enteredOtp) {
    const record = sentOtps.get(email);
    if (!record) return false;
    const { otp, expiresAt } = record;
    if (Date.now() > expiresAt) {
      sentOtps.delete(email);
      return false;
    }
    const isValid = otp === enteredOtp;
    if (isValid) sentOtps.delete(email);
    return isValid;
  },
};

export default otpService;
