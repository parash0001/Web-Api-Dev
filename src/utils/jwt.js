import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'FzdL6W0lN3dJCb7DJljVx5Gb3wXuB0zFwzDBrS5abiY=';
const EXPIRES_IN = '1d'; // Token expires in 1 day

/**
 * Generate a JWT token with given payload.
 * @param {Object} payload - Data to encode in token
 * @returns {string} JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
};

/**
 * Verify a JWT token
 * @param {string} token - Token string
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
