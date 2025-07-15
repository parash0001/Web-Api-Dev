import User from '../model/user.js';
import Donation from '../model/donation.js';
import Appointment from '../model/appointment.js';
import BloodRequest from '../model/bloodRequest.js';
import Camp from '../model/camp.js';
import Feedback from '../model/feedback.js';

// Estimated unit cost per blood donation (for dashboard value display)
const UNIT_VALUE_NPR = 1200;

export const getDashboardStats = async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';
        const userId = req.user.id;

        if (isAdmin) {
            // ADMIN DASHBOARD
            const [
                totalUsers,
                totalDonors,
                totalAdmins,
                donations,
                appointments,
                camps,
                feedbacks,
                requestsByStatus,
                requestsByType,
                feedbackByStatus
            ] = await Promise.all([
                User.countDocuments(),
                User.countDocuments({ role: 'donor' }),
                User.countDocuments({ role: 'admin' }),
                Donation.find(),
                Appointment.find(),
                Camp.find(),
                Feedback.find(),
                BloodRequest.aggregate([
                    { $group: { _id: "$status", count: { $sum: 1 } } }
                ]),
                BloodRequest.aggregate([
                    { $group: { _id: "$bloodType", count: { $sum: 1 } } }
                ]),
                Feedback.aggregate([
                    { $group: { _id: "$status", count: { $sum: 1 } } }
                ])
            ]);

            const totalDonationUnits = donations.reduce((sum, d) => sum + d.units, 0);
            const avgUnitsPerUser = totalDonors ? (totalDonationUnits / totalDonors).toFixed(2) : 0;
            const upcomingAppointments = appointments.filter(a => new Date(a.appointmentDate) > new Date());
            const upcomingCamps = camps.filter(c => new Date(c.date) > new Date());
            const pastCamps = camps.filter(c => new Date(c.date) <= new Date());

            return res.json({
                success: true,
                dashboard: {
                    users: {
                        totalUsers,
                        totalDonors,
                        totalAdmins
                    },
                    donations: {
                        totalDonations: donations.length,
                        totalUnits: totalDonationUnits,
                        avgUnitsPerDonor: avgUnitsPerUser,
                        estimatedValueNPR: totalDonationUnits * UNIT_VALUE_NPR
                    },
                    appointments: {
                        totalAppointments: appointments.length,
                        upcoming: upcomingAppointments.length,
                        completed: appointments.length - upcomingAppointments.length
                    },
                    bloodInventory: groupByBloodType(donations),
                    camps: {
                        total: camps.length,
                        upcoming: upcomingCamps.length,
                        past: pastCamps.length
                    },
                    bloodRequests: {
                        byStatus: toKeyCountMap(requestsByStatus),
                        byBloodType: toKeyCountMap(requestsByType)
                    },
                    feedback: {
                        total: feedbacks.length,
                        byStatus: toKeyCountMap(feedbackByStatus)
                    }
                }
            });
        }

        // USER DASHBOARD
        const [myDonations, myAppointments, myRequests, myFeedback] = await Promise.all([
            Donation.find({ user: userId }),
            Appointment.find({ user: userId }).sort({ appointmentDate: -1 }),
            BloodRequest.find({ user: userId }),
            Feedback.findOne({ user: userId })
        ]);

        const totalUnits = myDonations.reduce((sum, d) => sum + d.units, 0);
        const upcomingAppointments = myAppointments.filter(a => new Date(a.appointmentDate) > new Date());
        const myRequestStats = {
            pending: myRequests.filter(r => r.status === 'pending').length,
            approved: myRequests.filter(r => r.status === 'approved').length,
            rejected: myRequests.filter(r => r.status === 'rejected').length
        };

        return res.json({
            success: true,
            dashboard: {
                donations: {
                    count: myDonations.length,
                    totalUnits,
                    lastDonation: myDonations[0]?.donatedAt || null
                },
                appointments: {
                    count: myAppointments.length,
                    upcoming: upcomingAppointments,
                    next: upcomingAppointments[0] || null
                },
                requests: {
                    count: myRequests.length,
                    byStatus: myRequestStats
                },
                feedback: {
                    submitted: !!myFeedback,
                    id: myFeedback?._id || null
                }
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Helpers
const toKeyCountMap = (arr) => {
    return arr.reduce((map, item) => {
        map[item._id] = item.count;
        return map;
    }, {});
};

const groupByBloodType = (donations) => {
    const result = {};
    for (const d of donations) {
        result[d.bloodType] = (result[d.bloodType] || 0) + d.units;
    }
    return result;
};
