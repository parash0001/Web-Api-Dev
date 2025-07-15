// forgotPassword.routes.js
import express from "express";
import {
  sendOtpToEmail,
  verifyOtp,
  resetPassword,
} from "../controller/forgetPasswordController.js";

const router = express.Router();

router.post("/email", sendOtpToEmail);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
