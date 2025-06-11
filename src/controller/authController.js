import bcrypt from 'bcrypt';
import User from '../model/user.js';
import { generateToken } from '../utils/jwt.js'; 
import Otp from '../model/otp.js';
import { generateOtp } from '../utils/otpgenerator.js';
import { sendOtpEmail } from '../services/emailService.js';
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, age, bloodType } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ success: false, message: 'User already exists' });

    const newUser = new User({ firstName, lastName, email, password, phone, age, bloodType });
    await newUser.save(); // This triggers the password hashing

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.matchPassword(password); // uses method from schema
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateToken({ id: user._id, email: user.email });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const requestReset = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  await Otp.findOneAndUpdate(
    { email },
    { otp, expiresAt },
    { upsert: true, new: true }
  );

  await sendOtpEmail(email, otp);
  res.json({ message: 'OTP sent to your email' });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email });
  if (!record) return res.status(404).json({ error: 'No OTP found' });

  if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
  if (record.expiresAt < new Date()) return res.status(400).json({ error: 'OTP expired' });

  res.json({ message: 'OTP verified successfully' });
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const record = await Otp.findOne({ email });
  if (!record) return res.status(400).json({ error: 'OTP verification required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPassword, salt);
  user.password = hashed;

  await user.save();
  await Otp.deleteOne({ email });

  res.json({ message: 'Password reset successful' });
};