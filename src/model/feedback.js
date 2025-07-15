import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['suggestion', 'complaint', 'idea'],
        required: true
    },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Feedback', feedbackSchema);
