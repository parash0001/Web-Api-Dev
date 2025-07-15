import Appointment from '../model/appointment.js';

// CREATE (supports admin or user)
export const createAppointment = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phoneNumber,
            bloodType,
            appointmentDate,
            location,
            userId // optional, from admin side
        } = req.body;

        const user = userId || req.user?.id || null;
        const isAdmin = req.user?.role === 'admin';

        if (!fullName || !email || !phoneNumber || !bloodType || !appointmentDate || !location) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Admin-only validation
        if (userId && !isAdmin) {
            return res.status(403).json({ message: 'Only admin can assign userId' });
        }

        const existing = await Appointment.findOne({
            $or: [
                { user: user },
                { email, phoneNumber }
            ],
            appointmentDate: { $gte: new Date() } // future appointment
        });

        if (existing) {
            return res.status(409).json({
                message: 'An active or upcoming appointment already exists for this user/email/phone.'
            });
        }

        const appointment = await Appointment.create({
            user,
            fullName,
            email,
            phoneNumber,
            bloodType,
            appointmentDate,
            location
        });

        res.status(201).json({ success: true, message: 'Appointment created', data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// READ - user's own
export const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ user: req.user.id }).sort({ appointmentDate: -1 });
        res.json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// READ - all (admin view grouped)
export const getAllAppointments = async (req, res) => {
    try {
        const grouped = await Appointment.aggregate([
            {
                $group: {
                    _id: '$email',
                    donor: {
                        $first: {
                            fullName: '$fullName',
                            email: '$email',
                            phoneNumber: '$phoneNumber'
                        }
                    },
                    appointments: {
                        $push: {
                            _id: '$_id',
                            bloodType: '$bloodType',
                            location: '$location',
                            appointmentDate: '$appointmentDate',
                            status: '$status',
                            createdAt: '$createdAt'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    donor: 1,
                    appointments: 1
                }
            }
        ]);

        res.json({ success: true, data: grouped });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE (own)
export const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const isAdmin = req.user.role === 'admin';

        const updated = await Appointment.findOneAndUpdate(
            isAdmin ? { _id: id } : { _id: id, user: req.user.id },
            req.body,
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: 'Appointment not found or not allowed' });

        res.json({ success: true, message: 'Appointment updated', data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE
export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const isAdmin = req.user.role === 'admin';

        const deleted = await Appointment.findOneAndDelete(
            isAdmin ? { _id: id } : { _id: id, user: req.user.id }
        );

        if (!deleted) return res.status(404).json({ message: 'Appointment not found or not allowed' });

        res.json({ success: true, message: 'Appointment deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
