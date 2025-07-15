import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bloodType: { type: String, required: true },
    units: { type: Number, required: true },
    location: { type: String, required: true },
    donatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Donation', donationSchema);
