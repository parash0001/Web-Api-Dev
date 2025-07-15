import Feedback from '../model/feedback.js';


export const submitFeedback = async (req, res) => {
    try {
        const { type, subject, message } = req.body;

        if (!type || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (subject.trim().length < 3 || message.trim().length < 10) {
            return res.status(400).json({ message: 'Subject/message too short' });
        }

        // 🚫 Prevent multiple feedback from same user
        const existing = await Feedback.findOne({ user: req.user.id });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'You have already submitted feedback. Only one feedback per user is allowed.'
            });
        }

        const feedback = await Feedback.create({
            user: req.user.id,
            type,
            subject,
            message
        });

        res.status(201).json({ success: true, message: 'Feedback submitted', data: feedback });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// GET own feedbacks
export const getMyFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, data: feedbacks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET all (admin)
export const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: feedbacks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE status (admin)
export const updateFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'reviewed', 'resolved'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const updated = await Feedback.findByIdAndUpdate(id, { status }, { new: true });

        if (!updated) return res.status(404).json({ message: 'Feedback not found' });

        res.json({ success: true, message: 'Status updated', data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE feedback (user)
export const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Feedback.findOneAndDelete({
            _id: id,
            user: req.user.id
        });

        if (!deleted) return res.status(404).json({ message: 'Feedback not found or not yours' });

        res.json({ success: true, message: 'Feedback deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
