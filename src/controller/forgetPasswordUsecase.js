import userRepo from '../model/user.repo.js';
import hashService from './hashService.js';
import otpService from '../services/otp.service.js';

const ForgotPasswordUseCase = {
  async sendOtpToEmail(email) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error("User not found");
    const otp = await otpService.sendOtp(email);
    return { otpSent: true, userId: user._id };
  },

  async verifyOtp(email, otp) {
    const isValid = await otpService.verifyOtp(email, otp);
    if (!isValid) throw new Error("Invalid or expired OTP");
    return true;
  },

  async resetPassword(email, newPassword) {
    const hashed = await hashService.hash(newPassword);
    await userRepo.updatePasswordByEmail(email, hashed);
    return true;
  },
};

export default ForgotPasswordUseCase;
