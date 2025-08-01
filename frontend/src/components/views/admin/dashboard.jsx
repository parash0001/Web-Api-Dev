"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const DashboardComponent = () => {
	const [dashboardData, setDashboardData] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)

	// Mock API endpoint for dashboard data
	const DASHBOARD_API_URL = "http://localhost:5000/api/dashboard" // Replace with your actual API endpoint

	const fetchDashboardData = async () => {
		setIsLoading(true)
		setError(null)
		try {
			const token = localStorage.getItem("token") || sessionStorage.getItem("token")
			const response = await axios.get(DASHBOARD_API_URL, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (response.data.success) {
				setDashboardData(response.data.dashboard)
			} else {
				setError("Failed to fetch dashboard data.")
			}
		} catch (err) {
			console.error("Error fetching dashboard data:", err)
			setError("An error occurred while fetching dashboard data.")
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchDashboardData()
	}, [])

	const renderStatCard = (title, value, icon) => (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center gap-4">
			<div className="p-3 bg-red-100 rounded-full text-red-600">{icon}</div>
			<div>
				<p className="text-sm font-medium text-gray-500">{title}</p>
				<p className="text-2xl font-bold text-gray-900">{value}</p>
			</div>
		</div>
	)

	const renderListCard = (title, data, icon) => (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<div className="flex items-center gap-3 mb-4">
				<div className="p-2 bg-blue-100 rounded-full text-blue-600">{icon}</div>
				<h3 className="text-lg font-semibold text-gray-900">{title}</h3>
			</div>
			<div className="space-y-2">
				{Object.entries(data).length > 0 ? (
					Object.entries(data).map(([key, value]) => (
						<div key={key} className="flex justify-between items-center text-sm text-gray-700">
							<span className="font-medium">
								{key
									.replace(/([A-Z])/g, " $1")
									.trim()
									.replace(/^./, (str) => str.toUpperCase())}
								:
							</span>
							<span>{value}</span>
						</div>
					))
				) : (
					<p className="text-sm text-gray-500">No data available.</p>
				)}
			</div>
		</div>
	)

	if (isLoading) {
		return (
			<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
				<div className="bg-white p-6 rounded-lg shadow-lg">
					<div className="flex items-center gap-3">
						<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
						<span>Loading dashboard data...</span>
					</div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="w-full h-full bg-white p-10 m-5 rounded-lg flex items-center justify-center">
				<div className="text-center text-red-600">
					<svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<p className="mt-2 text-lg font-medium">{error}</p>
					<button
						onClick={fetchDashboardData}
						className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
					>
						Retry
					</button>
				</div>
			</div>
		)
	}

	if (!dashboardData) {
		return (
			<div className="w-full h-full bg-white p-10 m-5 rounded-lg flex items-center justify-center">
				<div className="text-center text-gray-500">
					<svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<p className="mt-2 text-lg font-medium">No dashboard data available.</p>
				</div>
			</div>
		)
	}

	return (
		<div className="w-full h-full bg-gray-50 p-10 m-5 rounded-lg">
			<h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

			{/* Users Section */}
			<section className="mb-8">
				<h2 className="text-2xl font-semibold text-gray-800 mb-4">Users</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{renderStatCard(
						"Total Users",
						dashboardData.users.totalUsers,
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 4.354a4 4 0 110 5.292M12 20.005v-2.354a4 4 0 00-4-4H4a4 4 0 01-4-4V4a4 4 0 014-4h4a4 4 0 014 4v2.354a4 4 0 004 4h4a4 4 0 014 4v4a4 4 0 01-4 4h-4a4 4 0 01-4-4z"
							/>
						</svg>,
					)}
					{renderStatCard(
						"Total Donors",
						dashboardData.users.totalDonors,
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>,
					)}
					{renderStatCard(
						"Total Admins",
						dashboardData.users.totalAdmins,
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.944 12c0 2.892 1.19 5.51 3.04 7.418A12.001 12.001 0 0012 21.056c2.892 0 5.51-1.19 7.418-3.04A12.001 12.001 0 0021.056 12c0-2.892-1.19-5.51-3.04-7.418z"
							/>
						</svg>,
					)}
				</div>
			</section>

			{/* Donations Section */}
			<section className="mb-8">
				<h2 className="text-2xl font-semibold text-gray-800 mb-4">Donations</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{renderStatCard(
						"Total Donations",
						dashboardData.donations.totalDonations,
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
							/>
						</svg>,
					)}
					{renderStatCard(
						"Total Units Donated",
						dashboardData.donations.totalUnits,
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>,
					)}
					{renderStatCard(
						"Avg. Units/Donor",
						dashboardData.donations.avgUnitsPerDonor,
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
							/>
						</svg>,
					)}
					{renderStatCard(
						"Estimated Value (NPR)",
						dashboardData.donations.estimatedValueNPR,
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>,
					)}
				</div>
			</section>

			{/* Appointments Section */}
			<section className="mb-8">
				<h2 className="text-2xl font-semibold text-gray-800 mb-4">Appointments</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{renderStatCard(
						"Total Appointments",
						dashboardData.appointments.totalAppointments,
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>,
					)}
					{renderStatCard(
						"Upcoming Appointments",
						dashboardData.appointments.upcoming,
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
							/>
						</svg>,
					)}
					{renderStatCard(
						"Completed Appointments",
						dashboardData.appointments.completed,
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
						</svg>,
					)}
				</div>
			</section>

			{/* Blood Inventory Section */}
			<section className="mb-8">
				<h2 className="text-2xl font-semibold text-gray-800 mb-4">Blood Inventory</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{renderListCard(
						"Available Units by Blood Type",
						dashboardData.bloodInventory,
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
							/>
						</svg>,
					)}
				</div>
			</section>

			{/* Camps Section */}
			<section className="mb-8">
				<h2 className="text-2xl font-semibold text-gray-800 mb-4">Camps</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{renderStatCard(
						"Total Camps",
						dashboardData.camps.total,
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							/>
						</svg>,
					)}
					{renderStatCard(
						"Upcoming Camps",
						dashboardData.camps.upcoming,
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>,
					)}
					{renderStatCard(
						"Past Camps",
						dashboardData.camps.past,
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2A9 9 0 1112 1a9 9 0 017 7z"
							/>
						</svg>,
					)}
				</div>
			</section>

			{/* Blood Requests Section */}
			<section className="mb-8">
				<h2 className="text-2xl font-semibold text-gray-800 mb-4">Blood Requests</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{renderListCard(
						"Requests by Status",
						dashboardData.bloodRequests.byStatus,
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>,
					)}
					{renderListCard(
						"Requests by Blood Type",
						dashboardData.bloodRequests.byBloodType,
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
							/>
						</svg>,
					)}
				</div>
			</section>

			{/* Feedback Section */}
			<section>
				<h2 className="text-2xl font-semibold text-gray-800 mb-4">Feedback</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{renderStatCard(
						"Total Feedback",
						dashboardData.feedback.total,
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
							/>
						</svg>,
					)}
					{renderListCard(
						"Feedback by Status",
						dashboardData.feedback.byStatus,
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>,
					)}
				</div>
			</section>
		</div>
	)
}

export default DashboardComponent
