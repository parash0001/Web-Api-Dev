"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const FeedbackComponent = () => {
  const [feedback, setFeedback] = useState([])
  const [filteredFeedback, setFilteredFeedback] = useState([])
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    search: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [feedbackPerPage] = useState(6)

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState(null)

  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })

  // Form states
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    type: "",
    status: "",
    user: "",
    responses: [],
    newResponse: "",
  })
  const [formErrors, setFormErrors] = useState({})

  const feedbackTypes = ["suggestion", "complaint", "idea"]
  const statuses = ["pending", "reviewed", "resolved"]

  // Toast function
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" })
    }, 3000)
  }

  // Filter feedback
  useEffect(() => {
    let filtered = feedback
    if (filters.status) {
      filtered = filtered.filter((item) => item.status === filters.status)
    }
    if (filters.type) {
      filtered = filtered.filter((item) => item.type === filters.type)
    }
    if (filters.search) {
      filtered = filtered.filter(
        (item) =>
          item.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.message.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }
    setFilteredFeedback(filtered)
    setCurrentPage(1)
  }, [filters, feedback])

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      subject: "",
      message: "",
      type: "",
      status: "",
      user: "",
      responses: [],
      newResponse: "",
    })
    setFormErrors({})
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.subject.trim()) {
      errors.subject = "Subject is required"
    }
    if (!formData.message.trim()) {
      errors.message = "Message is required"
    }
    if (!formData.type) {
      errors.type = "Type is required"
    }
    if (!formData.status) {
      errors.status = "Status is required"
    }
    if (showAddModal && !formData.user.trim()) {
      errors.user = "User ID is required"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddFeedback = () => {
    resetForm()
    setFormData((prev) => ({ ...prev, status: "pending", type: "suggestion" }))
    setShowAddModal(true)
  }

  const handleEdit = (feedbackItem) => {
    setSelectedFeedback(feedbackItem)
    setFormData({
      subject: feedbackItem.subject,
      message: feedbackItem.message,
      type: feedbackItem.type,
      status: feedbackItem.status,
      user: feedbackItem.user._id,
      responses: feedbackItem.responses || [],
      newResponse: "",
    })
    setShowEditModal(true)
  }

  const handleDelete = (feedbackItem) => {
    setSelectedFeedback(feedbackItem)
    setShowDeleteModal(true)
  }

  const handleResponse = (feedbackItem) => {
    setSelectedFeedback(feedbackItem)
    setFormData({
      ...feedbackItem,
      newResponse: "",
      responses: feedbackItem.responses || [],
      user: feedbackItem.user._id,
    })
    setShowResponseModal(true)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    try {
      if (showAddModal) {
        const response = await axios.post(
          "http://localhost:5000/api/feedbacks",
          {
            subject: formData.subject,
            message: formData.message,
            type: formData.type,
            status: formData.status,
            user: formData.user,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setFeedback((prev) => [response.data.data, ...prev])
        setShowAddModal(false)
        resetForm()
        showToast("Feedback added successfully!")
      } else if (showEditModal && selectedFeedback) {
        const response = await axios.patch(
          `http://localhost:5000/api/feedbacks/${selectedFeedback._id}/status`,
          {
            subject: formData.subject,
            message: formData.message,
            type: formData.type,
            status: formData.status,
          },
          {
            headers: {
            Authorization: `Bearer ${token}`,
            },
          }
        )

        setFeedback((prev) =>
          prev.map((item) => (item._id === selectedFeedback._id ? response.data.data : item))
        )
        setShowEditModal(false)
        resetForm()
        showToast("Feedback updated successfully!")
      }
    } catch (error) {
      console.error("Error saving feedback:", error)
      showToast("An error occurred while saving feedback", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResponseSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFeedback) return

    setIsSubmitting(true)
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    try {
      const response = await axios.post(
        `http://localhost:5000/api/feedbacks/${selectedFeedback._id}/response`,
        {
          message: formData.newResponse,
          by: "admin@gmail.com",
          statusChange: formData.status !== selectedFeedback.status ? formData.status : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setFeedback((prev) =>
        prev.map((item) => (item._id === selectedFeedback._id ? response.data.data : item))
      )
      setShowResponseModal(false)
      resetForm()
      showToast("Response added successfully!")
    } catch (error) {
      console.error("Error adding response:", error)
      showToast("An error occurred while adding response", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedFeedback) return

    setIsSubmitting(true)
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    try {
      await axios.delete(`http://localhost:5000/api/feedbacks/${selectedFeedback._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setFeedback((prev) => prev.filter((item) => item._id !== selectedFeedback._id))
      setShowDeleteModal(false)
      setSelectedFeedback(null)
      showToast("Feedback deleted successfully!")
    } catch (error) {
      console.error("Error deleting feedback:", error)
      showToast("An error occurred while deleting feedback", "error")
    } finally {
      setIsSubmitting(false)
    }
  }
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "suggestion":
        return "bg-blue-100 text-blue-800"
      case "complaint":
        return "bg-red-100 text-red-800"
      case "idea":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewed":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get current feedback for the page
  const indexOfLastFeedback = currentPage * feedbackPerPage
  const indexOfFirstFeedback = indexOfLastFeedback - feedbackPerPage
  const currentFeedback = filteredFeedback.slice(indexOfFirstFeedback, indexOfLastFeedback)

  // Calculate total pages
  const totalPages = Math.ceil(filteredFeedback.length / feedbackPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const fetchFeedback = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      const response = await axios.get("http://localhost:5000/api/feedbacks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setFeedback(response.data.data) // Adjust this depending on your actual response shape
    } catch (error) {
      console.error("Error fetching feedback:", error)
      showToast("Error fetching feedback", "error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedback()
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
                <span>Loading feedback...</span>
              </div>
            </div>
          </div>
        )}

        {/* Top Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">User Feedback</h1>

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
                  placeholder="Search by subject or message..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Types</option>
                {feedbackTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Feedback Button */}
            <div className="flex-shrink-0">
              <button
                onClick={handleAddFeedback}
                disabled={isLoading}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Feedback
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {currentFeedback.length > 0 ? (
            currentFeedback.map((feedbackItem) => (
              <div
                key={feedbackItem._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{feedbackItem.subject}</h3>
                    <div className="flex gap-2 mb-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(feedbackItem.status)}`}
                      >
                        {feedbackItem.status.charAt(0).toUpperCase() + feedbackItem.status.slice(1)}
                      </span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(feedbackItem.type)}`}
                      >
                        {feedbackItem.type.charAt(0).toUpperCase() + feedbackItem.type.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{feedbackItem.message}</p>

                {/* User Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-900">
                    User: {feedbackItem.user.firstName} {feedbackItem.user.lastName}
                  </p>
                  <p className="text-xs text-gray-600">{feedbackItem.user.email}</p>
                </div>

                {/* Admin Responses */}
                {feedbackItem.responses && feedbackItem.responses.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <p className="text-xs font-medium text-blue-900 mb-2">Admin Responses:</p>
                    {feedbackItem.responses.map((response, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-medium text-blue-900">{response.by}</p>
                          <p className="text-xs text-blue-700">{formatDate(response.timestamp)}</p>
                        </div>
                        <p className="text-sm text-blue-800">{response.message}</p>
                        {response.statusChange && (
                          <p className="text-xs text-blue-600 mt-1">Status changed to: {response.statusChange}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Dates */}
                <div className="mb-4 text-xs text-gray-500">
                  <p>Created: {formatDate(feedbackItem.createdAt)}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResponse(feedbackItem)}
                    disabled={isSubmitting}
                    className="flex-1 text-green-600 hover:text-green-900 disabled:text-green-300 px-3 py-2 text-sm rounded border border-green-300 hover:bg-green-50 transition-colors duration-200 flex items-center justify-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Respond
                  </button>
                  <button
                    onClick={() => handleEdit(feedbackItem)}
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
                    onClick={() => handleDelete(feedbackItem)}
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="text-sm font-medium text-gray-900">No feedback found</h3>
              <p className="text-sm text-gray-500">No feedback matches the current filters.</p>
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
              Showing {indexOfFirstFeedback + 1} to {Math.min(indexOfLastFeedback, filteredFeedback.length)} of{" "}
              {filteredFeedback.length} feedback
              {filteredFeedback.length !== feedback.length && ` (filtered from ${feedback.length} total)`}
            </div>
          </div>
        </div>

        {/* Add/Edit Feedback Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {showAddModal ? "Add New Feedback" : "Edit Feedback"}
                  </h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${formErrors.subject ? "border-red-500" : "border-gray-300"
                        }`}
                      disabled={isSubmitting}
                    />
                    {formErrors.subject && <p className="text-red-500 text-xs mt-1">{formErrors.subject}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${formErrors.message ? "border-red-500" : "border-gray-300"
                        }`}
                      disabled={isSubmitting}
                    />
                    {formErrors.message && <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>}
                  </div>

                  {showAddModal && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">User ID *</label>
                      <input
                        type="text"
                        required
                        value={formData.user}
                        onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${formErrors.user ? "border-red-500" : "border-gray-300"
                          }`}
                        disabled={isSubmitting}
                        placeholder="Enter user ID"
                      />
                      {formErrors.user && <p className="text-red-500 text-xs mt-1">{formErrors.user}</p>}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                      <select
                        required
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${formErrors.type ? "border-red-500" : "border-gray-300"
                          }`}
                        disabled={isSubmitting}
                      >
                        <option value="">Select Type</option>
                        {feedbackTypes.map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                      {formErrors.type && <p className="text-red-500 text-xs mt-1">{formErrors.type}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                      <select
                        required
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${formErrors.status ? "border-red-500" : "border-gray-300"
                          }`}
                        disabled={isSubmitting}
                      >
                        <option value="">Select Status</option>
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                      {formErrors.status && <p className="text-red-500 text-xs mt-1">{formErrors.status}</p>}
                    </div>
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
                      {isSubmitting ? "Saving..." : showAddModal ? "Add Feedback" : "Update Feedback"}
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

        {/* Response Modal */}
        {showResponseModal && selectedFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Respond to Feedback</h2>
                  <button
                    onClick={() => {
                      setShowResponseModal(false)
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

                {/* Feedback Details */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedFeedback.subject}</h3>
                  <p className="text-gray-600 text-sm mb-3">{selectedFeedback.message}</p>
                  <div className="flex gap-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedFeedback.status)}`}
                    >
                      {selectedFeedback.status.charAt(0).toUpperCase() + selectedFeedback.status.slice(1)}
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedFeedback.type)}`}
                    >
                      {selectedFeedback.type.charAt(0).toUpperCase() + selectedFeedback.type.slice(1)}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleResponseSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Response *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.newResponse}
                      onChange={(e) => setFormData({ ...formData, newResponse: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      disabled={isSubmitting}
                      placeholder="Enter your response to the user..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      disabled={isSubmitting}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      {isSubmitting && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      )}
                      {isSubmitting ? "Sending..." : "Send Response"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowResponseModal(false)
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
        {showDeleteModal && selectedFeedback && (
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Feedback</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Are you sure you want to delete the feedback{" "}
                    <span className="font-medium">"{selectedFeedback.subject}"</span>? This action cannot be undone.
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
                      setSelectedFeedback(null)
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

export default FeedbackComponent
