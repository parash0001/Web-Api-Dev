import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
    by: { type: String, enum: ['admin', 'user'], required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const issueSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Bug', 'Feature Request', 'Suggestion', 'Complaint', 'Compliment', 'Other'], required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], required: true },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    responses: [responseSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const Issue = mongoose.model('Issue', issueSchema);
