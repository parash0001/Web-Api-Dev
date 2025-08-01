"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const BloodRequestComponent = () => {
  const [bloodRequests, setBloodRequests] = useState([]);
  const [filteredBloodRequests, setFilteredBloodRequests] = useState([]);
  const [filters, setFilters] = useState({
    bloodType: "",
    urgency: "",
    status: "",
    location: "",
    search: "",
    dateFrom: "",
    dateTo: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(6);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Form states
  const [formData, setFormData] = useState({
    userName: "",
    bloodType: "",
    quantity: "",
    urgency: "",
    location: "",
    phoneNumber: "",
    issueDescription: "",
    status: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const urgencyLevels = ["low", "medium", "high"];
  const statusOptions = ["pending", "approved", "rejected"];

  // Toast function
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Filter blood requests
  useEffect(() => {
    let filtered = bloodRequests;

    if (filters.bloodType) {
      filtered = filtered.filter(
        (item) => item.bloodType === filters.bloodType
      );
    }
    if (filters.urgency) {
      filtered = filtered.filter((item) => item.urgency === filters.urgency);
    }
    if (filters.status) {
      filtered = filtered.filter((item) => item.status === filters.status);
    }
    if (filters.location) {
      filtered = filtered.filter((item) =>
        item.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.search) {
      filtered = filtered.filter(
        (item) =>
          item.location.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.bloodType.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.issueDescription
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          (item.user.firstName + " " + item.user.lastName)
            .toLowerCase()
            .includes(filters.search.toLowerCase())
      );
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(
        (item) => new Date(item.createdAt) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(
        (item) => new Date(item.createdAt) <= new Date(filters.dateTo)
      );
    }

    setFilteredBloodRequests(filtered);
    setCurrentPage(1);
  }, [filters, bloodRequests]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      userName: "",
      bloodType: "",
      quantity: "",
      urgency: "",
      location: "",
      phoneNumber: "",
      issueDescription: "",
      status: "",
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.bloodType) {
      errors.bloodType = "Blood type is required";
    }
    if (!formData.quantity || formData.quantity <= 0) {
      errors.quantity = "Quantity must be a positive number";
    }
    if (!formData.urgency) {
      errors.urgency = "Urgency level is required";
    }
    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    }
    if (!formData.issueDescription.trim()) {
      errors.issueDescription = "Issue description is required";
    }
    if (!formData.status) {
      errors.status = "Status is required";
    }
    if (showAddModal && !formData.userName.trim()) {
      errors.userName = "User name is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddRequest = () => {
    resetForm();
    setFormData((prev) => ({
      ...prev,
      bloodType: "O+",
      quantity: "1",
      urgency: "medium",
      status: "pending",
    }));
    setShowAddModal(true);
  };

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setFormData({
      userName: request.user.firstName + " " + request.user.lastName,
      bloodType: request.bloodType,
      quantity: request.quantity.toString(),
      urgency: request.urgency,
      location: request.location,
      phoneNumber: request.phoneNumber,
      issueDescription: request.issueDescription,
      status: request.status,
    });
    setShowEditModal(true);
  };

  const handleDelete = (request) => {
    setSelectedRequest(request);
    setShowDeleteModal(true);
  };

  const handleView = (request) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
      if (showAddModal) {
        const response = await axios.post(
          "http://localhost:5000/api/requests",
          {
            userName: formData.userName,
            bloodType: formData.bloodType,
            quantity: Number.parseInt(formData.quantity),
            urgency: formData.urgency,
            location: formData.location,
            phoneNumber: formData.phoneNumber,
            issueDescription: formData.issueDescription,
            status: formData.status,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBloodRequests((prev) => [response.data.data, ...prev]);
        setShowAddModal(false);
        resetForm();
        showToast("Blood request added successfully!");
      } else if (showEditModal && selectedRequest) {
        const response = await axios.patch(
          `http://localhost:5000/api/requests/${selectedRequest._id}/status`,
          {
            bloodType: formData.bloodType,
            quantity: Number.parseInt(formData.quantity),
            urgency: formData.urgency,
            location: formData.location,
            phoneNumber: formData.phoneNumber,
            issueDescription: formData.issueDescription,
            status: formData.status,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBloodRequests((prev) =>
          prev.map((item) =>
            item._id === selectedRequest._id ? response.data.data : item
          )
        );
        setShowEditModal(false);
        resetForm();
        showToast("Blood request updated successfully!");
      }
    } catch (error) {
      console.error("Error saving blood request:", error);
      showToast("An error occurred while saving blood request", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedRequest) return;
    setIsSubmitting(true);
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
      await axios.delete(
        `http://localhost:5000/api/requests/${selectedRequest._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBloodRequests((prev) =>
        prev.filter((item) => item._id !== selectedRequest._id)
      );
      setShowDeleteModal(false);
      setSelectedRequest(null);
      showToast("Blood request deleted successfully!");
    } catch (error) {
      console.error("Error deleting blood request:", error);
      showToast("An error occurred while deleting blood request", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBloodTypeColor = (bloodType) => {
    const colors = {
      "A+": "bg-red-100 text-red-800",
      "A-": "bg-red-200 text-red-900",
      "B+": "bg-blue-100 text-blue-800",
      "B-": "bg-blue-200 text-blue-900",
      "AB+": "bg-purple-100 text-purple-800",
      "AB-": "bg-purple-200 text-purple-900",
      "O+": "bg-green-100 text-green-800",
      "O-": "bg-green-200 text-green-900",
    };
    return colors[bloodType] || "bg-gray-100 text-gray-800";
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get current requests for the page
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredBloodRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredBloodRequests.length / requestsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const fetchBloodRequests = async () => {
    try {
      setIsLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBloodRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching blood requests:", error);
      showToast("Error fetching blood requests", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodRequests();
  }, []);

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : toast.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === "success" && (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {toast.type === "error" && (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
                <span>Loading blood requests...</span>
              </div>
            </div>
          </div>
        )}

        {/* Top Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Blood Requests
          </h1>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 items-end">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
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
                  placeholder="Search by patient, location, or description..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Blood Type Filter */}
            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Type
              </label>
              <select
                value={filters.bloodType}
                onChange={(e) =>
                  handleFilterChange("bloodType", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Types</option>
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Urgency Filter */}
            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency
              </label>
              <select
                value={filters.urgency}
                onChange={(e) => handleFilterChange("urgency", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Urgency</option>
                {urgencyLevels.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                placeholder="Filter by location..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Add Request Button */}
            <div className="flex-shrink-0">
              <button
                onClick={handleAddRequest}
                disabled={isLoading}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Request
              </button>
            </div>
          </div>
        </div>

        {/* Blood Requests Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {currentRequests.length > 0 ? (
            currentRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${getBloodTypeColor(
                          request.bloodType
                        )}`}
                      >
                        {request.bloodType}
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {request.quantity}{" "}
                        {request.quantity === 1 ? "Unit" : "Units"}
                      </span>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(
                          request.urgency
                        )}`}
                      >
                        {request.urgency
                          ? `${
                              request.urgency.charAt(0).toUpperCase() +
                              request.urgency.slice(1)
                            } Priority`
                          : "No Priority"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Patient Info */}
                <div className="mb-4 p-3 bg-blue-50 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-blue-900">Patient</p>
                  </div>
                  <p className="text-sm font-semibold text-blue-800">
                    {request.user.firstName} {request.user.lastName}
                  </p>
                  <p className="text-xs text-blue-600">{request.user.email}</p>
                </div>

                {/* Contact & Location */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">
                      {request.phoneNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                    <span className="text-sm text-gray-600">
                      {request.location}
                    </span>
                  </div>
                </div>

                {/* Issue Description Preview */}
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    Issue Description
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {request.issueDescription}
                  </p>
                </div>

                {/* Request Date */}
                <div className="mb-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Requested: {formatDate(request.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(request)}
                    disabled={isSubmitting}
                    className="flex-1 text-green-600 hover:text-green-900 disabled:text-green-300 px-3 py-2 text-sm rounded border border-green-300 hover:bg-green-50 transition-colors duration-200 flex items-center justify-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                  <button
                    onClick={() => handleEdit(request)}
                    disabled={isSubmitting}
                    className="flex-1 text-blue-600 hover:text-blue-900 disabled:text-blue-300 px-3 py-2 text-sm rounded border border-blue-300 hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                    onClick={() => handleDelete(request)}
                    disabled={isSubmitting}
                    className="flex-1 text-red-600 hover:text-red-900 disabled:text-red-300 px-3 py-2 text-sm rounded border border-red-300 hover:bg-red-50 transition-colors duration-200 flex items-center justify-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h3 className="text-sm font-medium text-gray-900">
                No blood requests found
              </h3>
              <p className="text-sm text-gray-500">
                No blood requests match the current filters.
              </p>
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === pageNumber
                          ? "bg-red-600 text-white"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
                )}
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
              Showing {indexOfFirstRequest + 1} to{" "}
              {Math.min(indexOfLastRequest, filteredBloodRequests.length)} of{" "}
              {filteredBloodRequests.length} requests
              {filteredBloodRequests.length !== bloodRequests.length &&
                ` (filtered from ${bloodRequests.length} total)`}
            </div>
          </div>
        </div>

        {/* Add/Edit Request Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {showAddModal
                      ? "Add New Blood Request"
                      : "Edit Blood Request"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    disabled={isSubmitting}
                    className="text-gray-400 hover:text-gray-600 disabled:text-gray-300"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {showAddModal && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Patient Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.userName}
                        onChange={(e) =>
                          setFormData({ ...formData, userName: e.target.value })
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          formErrors.userName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                        placeholder="Enter patient name"
                      />
                      {formErrors.userName && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.userName}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Blood Type *
                      </label>
                      <select
                        required
                        value={formData.bloodType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bloodType: e.target.value,
                          })
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          formErrors.bloodType
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                      >
                        <option value="">Select Blood Type</option>
                        {bloodTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {formErrors.bloodType && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.bloodType}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData({ ...formData, quantity: e.target.value })
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          formErrors.quantity
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                        placeholder="Number of units needed"
                      />
                      {formErrors.quantity && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.quantity}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Urgency *
                      </label>
                      <select
                        required
                        value={formData.urgency}
                        onChange={(e) =>
                          setFormData({ ...formData, urgency: e.target.value })
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          formErrors.urgency
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                      >
                        <option value="">Select Urgency</option>
                        {urgencyLevels.map((level) => (
                          <option key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </option>
                        ))}
                      </select>
                      {formErrors.urgency && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.urgency}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status *
                      </label>
                      <select
                        required
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          formErrors.status
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                      >
                        <option value="">Select Status</option>
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                      {formErrors.status && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.status}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          formErrors.location
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                        placeholder="Hospital/clinic location"
                      />
                      {formErrors.location && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.location}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phoneNumber: e.target.value,
                          })
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          formErrors.phoneNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                        placeholder="Contact phone number"
                      />
                      {formErrors.phoneNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.issueDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          issueDescription: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        formErrors.issueDescription
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                      placeholder="Describe the medical condition or reason for blood requirement..."
                    />
                    {formErrors.issueDescription && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.issueDescription}
                      </p>
                    )}
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
                      {isSubmitting
                        ? "Saving..."
                        : showAddModal
                        ? "Add Request"
                        : "Update Request"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setShowEditModal(false);
                        resetForm();
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

        {/* View Request Modal */}
        {showViewModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Blood Request Details
                  </h2>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Patient Information */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                      Patient Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-blue-700">
                          Name
                        </p>
                        <p className="text-blue-900">
                          {selectedRequest.user.firstName}{" "}
                          {selectedRequest.user.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-700">
                          Email
                        </p>
                        <p className="text-blue-900">
                          {selectedRequest.user.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-700">
                          Phone
                        </p>
                        <p className="text-blue-900">
                          {selectedRequest.phoneNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-700">
                          Location
                        </p>
                        <p className="text-blue-900">
                          {selectedRequest.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Blood Request Details */}
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-900 mb-3">
                      Blood Request Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-red-700">
                          Blood Type
                        </p>
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${getBloodTypeColor(
                            selectedRequest.bloodType
                          )}`}
                        >
                          {selectedRequest.bloodType}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-700">
                          Quantity
                        </p>
                        <p className="text-red-900">
                          {selectedRequest.quantity}{" "}
                          {selectedRequest.quantity === 1 ? "Unit" : "Units"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-700">
                          Urgency
                        </p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(
                            selectedRequest.urgency
                          )}`}
                        >
                          {selectedRequest.urgency.charAt(0).toUpperCase() +
                            selectedRequest.urgency.slice(1)}{" "}
                          Priority
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-700">
                          Status
                        </p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            selectedRequest.status
                          )}`}
                        >
                          {selectedRequest.status.charAt(0).toUpperCase() +
                            selectedRequest.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Medical Information
                    </h3>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Issue Description
                      </p>
                      <p className="text-gray-900 leading-relaxed">
                        {selectedRequest.issueDescription}
                      </p>
                    </div>
                  </div>

                  {/* Request Timeline */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                      Request Timeline
                    </h3>
                    <div>
                      <p className="text-sm font-medium text-yellow-700">
                        Requested On
                      </p>
                      <p className="text-yellow-900">
                        {formatDate(selectedRequest.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleEdit(selectedRequest);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    Edit Request
                  </button>
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
        {showDeleteModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Delete Blood Request
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Are you sure you want to delete the blood request for{" "}
                    <span className="font-medium">
                      {selectedRequest.quantity} unit
                      {selectedRequest.quantity !== 1 ? "s" : ""} of{" "}
                      {selectedRequest.bloodType}
                    </span>{" "}
                    from{" "}
                    <span className="font-medium">
                      {selectedRequest.user.firstName}{" "}
                      {selectedRequest.user.lastName}
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
                    {isSubmitting && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    {isSubmitting ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedRequest(null);
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
  );
};

export default BloodRequestComponent;
