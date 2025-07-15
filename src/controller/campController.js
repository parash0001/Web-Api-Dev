import Camp from '../model/camp.js';

// Helper to strip time from date
const stripTime = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const createCamp = async (req, res) => {
    try {
        const { title, location, date, organizer, description } = req.body;

        if (!title || !location || !date || !organizer) {
            return res.status(400).json({ message: 'All required fields must be filled' });
        }

        // Validation: prevent duplicate on same day & location
        const existing = await Camp.findOne({
            title,
            location,
            date: {
                $gte: stripTime(date),
                $lt: new Date(stripTime(date).getTime() + 24 * 60 * 60 * 1000) // end of the day
            }
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'A camp with the same title and location already exists for this date.'
            });
        }

        const camp = await Camp.create({ title, location, date, organizer, description });
        res.status(201).json({ success: true, message: 'Camp created', data: camp });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET all upcoming camps (public or admin)
export const getAllCamps = async (req, res) => {
    try {
        const camps = await Camp.find().sort({ date: 1 });
        res.json({ success: true, data: camps });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET single camp
export const getCampById = async (req, res) => {
    try {
        const camp = await Camp.findById(req.params.id);
        if (!camp) return res.status(404).json({ message: 'Camp not found' });

        res.json({ success: true, data: camp });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE camp (admin only)
export const updateCamp = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Camp.findByIdAndUpdate(id, req.body, { new: true });

        if (!updated) return res.status(404).json({ message: 'Camp not found' });

        res.json({ success: true, message: 'Camp updated', data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE camp (admin only)
export const deleteCamp = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Camp.findByIdAndDelete(id);

        if (!deleted) return res.status(404).json({ message: 'Camp not found' });

        res.json({ success: true, message: 'Camp deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
