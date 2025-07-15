import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bloodType: { type: String, required: true },
    quantity: { type: Number, required: true },
    urgency: { type: String, enum: ['low', 'medium', 'high'], required: true },
    location: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    issueDescription: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('BloodRequest', bloodRequestSchema);
