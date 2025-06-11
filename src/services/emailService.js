import { transporter } from '../config/mailer.js';

export const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Reset Password OTP',
    html: `<p>Your OTP code is <b>${otp}</b>. It will expire in 5 minutes.</p>`
  });
};
