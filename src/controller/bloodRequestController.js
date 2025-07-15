import BloodRequest from '../model/bloodRequest.js';

// Create
export const createBloodRequest = async (req, res) => {
    try {
        const { bloodType, quantity, urgency, location, issueDescription, phoneNumber } = req.body;

        const request = await BloodRequest.create({
            user: req.user.id,
            bloodType,
            quantity,
            urgency,
            location,
            phoneNumber,
            issueDescription
        });

        res.status(201).json({ success: true, message: 'Request submitted', data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Read - get own requests
export const getMyRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Read - all requests (admin)
export const getAllRequests = async (req, res) => {
    try {
        const grouped = await BloodRequest.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$user._id',
                    user: { $first: '$user' },
                    requests: {
                        $push: {
                            _id: '$_id',
                            bloodType: '$bloodType',
                            quantity: '$quantity',
                            urgency: '$urgency',
                            location: '$location',
                            phoneNumber: '$phoneNumber',
                            issueDescription: '$issueDescription',
                            status: '$status',
                            createdAt: '$createdAt'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    user: {
                        _id: '$user._id',
                        firstName: '$user.firstName',
                        lastName: '$user.lastName',
                        email: '$user.email'
                    },
                    requests: 1
                }
            },
            {
                $sort: {
                    'user.firstName': 1
                }
            }
        ]);

        res.json({ success: true, data: grouped });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update - status (admin)
export const updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const updated = await BloodRequest.findByIdAndUpdate(id, { status }, { new: true });
        if (!updated) return res.status(404).json({ message: 'Request not found' });

        res.json({ success: true, message: 'Status updated', data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update - full request (user or admin)
export const updateBloodRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updated = await BloodRequest.findOneAndUpdate(
            { _id: id, user: req.user.id }, // user can only update their own
            updatedData,
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: 'Request not found or not yours' });

        res.json({ success: true, message: 'Request updated', data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete
export const deleteBloodRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await BloodRequest.findOneAndDelete({ _id: id, user: req.user.id });

        if (!deleted) return res.status(404).json({ message: 'Request not found or not yours' });

        res.json({ success: true, message: 'Request deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
