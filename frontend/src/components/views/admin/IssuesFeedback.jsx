"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast, Toaster } from "react-hot-toast"

const IssuesFeedback = () => {
  // Sample issues/feedback data
  const [issues, setIssues] = useState([])

  // Remove all the sample data and replace with:
  useEffect(() => {
    fetchIssues()
  }, [])

  const [filteredIssues, setFilteredIssues] = useState(issues)
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
    search: "",
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [issuesPerPage] = useState(6)

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState(null)

  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    status: "",
    userEmail: "",
    userName: "",
    responses: [], // Change from adminResponse to responses array
    newResponse: "", // Add this for response modal
  })

  const [formErrors, setFormErrors] = useState({})

  const categories = ["Bug", "Feature Request", "Suggestion", "Complaint", "Compliment", "Other"]
  const priorities = ["Low", "Medium", "High", "Urgent"]
  const statuses = ["Open", "In Progress", "Resolved", "Closed"]

  // API Base URL
  const API_BASE_URL = "http://localhost:5000/api" // Update this to match your backend

  // Axios configuration
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      // Add authorization header if needed
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  }

  // Filter issues
  useEffect(() => {
    let filtered = issues

    if (filters.status) {
      filtered = filtered.filter((issue) => issue.status === filters.status)
    }

    if (filters.priority) {
      filtered = filtered.filter((issue) => issue.priority === filters.priority)
    }

    if (filters.category) {
      filtered = filtered.filter((issue) => issue.category === filters.category)
    }

    if (filters.search) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          issue.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          issue.userName.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    setFilteredIssues(filtered)
    setCurrentPage(1)
  }, [filters, issues])

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      priority: "",
      status: "",
      userEmail: "",
      userName: "",
      responses: [],
      newResponse: "", // Add this for response modal
    })
    setFormErrors({})
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.title.trim()) {
      errors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required"
    }

    if (!formData.category) {
      errors.category = "Category is required"
    }

    if (!formData.priority) {
      errors.priority = "Priority is required"
    }

    if (!formData.status) {
      errors.status = "Status is required"
    }

    if (showAddModal && !formData.userEmail.trim()) {
      errors.userEmail = "User email is required"
    }

    if (showAddModal && !formData.userName.trim()) {
      errors.userName = "User name is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddIssue = () => {
    resetForm()
    setFormData((prev) => ({ ...prev, status: "Open", priority: "Medium" }))
    setShowAddModal(true)
  }

  const handleEdit = (issue) => {
    setSelectedIssue(issue)
    setFormData({
      title: issue.title,
      description: issue.description,
      category: issue.category,
      priority: issue.priority,
      status: issue.status,
      userEmail: issue.userEmail,
      userName: issue.userName,
      responses: issue.responses || [], // Handle responses array
    })
    setShowEditModal(true)
  }

  const handleDelete = (issue) => {
    setSelectedIssue(issue)
    setShowDeleteModal(true)
  }

  const handleResponse = (issue) => {
    setSelectedIssue(issue)
    setFormData({
      ...issue,
      newResponse: "", // Add field for new response
      responses: issue.responses || [],
    })
    setShowResponseModal(true)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      if (showAddModal) {
        const userData = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
          status: formData.status,
          userEmail: formData.userEmail,
          userName: formData.userName,
          responses: [], // Initialize empty responses array
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        const response = await axios.post(`${API_BASE_URL}/issues`, userData, axiosConfig)
        setIssues((prev) => [response.data, ...prev])
        setShowAddModal(false)
        resetForm()
        toast.success("Issue added successfully!")
      } else if (showEditModal) {
        const userData = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
          status: formData.status,
          userEmail: formData.userEmail,
          userName: formData.userName,
          updatedAt: new Date().toISOString(),
        }

        const response = await axios.put(`${API_BASE_URL}/issues/${selectedIssue._id}`, userData, axiosConfig)
        setIssues((prev) => prev.map((issue) => (issue._id === selectedIssue._id ? response.data : issue)))
        setShowEditModal(false)
        resetForm()
        toast.success("Issue updated successfully!")
      }
    } catch (error) {
      console.error("Error saving issue:", error)
      const errorMessage = error.response?.data?.message || error.message || "An error occurred"
      toast.error("Error saving issue: " + errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResponseSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const newResponse = {
        message: formData.newResponse, // Change from responseText to message
        by: "admin@gmail.com", // Change from adminName to by with email
        timestamp: new Date().toISOString(),
        statusChange: formData.status !== selectedIssue.status ? formData.status : null,
      }

      const responseData = {
        response: newResponse,
        status: formData.status,
        updatedAt: new Date().toISOString(),
      }

      const response = await axios.put(
        `${API_BASE_URL}/issues/${selectedIssue._id}/response`,
        responseData,
        axiosConfig,
      )
      setIssues((prev) => prev.map((issue) => (issue._id === selectedIssue._id ? response.data : issue)))
      setShowResponseModal(false)
      resetForm()
      toast.success("Response added successfully!")
    } catch (error) {
      console.error("Error adding response:", error)
      const errorMessage = error.response?.data?.message || error.message || "An error occurred"
      toast.error("Error adding response: " + errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    setIsSubmitting(true)

    try {
      await axios.delete(`${API_BASE_URL}/issues/${selectedIssue._id}`, axiosConfig)
      setIssues((prev) => prev.filter((issue) => issue._id !== selectedIssue._id))
      setShowDeleteModal(false)
      setSelectedIssue(null)
      toast.success("Issue deleted successfully!")
    } catch (error) {
      console.error("Error deleting issue:", error)
      const errorMessage = error.response?.data?.message || error.message || "An error occurred"
      toast.error("Error deleting issue: " + errorMessage)
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-purple-100 text-purple-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      case "Closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get current issues for the page
  const indexOfLastIssue = currentPage * issuesPerPage
  const indexOfFirstIssue = indexOfLastIssue - issuesPerPage
  const currentIssues = filteredIssues.slice(indexOfFirstIssue, indexOfLastIssue)

  // Calculate total pages
  const totalPages = Math.ceil(filteredIssues.length / issuesPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  // Update fetchIssues function to actually make the API call:
  const fetchIssues = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${API_BASE_URL}/issues`, axiosConfig)
      setIssues(response.data)
    } catch (error) {
      console.error("Error fetching issues:", error)
      toast.error("Error fetching issues: " + (error.response?.data?.message || error.message))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-right" autoClose={1000} />
      <div className="w-full h-full bg-white p-10 m-5 rounded-rsm">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                <span>Loading issues...</span>
              </div>
            </div>
          </div>
        )}

        {/* Top Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Issues & Feedback</h1>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 items-end">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Search by title, description, or user..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
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
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Priorities</option>
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Issue Button */}
            <div className="flex-shrink-0">
              <button
                onClick={handleAddIssue}
                disabled={isLoading}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Issue
              </button>
            </div>
          </div>
        </div>

        {/* Issues Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {currentIssues.length > 0 ? (
            currentIssues.map((issue) => (
              <div
                key={issue._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{issue.title}</h3>
                    <div className="flex gap-2 mb-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(issue.status)}`}
                      >
                        {issue.status}
                      </span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(issue.priority)}`}
                      >
                        {issue.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{issue.description}</p>

                {/* Category */}
                <div className="mb-4">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                    {issue.category}
                  </span>
                </div>

                {/* User Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-900">{issue.userName}</p>
                  <p className="text-xs text-gray-600">{issue.userEmail}</p>
                </div>

                {/* Admin Responses - Updated to show multiple responses */}
                {issue.responses && issue.responses.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <p className="text-xs font-medium text-blue-900 mb-2">Admin Responses:</p>
                    {issue.responses.map((response, index) => (
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
                  <p>Created: {formatDate(issue.createdAt)}</p>
                  {issue.updatedAt !== issue.createdAt && <p>Updated: {formatDate(issue.updatedAt)}</p>}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResponse(issue)}
                    disabled={isSubmitting}
                    className="flex-1 text-green-600 hover:text-green-900 disabled:text-green-300 px-3 py-2 text-sm rounded border border-green-300 hover:bg-green-50 transition-colors duration-200"
                  >
                    Respond
                  </button>
                  <button
                    onClick={() => handleEdit(issue)}
                    disabled={isSubmitting}
                    className="flex-1 text-blue-600 hover:text-blue-900 disabled:text-blue-300 px-3 py-2 text-sm rounded border border-blue-300 hover:bg-blue-50 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(issue)}
                    disabled={isSubmitting}
                    className="flex-1 text-red-600 hover:text-red-900 disabled:text-red-300 px-3 py-2 text-sm rounded border border-red-300 hover:bg-red-50 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No issues found</h3>
              <p className="mt-1 text-sm text-gray-500">No issues match the current filters.</p>
            </div>
          )}
        </div>

        {/* Pagination and Results Summary */}
        <div className="bg-white rounded-lg shadow-sm p-4">
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
              Showing {indexOfFirstIssue + 1} to {Math.min(indexOfLastIssue, filteredIssues.length)} of{" "}
              {filteredIssues.length} issues
              {filteredIssues.length !== issues.length && ` (filtered from ${issues.length} total)`}
            </div>
          </div>
        </div>

        {/* Add/Edit Issue Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{showAddModal ? "Add New Issue" : "Edit Issue"}</h2>
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
                    />
                    {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${formErrors.description ? "border-red-500" : "border-gray-300"
                        }`}
                      disabled={isSubmitting}
                    />
                    {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
                  </div>

                  {showAddModal && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">User Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.userName}
                          onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${formErrors.userName ? "border-red-500" : "border-gray-300"
                            }`}
                          disabled={isSubmitting}
                        />
                        {formErrors.userName && <p className="text-red-500 text-xs mt-1">{formErrors.userName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">User Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.userEmail}
                          onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${formErrors.userEmail ? "border-red-500" : "border-gray-300"
                            }`}
                          disabled={isSubmitting}
                        />
                        {formErrors.userEmail && <p className="text-red-500 text-xs mt-1">{formErrors.userEmail}</p>}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${formErrors.category ? "border-red-500" : "border-gray-300"
                          }`}
                        disabled={isSubmitting}
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
                      <select
                        required
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${formErrors.priority ? "border-red-500" : "border-gray-300"
                          }`}
                        disabled={isSubmitting}
                      >
                        <option value="">Select Priority</option>
                        {priorities.map((priority) => (
                          <option key={priority} value={priority}>
                            {priority}
                          </option>
                        ))}
                      </select>
                      {formErrors.priority && <p className="text-red-500 text-xs mt-1">{formErrors.priority}</p>}
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
                            {status}
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
                      {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                      {isSubmitting ? "Saving..." : showAddModal ? "Add Issue" : "Update Issue"}
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
        {showResponseModal && selectedIssue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Respond to Issue</h2>
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

                {/* Issue Details */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedIssue.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{selectedIssue.description}</p>
                  <div className="flex gap-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedIssue.status)}`}
                    >
                      {selectedIssue.status}
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedIssue.priority)}`}
                    >
                      {selectedIssue.priority}
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
                          {status}
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
                      {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
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
        {showDeleteModal && selectedIssue && (
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Issue</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Are you sure you want to delete the issue <span className="font-medium">"{selectedIssue.title}"</span>
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
                      setSelectedIssue(null)
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

export default IssuesFeedback
