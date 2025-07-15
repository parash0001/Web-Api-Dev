import ForgotPasswordUseCase from './forgetPasswordUsecase.js';

export async function sendOtpToEmail(req, res) {
  try {
    const { email } = req.body;
    const { otpSent, userId } = await ForgotPasswordUseCase.sendOtpToEmail(email);
    res.json({ otpSent, userId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    await ForgotPasswordUseCase.verifyOtp(email, otp);
    res.json({ valid: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword)
      throw new Error("Passwords do not match");

    await ForgotPasswordUseCase.resetPassword(email, newPassword);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
