import Donation from '../model/donation.js';

export const createDonation = async (req, res) => {
    try {
        const { bloodType, units, location, userId } = req.body;

        // If userId is provided AND the current user is admin → allow it
        const isAdmin = req.user.role === 'admin';
        const donationUserId = userId && isAdmin ? userId : req.user.id;

        const donation = await Donation.create({
            user: donationUserId,
            bloodType,
            units,
            location,
        });

        res.status(201).json({
            success: true,
            message: `Donation recorded${userId && isAdmin ? ' on behalf of user' : ''}`,
            data: donation,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ user: req.user.id }).sort({ donatedAt: -1 });
        res.json({ success: true, data: donations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllDonations = async (req, res) => {
    try {
        const groupedDonations = await Donation.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $group: {
                    _id: '$user._id',
                    user: { $first: '$user' },
                    donations: {
                        $push: {
                            _id: '$_id',
                            bloodType: '$bloodType',
                            units: '$units',
                            location: '$location',
                            donatedAt: '$donatedAt'
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
                    donations: 1
                }
            }
        ]);

        res.json({ success: true, data: groupedDonations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteDonation = async (req, res) => {
    try {
        const { id } = req.params;
        await Donation.findByIdAndDelete(id);
        res.json({ success: true, message: 'Donation record deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
