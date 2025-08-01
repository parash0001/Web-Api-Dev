import { Routes, Route } from "react-router-dom"

// Public Pages
import HomePage from "./components/pages/home/home-page"
import DonateBloodPage from "./components/pages/donate-blood/donate-blood-page"
import HostBloodDrivePage from "./components/pages/host-blood-drive/host-blood-drive"
import NeedBloodPage from "./components/pages/need-blood/need-blood-page"
import ContactPage from "./components/pages/contact/contact-page"
import LoginPage from "./components/pages/login/login"
import RegisterPage from "./components/pages/signup/register"
import { ModernForgotPasswordFlow } from "./components/pages/login/reset/resetPasswordFlow"

// Auth Wrapper
import ProtectedRoute from "./components/ProtectedRoute"

// Admin Layout & Pages
import Admin from "./components/layouts/admin"
import Dashboard from "./components/views/admin/dashboard"
import AdminDonateBlood from "./components/views/admin/admin-donate-blood"
import AdminNeedBlood from "./components/views/admin/admin-need-blood"
import AdminHostBloodDrive from "./components/views/admin/admin-host-blood-drive"
import AdminNeedHelp from "./components/views/admin/admin-need-help"
import UserManagement from "./components/views/admin/user-management"
import IssuesFeedback from "./components/views/admin/IssuesFeedback"
import Feedback from "./components/views/admin/feedback"
import FeedbackComponent from "./components/views/admin/feedback"
import DonationComponent from "./components/views/admin/admin-donate-blood"
import BloodRequestComponent from "./components/views/admin/admin-donate-blood"
import CampComponent from "./components/views/admin/admin-camp-component"

// Donor Layout & Pages
// import DonorLayout from "./components/layouts/DonorLayout"
// import DonorDashboard from "./components/views/donor/dashboard"
// import DonorDonateBlood from "./components/views/donor/donate-blood"
// import DonorNeedBlood from "./components/views/donor/need-blood"
// import DonorIssues from "./components/views/donor/issues"
// import DonorFeedback from "./components/views/donor/feedback"

export default function App() {
	return (
		<Routes>
			{/* Public Routes */}
			<Route path="/" element={<HomePage />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />
			<Route path="/forgot-password" element={<ModernForgotPasswordFlow />} />
			<Route path="/donate-blood" element={<DonateBloodPage />} />
			<Route path="/host-blood-drive" element={<HostBloodDrivePage />} />
			<Route path="/need-blood" element={<NeedBloodPage />} />
			<Route path="/contact" element={<ContactPage />} />

			{/* Admin Protected Routes */}
			<Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
				<Route path="/admin" element={<Admin />}>
					<Route index element={<Dashboard />} />
					<Route path="donate-blood" element={<DonationComponent />} />
					<Route path="camp" element={<CampComponent />} />
					<Route path="need-blood" element={<BloodRequestComponent />} />
					<Route path="host-blood-drive" element={<AdminHostBloodDrive />} />
					<Route path="need-help" element={<AdminNeedHelp />} />
					<Route path="user-management" element={<UserManagement />} />
					<Route path="issues" element={<IssuesFeedback />} />
					<Route path="feedback" element={<FeedbackComponent />} />
				</Route>
			</Route>

			<Route element={<ProtectedRoute allowedRoles={["donor"]} />}>
				<Route path="/user" element={<Admin />}>
					<Route index element={<Dashboard />} />
					<Route path="donate-blood" element={<DonationComponent />} />
					<Route path="camp" element={<CampComponent />} />
					<Route path="need-blood" element={<BloodRequestComponent />} />
					<Route path="host-blood-drive" element={<AdminHostBloodDrive />} />
					<Route path="need-help" element={<AdminNeedHelp />} />
					<Route path="user-management" element={<UserManagement />} />
					<Route path="issues" element={<IssuesFeedback />} />
					<Route path="feedback" element={<FeedbackComponent />} />
				</Route>
			</Route>

			{/* Donor Protected Routes */}
			{/* <Route element={<ProtectedRoute allowedRoles={["donor"]} />}>
				<Route path="/donor" element={<DonorLayout />}>
					<Route index element={<DonorDashboard />} />
					<Route path="donate-blood" element={<DonorDonateBlood />} />
					<Route path="need-blood" element={<DonorNeedBlood />} />
					<Route path="issues" element={<DonorIssues />} />
					<Route path="feedback" element={<DonorFeedback />} />
				</Route>
			</Route> */}
		</Routes>
	)
}
