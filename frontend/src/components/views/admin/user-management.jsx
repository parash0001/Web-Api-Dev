"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {toast , Toaster} from "react-hot-toast"

const UserManagement = () => {
    // Extended sample user data for better filter testing
    const [users, setUsers] = useState([
        {
            _id: "1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "+1234567890",
            age: 28,
            bloodType: "A+",
            role: "Donor",
            createdAt: "2024-01-15T10:30:00Z",
        },
        {
            _id: "2",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            phone: "+1234567891",
            age: 32,
            bloodType: "O-",
            role: "Admin",
            createdAt: "2024-01-20T14:45:00Z",
        },
        {
            _id: "3",
            firstName: "Mike",
            lastName: "Johnson",
            email: "mike.johnson@example.com",
            phone: "+1234567892",
            age: 25,
            bloodType: "B+",
            role: "User",
            createdAt: "2024-02-01T09:15:00Z",
        },
        {
            _id: "4",
            firstName: "Sarah",
            lastName: "Wilson",
            email: "sarah.wilson@example.com",
            phone: "+1234567893",
            age: 29,
            bloodType: "AB+",
            role: "Recipient",
            createdAt: "2024-02-10T16:20:00Z",
        },
        {
            _id: "5",
            firstName: "David",
            lastName: "Brown",
            email: "david.brown@example.com",
            phone: "+1234567894",
            age: 35,
            bloodType: "A-",
            role: "Donor",
            createdAt: "2024-02-15T11:30:00Z",
        },
        {
            _id: "6",
            firstName: "Emily",
            lastName: "Davis",
            email: "emily.davis@example.com",
            phone: "+1234567895",
            age: 27,
            bloodType: "O+",
            role: "User",
            createdAt: "2024-02-20T13:45:00Z",
        },
        {
            _id: "7",
            firstName: "Robert",
            lastName: "Miller",
            email: "robert.miller@example.com",
            phone: "+1234567896",
            age: 31,
            bloodType: "B-",
            role: "Donor",
            createdAt: "2024-02-25T15:20:00Z",
        },
        {
            _id: "8",
            firstName: "Lisa",
            lastName: "Garcia",
            email: "lisa.garcia@example.com",
            phone: "+1234567897",
            age: 26,
            bloodType: "AB-",
            role: "Recipient",
            createdAt: "2024-03-01T09:10:00Z",
        },
        {
            _id: "9",
            firstName: "James",
            lastName: "Martinez",
            email: "james.martinez@example.com",
            phone: "+1234567898",
            age: 33,
            bloodType: "A+",
            role: "Admin",
            createdAt: "2024-03-05T14:25:00Z",
        },
        {
            _id: "10",
            firstName: "Maria",
            lastName: "Rodriguez",
            email: "maria.rodriguez@example.com",
            phone: "+1234567899",
            age: 24,
            bloodType: "O-",
            role: "User",
            createdAt: "2024-03-10T16:40:00Z",
        },
        {
            _id: "11",
            firstName: "William",
            lastName: "Anderson",
            email: "william.anderson@example.com",
            phone: "+1234567800",
            age: 30,
            bloodType: "B+",
            role: "Donor",
            createdAt: "2024-03-15T12:15:00Z",
        },
        {
            _id: "12",
            firstName: "Jennifer",
            lastName: "Taylor",
            email: "jennifer.taylor@example.com",
            phone: "+1234567801",
            age: 28,
            bloodType: "AB+",
            role: "Recipient",
            createdAt: "2024-03-20T10:50:00Z",
        },
    ])

    const [filteredUsers, setFilteredUsers] = useState(users)
    const [filters, setFilters] = useState({
        bloodType: "",
        role: "",
        userName: "",
        email: "",
    })

    const [currentPage, setCurrentPage] = useState(1)
    const [usersPerPage] = useState(10)

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

    // Loading states
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        age: "",
        bloodType: "",
        role: "",
        password: "",
    })

    const [formErrors, setFormErrors] = useState({})

    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    const roles = ["Admin", "User", "Donor", "Recipient"]

    // API Base URL - Update this to match your backend
    const API_BASE_URL = "http://localhost:5000/api" // Change this to your API URL

    // Axios configuration
    const axiosConfig = {
        headers: {
            "Content-Type": "application/json",
            
        },
    }

    // Filter users properly
    useEffect(() => {
        let filtered = users

        if (filters.bloodType) {
            filtered = filtered.filter((user) => user.bloodType === filters.bloodType)
        }

        if (filters.role) {
            filtered = filtered.filter((user) => user.role === filters.role)
        }

        if (filters.userName) {
            filtered = filtered.filter((user) =>
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(filters.userName.toLowerCase()),
            )
        }

        if (filters.email) {
            filtered = filtered.filter((user) => user.email.toLowerCase().includes(filters.email.toLowerCase()))
        }

        setFilteredUsers(filtered)
        setCurrentPage(1) // Reset to first page when filters change
    }, [filters, users])

    // Fetch users from API
    const fetchUsers = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get(`${API_BASE_URL}/users`, axiosConfig)
            setUsers(response.data)
        } catch (error) {
            console.error("Error fetching users:", error)
          toast("Error Fetching Users")
        } finally {
            setIsLoading(false)
        }
    }

    // Load users on component mount
    useEffect(() => {

        fetchUsers()
    }, [])

    const handleFilterChange = (filterName, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterName]: value,
        }))
    }

    const resetForm = () => {
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            age: "",
            bloodType: "",
            role: "",
            password: "",
        })
        setFormErrors({})
    }

    const validateForm = () => {
        const errors = {}

        if (!formData.firstName.trim()) {
            errors.firstName = "First name is required"
        }

        if (!formData.lastName.trim()) {
            errors.lastName = "Last name is required"
        }

        if (!formData.email.trim()) {
            errors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email is invalid"
        }

        if (showAddModal && !formData.password.trim()) {
            errors.password = "Password is required"
        }

        if (formData.age && (formData.age < 1 || formData.age > 120)) {
            errors.age = "Age must be between 1 and 120"
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleAddUser = () => {
        resetForm()
        setShowAddModal(true)
    }

    const handleEdit = (user) => {
        setSelectedUser(user)
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || "",
            age: user.age || "",
            bloodType: user.bloodType,
            role: user.role,
            password: "", // Don't pre-fill password
        })
        setShowEditModal(true)
    }

    const handleDelete = (user) => {
        setSelectedUser(user)
        setShowDeleteModal(true)
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            if (showAddModal) {
                // Add new user via API
                const userData = {
                    ...formData,
                    age: formData.age ? Number.parseInt(formData.age) : null,
                }

                const response = await axios.post(`${API_BASE_URL}/users`, userData, axiosConfig)

                // Add the new user to local state
                setUsers((prev) => [...prev, response.data])
                setShowAddModal(false)
                resetForm()
                toast.success("User added successfully!")
            } else if (showEditModal) {
                // Update user via API
                const userData = {
                    ...formData,
                    age: formData.age ? Number.parseInt(formData.age) : null,
                }

                // Remove password from update data if it's empty
                if (!userData.password) {
                    delete userData.password
                }

                const response = await axios.put(`${API_BASE_URL}/users/${selectedUser._id}`, userData, axiosConfig)

                // Update the user in local state
                setUsers((prev) => prev.map((user) => (user._id === selectedUser._id ? response.data : user)))
                setShowEditModal(false)
                resetForm()
                toast.success("User updated successfully!")
            }
        } catch (error) {
            console.error("Error saving user:", error)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred"
            toast.error("Error saving user: " + errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    const confirmDelete = async () => {
        setIsSubmitting(true)

        try {
            // Delete user via API
            await axios.delete(`${API_BASE_URL}/users/${selectedUser._id}`, axiosConfig)

            // Remove user from local state
            setUsers((prev) => prev.filter((user) => user._id !== selectedUser._id))
            setShowDeleteModal(false)
            setSelectedUser(null)
            toast.success("User deleted successfully!")
        } catch (error) {
            console.error("Error deleting user:", error)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred"
            toast.error("Error deleting user: " + errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    // Get current users for the page
    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

    // Calculate total pages
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
    }

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }

    return (

        <>
<Toaster position="top-right" />
        <div className="w-full h-full bg-white p-10 m-10 rounded-rsm">

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                            <span>Loading users...</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>

                {/* Filters Row */}
                <div className="flex flex-wrap gap-4 items-end">
                    {/* Blood Type Filter */}
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                        <select
                            value={filters.bloodType}
                            onChange={(e) => handleFilterChange("bloodType", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="">All Blood Types</option>
                            {bloodTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Role Filter */}
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select
                            value={filters.role}
                            onChange={(e) => handleFilterChange("role", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="">All Roles</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* User Name Filter */}
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">User Name</label>
                        <input
                            type="text"
                            value={filters.userName}
                            onChange={(e) => handleFilterChange("userName", e.target.value)}
                            placeholder="Search by name..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    {/* Email Filter */}
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="text"
                            value={filters.email}
                            onChange={(e) => handleFilterChange("email", e.target.value)}
                            placeholder="Search by email..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    {/* Add User Button */}
                    <div className="flex-shrink-0">
                        <button
                            onClick={handleAddUser}
                            disabled={isLoading}
                            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium rounded-md transition-colors duration-200 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add User
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phone
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Blood Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentUsers.length > 0 ? (
                                currentUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.firstName} {user.lastName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.phone || "N/A"}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.age || "N/A"}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                {user.bloodType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(user.createdAt)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    disabled={isSubmitting}
                                                    className="text-blue-600 hover:text-blue-900 disabled:text-blue-300 px-3 py-1 rounded border border-blue-300 hover:bg-blue-50 transition-colors duration-200"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user)}
                                                    disabled={isSubmitting}
                                                    className="text-red-600 hover:text-red-900 disabled:text-red-300 px-3 py-1 rounded border border-red-300 hover:bg-red-50 transition-colors duration-200"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                        No users found matching the current filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination and Results Summary */}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === pageNumber
                                    ? "bg-red-600 text-white"
                                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                {pageNumber}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>

                {/* Results Summary */}
                <div className="text-sm text-gray-600">
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}{" "}
                    users
                    {filteredUsers.length !== users.length && ` (filtered from ${users.length} total)`}
                </div>
            </div>

            {/* Add/Edit User Modal */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">{showAddModal ? "Add New User" : "Edit User"}</h2>
                                <button
                                    onClick={() => {
                                        setShowAddModal(false)
                                        setShowEditModal(false)
                                        resetForm()
                                    }}
                                    disabled={isSubmitting}
                                    className="text-gray-400 hover:text-gray-600 disabled:text-gray-300"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${formErrors.firstName ? "border-red-500" : "border-gray-300"
                                                }`}
                                            disabled={isSubmitting}
                                        />
                                        {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${formErrors.lastName ? "border-red-500" : "border-gray-300"
                                                }`}
                                            disabled={isSubmitting}
                                        />
                                        {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${formErrors.email ? "border-red-500" : "border-gray-300"
                                            }`}
                                        disabled={isSubmitting}
                                    />
                                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                                </div>

                                {showAddModal && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${formErrors.password ? "border-red-500" : "border-gray-300"
                                                }`}
                                            disabled={isSubmitting}
                                        />
                                        {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="120"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${formErrors.age ? "border-red-500" : "border-gray-300"
                                                }`}
                                            disabled={isSubmitting}
                                        />
                                        {formErrors.age && <p className="text-red-500 text-xs mt-1">{formErrors.age}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                                        <select
                                            value={formData.bloodType}
                                            onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Select Blood Type</option>
                                            {bloodTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        disabled={isSubmitting}
                                    >
                                        <option value="">Select Role</option>
                                        {roles.map((role) => (
                                            <option key={role} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                        {isSubmitting ? "Saving..." : showAddModal ? "Add User" : "Update User"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddModal(false)
                                            setShowEditModal(false)
                                            resetForm()
                                        }}
                                        disabled={isSubmitting}
                                        className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete User</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Are you sure you want to delete{" "}
                                    <span className="font-medium">
                                        {selectedUser.firstName} {selectedUser.lastName}
                                    </span>
                                    ? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={confirmDelete}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                    {isSubmitting ? "Deleting..." : "Delete"}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false)
                                        setSelectedUser(null)
                                    }}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
    )
}

export default UserManagement
