import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'FzdL6W0lN3dJCb7DJljVx5Gb3wXuB0zFwzDBrS5abiY=';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Format should be: Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attaches decoded token payload to request object
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
