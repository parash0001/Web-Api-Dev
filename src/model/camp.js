import mongoose from 'mongoose';

const campSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    organizer: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Camp', campSchema);
