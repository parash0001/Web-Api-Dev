"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const CampComponent = () => {
    const [camps, setCamps] = useState([])
    const [filteredCamps, setFilteredCamps] = useState([])
    const [filters, setFilters] = useState({
        location: "",
        organizer: "",
        search: "",
        dateFrom: "",
        dateTo: "",
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [campsPerPage] = useState(6)

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedCamp, setSelectedCamp] = useState(null)

    // Loading states
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Toast state
    const [toast, setToast] = useState({ show: false, message: "", type: "success" })

    // Form states
    const [formData, setFormData] = useState({
        title: "",
        location: "",
        date: "",
        organizer: "",
        description: "",
    })
    const [formErrors, setFormErrors] = useState({})

    // Check if user is admin
    const [isAdmin, setIsAdmin] = useState(false)

    // Toast function
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type })
        setTimeout(() => {
            setToast({ show: false, message: "", type: "success" })
        }, 3000)
    }

    // Check user role
    useEffect(() => {
        // Always set admin to true for now
        setIsAdmin(true)
    }, [])

    // Add this after the role check useEffect
    useEffect(() => {
        console.log("Is Admin:", isAdmin)
        console.log("User Role:", localStorage.getItem("userRole"))
        console.log("Token:", localStorage.getItem("token"))
    }, [isAdmin])

    // Filter camps
    useEffect(() => {
        let filtered = camps

        if (filters.location) {
            filtered = filtered.filter((item) => item.location.toLowerCase().includes(filters.location.toLowerCase()))
        }
        if (filters.organizer) {
            filtered = filtered.filter((item) => item.organizer.toLowerCase().includes(filters.organizer.toLowerCase()))
        }
        if (filters.search) {
            filtered = filtered.filter(
                (item) =>
                    item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                    item.location.toLowerCase().includes(filters.search.toLowerCase()) ||
                    item.organizer.toLowerCase().includes(filters.search.toLowerCase()) ||
                    (item.description && item.description.toLowerCase().includes(filters.search.toLowerCase())),
            )
        }
        if (filters.dateFrom) {
            filtered = filtered.filter((item) => new Date(item.date) >= new Date(filters.dateFrom))
        }
        if (filters.dateTo) {
            filtered = filtered.filter((item) => new Date(item.date) <= new Date(filters.dateTo))
        }

        setFilteredCamps(filtered)
        setCurrentPage(1)
    }, [filters, camps])

    const handleFilterChange = (filterName, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterName]: value,
        }))
    }

    const resetForm = () => {
        setFormData({
            title: "",
            location: "",
            date: "",
            organizer: "",
            description: "",
        })
        setFormErrors({})
    }

    const validateForm = () => {
        const errors = {}
        if (!formData.title.trim()) {
            errors.title = "Title is required"
        }
        if (!formData.location.trim()) {
            errors.location = "Location is required"
        }
        if (!formData.date) {
            errors.date = "Date is required"
        }
        if (!formData.organizer.trim()) {
            errors.organizer = "Organizer is required"
        }
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleAddCamp = () => {
        resetForm()
        setFormData((prev) => ({
            ...prev,
            date: new Date().toISOString().split("T")[0],
        }))
        setShowAddModal(true)
    }

    const handleEdit = (camp) => {
        setSelectedCamp(camp)
        setFormData({
            title: camp.title,
            location: camp.location,
            date: new Date(camp.date).toISOString().split("T")[0],
            organizer: camp.organizer,
            description: camp.description || "",
        })
        setShowEditModal(true)
    }

    const handleDelete = (camp) => {
        setSelectedCamp(camp)
        setShowDeleteModal(true)
    }

    const handleView = (camp) => {
        setSelectedCamp(camp)
        setShowViewModal(true)
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsSubmitting(true)
        const token = localStorage.getItem("token") || sessionStorage.getItem("token")

        try {
            if (showAddModal) {
                const response = await axios.post(
                    "http://localhost:5000/api/camps",
                    {
                        title: formData.title,
                        location: formData.location,
                        date: new Date(formData.date),
                        organizer: formData.organizer,
                        description: formData.description,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )
                setCamps((prev) => [response.data.data, ...prev])
                setShowAddModal(false)
                resetForm()
                showToast("Camp added successfully!")
            } else if (showEditModal && selectedCamp) {
                const response = await axios.patch(
                    `http://localhost:5000/api/camps/${selectedCamp._id}`,
                    {
                        title: formData.title,
                        location: formData.location,
                        date: new Date(formData.date),
                        organizer: formData.organizer,
                        description: formData.description,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )
                setCamps((prev) => prev.map((item) => (item._id === selectedCamp._id ? response.data.data : item)))
                setShowEditModal(false)
                resetForm()
                showToast("Camp updated successfully!")
            }
        } catch (error) {
            console.error("Error saving camp:", error)
            showToast("An error occurred while saving camp", "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    const confirmDelete = async () => {
        if (!selectedCamp) return
        setIsSubmitting(true)
        const token = localStorage.getItem("token") || sessionStorage.getItem("token")

        try {
            await axios.delete(`http://localhost:5000/api/camps/${selectedCamp._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setCamps((prev) => prev.filter((item) => item._id !== selectedCamp._id))
            setShowDeleteModal(false)
            setSelectedCamp(null)
            showToast("Camp deleted successfully!")
        } catch (error) {
            console.error("Error deleting camp:", error)
            showToast("An error occurred while deleting camp", "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const isUpcoming = (date) => {
        return new Date(date) > new Date()
    }

    const isPast = (date) => {
        return new Date(date) < new Date()
    }

    const getCampStatusColor = (date) => {
        if (isUpcoming(date)) {
            return "bg-green-100 text-green-800"
        } else if (isPast(date)) {
            return "bg-gray-100 text-gray-800"
        } else {
            return "bg-blue-100 text-blue-800"
        }
    }

    const getCampStatus = (date) => {
        if (isUpcoming(date)) {
            return "Upcoming"
        } else if (isPast(date)) {
            return "Completed"
        } else {
            return "Today"
        }
    }

    // Get current camps for the page
    const indexOfLastCamp = currentPage * campsPerPage
    const indexOfFirstCamp = (currentPage - 1) * campsPerPage
    const currentCamps = filteredCamps.slice(indexOfFirstCamp, indexOfLastCamp)

    // Calculate total pages
    const totalPages = Math.ceil(filteredCamps.length / campsPerPage)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
    }

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }

    const fetchCamps = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get("http://localhost:5000/api/camps")
            setCamps(response.data.data || response.data)
        } catch (error) {
            console.error("Error fetching camps:", error)
            showToast("Error fetching camps", "error")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCamps()
    }, [])

    return (
        <>
            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-4 right-4 z-50">
                    <div
                        className={`px-6 py-4 rounded-lg shadow-lg ${toast.type === "success"
                            ? "bg-green-500 text-white"
                            : toast.type === "error"
                                ? "bg-red-500 text-white"
                                : "bg-blue-500 text-white"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {toast.type === "success" && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {toast.type === "error" && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            )}
                            <span>{toast.message}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full h-full bg-white p-10 m-5 rounded-lg">
                {/* Loading Overlay */}
                {isLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                                <span>Loading camps...</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Top Bar */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Blood Donation Camps</h1>

                    {/* Filters Row */}
                    <div className="flex flex-wrap gap-4 items-end">
                        {/* Search */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <div className="relative">
                                <svg
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange("search", e.target.value)}
                                    placeholder="Search by title, location, or organizer..."
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                            </div>
                        </div>

                        {/* Location Filter */}
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input
                                type="text"
                                value={filters.location}
                                onChange={(e) => handleFilterChange("location", e.target.value)}
                                placeholder="Filter by location..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>

                        {/* Organizer Filter */}
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Organizer</label>
                            <input
                                type="text"
                                value={filters.organizer}
                                onChange={(e) => handleFilterChange("organizer", e.target.value)}
                                placeholder="Filter by organizer..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>

                        {/* Date From */}
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                            <input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>

                        {/* Date To */}
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                            <input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>

                        {/* Add Camp Button - Only for Admins */}
                        <div className="flex-shrink-0">
                            <button
                                onClick={handleAddCamp}
                                disabled={isLoading}
                                className="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium rounded-md transition-colors duration-200 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Camp
                            </button>
                        </div>
                    </div>
                </div>

                {/* Camps Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {currentCamps.length > 0 ? (
                        currentCamps.map((camp) => (
                            <div
                                key={camp._id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{camp.title}</h3>
                                        <div className="flex gap-2 mb-3">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCampStatusColor(camp.date)}`}
                                            >
                                                {getCampStatus(camp.date)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="mb-4 p-3 bg-blue-50 rounded-md">
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <p className="text-sm font-medium text-blue-900">Camp Date</p>
                                    </div>
                                    <p className="text-sm font-semibold text-blue-800">{formatDate(camp.date)}</p>
                                </div>

                                {/* Location */}
                                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        <p className="text-sm font-medium text-gray-900">Location</p>
                                    </div>
                                    <p className="text-sm text-gray-600">{camp.location}</p>
                                </div>

                                {/* Organizer */}
                                <div className="mb-4 p-3 bg-green-50 rounded-md">
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                            />
                                        </svg>
                                        <p className="text-sm font-medium text-green-900">Organizer</p>
                                    </div>
                                    <p className="text-sm font-semibold text-green-800">{camp.organizer}</p>
                                </div>

                                {/* Description Preview */}
                                {camp.description && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 line-clamp-2">{camp.description}</p>
                                    </div>
                                )}

                                {/* Created Date */}
                                <div className="mb-4 text-xs text-gray-500">
                                    <p>Created: {formatDateTime(camp.createdAt)}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleView(camp)}
                                        disabled={isSubmitting}
                                        className="flex-1 text-green-600 hover:text-green-900 disabled:text-green-300 px-3 py-2 text-sm rounded border border-green-300 hover:bg-green-50 transition-colors duration-200 flex items-center justify-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                        View
                                    </button>

                                    {/* Show Edit and Delete buttons for all users temporarily, or based on proper admin check */}
                                    <button
                                        onClick={() => handleEdit(camp)}
                                        disabled={isSubmitting}
                                        className="flex-1 text-blue-600 hover:text-blue-900 disabled:text-blue-300 px-3 py-2 text-sm rounded border border-blue-300 hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(camp)}
                                        disabled={isSubmitting}
                                        className="flex-1 text-red-600 hover:text-red-900 disabled:text-red-300 px-3 py-2 text-sm rounded border border-red-300 hover:bg-red-50 transition-colors duration-200 flex items-center justify-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                            <h3 className="text-sm font-medium text-gray-900">No camps found</h3>
                            <p className="text-sm text-gray-500">No camps match the current filters.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                            Showing {indexOfFirstCamp + 1} to {Math.min(indexOfLastCamp, filteredCamps.length)} of{" "}
                            {filteredCamps.length} camps
                            {filteredCamps.length !== camps.length && ` (filtered from ${camps.length} total)`}
                        </div>
                    </div>
                </div>

                {/* Add/Edit Camp Modal */}
                {(showAddModal || showEditModal) && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">{showAddModal ? "Add New Camp" : "Edit Camp"}</h2>
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${formErrors.title ? "border-red-500" : "border-gray-300"
                                                }`}
                                            disabled={isSubmitting}
                                            placeholder="Enter camp title"
                                        />
                                        {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${formErrors.location ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                disabled={isSubmitting}
                                                placeholder="Camp location"
                                            />
                                            {formErrors.location && <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                                            <input
                                                type="date"
                                                required
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${formErrors.date ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                disabled={isSubmitting}
                                            />
                                            {formErrors.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Organizer *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.organizer}
                                            onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${formErrors.organizer ? "border-red-500" : "border-gray-300"
                                                }`}
                                            disabled={isSubmitting}
                                            placeholder="Organization or person organizing the camp"
                                        />
                                        {formErrors.organizer && <p className="text-red-500 text-xs mt-1">{formErrors.organizer}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            rows={4}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            disabled={isSubmitting}
                                            placeholder="Additional details about the camp (optional)..."
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting && (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            )}
                                            {isSubmitting ? "Saving..." : showAddModal ? "Add Camp" : "Update Camp"}
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

                {/* View Camp Modal */}
                {showViewModal && selectedCamp && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Camp Details</h2>
                                    <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Camp Title */}
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedCamp.title}</h3>
                                        <span
                                            className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getCampStatusColor(selectedCamp.date)}`}
                                        >
                                            {getCampStatus(selectedCamp.date)}
                                        </span>
                                    </div>

                                    {/* Camp Information */}
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="text-lg font-semibold text-blue-900 mb-3">Camp Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-blue-700">Date</p>
                                                <p className="text-blue-900 font-semibold">{formatDate(selectedCamp.date)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-blue-700">Organizer</p>
                                                <p className="text-blue-900">{selectedCamp.organizer}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className="text-sm font-medium text-blue-700">Location</p>
                                                <p className="text-blue-900">{selectedCamp.location}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {selectedCamp.description && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                                            <p className="text-gray-700 leading-relaxed">{selectedCamp.description}</p>
                                        </div>
                                    )}

                                    {/* Timeline */}
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <h4 className="text-lg font-semibold text-yellow-900 mb-3">Timeline</h4>
                                        <div>
                                            <p className="text-sm font-medium text-yellow-700">Created On</p>
                                            <p className="text-yellow-900">{formatDateTime(selectedCamp.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-6">
                                    {isAdmin && (
                                        <button
                                            onClick={() => {
                                                setShowViewModal(false)
                                                handleEdit(selectedCamp)
                                            }}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                                        >
                                            Edit Camp
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowViewModal(false)}
                                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors duration-200"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedCamp && (
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
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Camp</h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Are you sure you want to delete the camp <span className="font-medium">"{selectedCamp.title}"</span>{" "}
                                        organized by <span className="font-medium">{selectedCamp.organizer}</span>? This action cannot be
                                        undone.
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
                                            setSelectedCamp(null)
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

export default CampComponent
