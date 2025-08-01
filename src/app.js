import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import forgotPasswordRoutes from './routes/forgetPasswordRoutes.js';
import userRoutes from './routes/userRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import bloodRequestRoutes from './routes/bloodRequestRoute.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import campRoutes from './routes/campRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';




const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/forgot', forgotPasswordRoutes);
app.use('/api', userRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/requests', bloodRequestRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/camps', campRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/dashboard', dashboardRoutes);





export default app;
