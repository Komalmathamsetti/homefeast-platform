import { useState, useEffect } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  MessageSquareText,
  X,
} from "lucide-react";

import {
  getMyComplaints,
  respondToComplaint,
} from "../../services/cookService";

import toast from "react-hot-toast";

export default function CookComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] =
    useState(false);

  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ==========================================
     LOAD COMPLAINTS
  ========================================== */

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getMyComplaints();

        setComplaints(result?.complaints || []);

      } catch (error) {
        console.error(
          "Failed to load complaints:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Unable to fetch complaints."
        );

        toast.error(
          error?.response?.data?.message ||
            "Unable to fetch complaints."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  /* ==========================================
     FILTERS
  ========================================== */

  const filterTabs = [
    { label: "All", value: "all" },
    { label: "Open", value: "open" },
    { label: "In Progress", value: "in progress" },
    { label: "Resolved", value: "resolved" },
  ];

  const filteredComplaints =
    activeFilter === "all"
      ? complaints
      : complaints.filter(
          (complaint) =>
            complaint.status?.toLowerCase() ===
            activeFilter.toLowerCase()
        );

  /* ==========================================
     STATUS STYLES
  ========================================== */

  const statusStyles = {
    Open: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",

    "In Progress":
      "bg-blue-100 text-blue-700 ring-1 ring-blue-200",

    Resolved:
      "bg-green-100 text-green-700 ring-1 ring-green-200",
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />;

      case "in progress":
        return <Clock3 className="h-4 w-4" />;

      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  /* ==========================================
     VIEW DETAILS
  ========================================== */

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setResponse("");
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedComplaint(null);
    setResponse("");
    setIsDetailsModalOpen(false);
  };

  /* ==========================================
     RESPOND TO COMPLAINT
  ========================================== */

  const handleSubmitResponse = async () => {
    if (!response.trim()) {
      toast.error("Please enter a response.");
      return;
    }

    if (!selectedComplaint) {
      return;
    }

    try {
      setSubmitting(true);

      await respondToComplaint(
        selectedComplaint.id,
        response.trim()
      );

      toast.success(
        "Response submitted to admin successfully."
      );

      handleCloseDetails();

      // Refresh complaints
      const result = await getMyComplaints();

      setComplaints(result?.complaints || []);

    } catch (error) {
      console.error(
        "Failed to submit complaint response:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to submit response."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50">
        <h1 className="text-2xl font-bold text-orange-600">
          Loading complaints...
        </h1>
      </div>
    );
  }

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-orange-50 px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-6">

          <h1 className="text-3xl font-bold text-orange-600 sm:text-4xl">
            Customer Complaints
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Review complaints assigned to you and provide
            your response to the admin.
          </p>

        </div>

        {/* ================= SUMMARY CARDS ================= */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Complaints
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              {complaints.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Open
            </p>

            <h2 className="mt-3 text-3xl font-bold text-amber-600">
              {
                complaints.filter(
                  (complaint) =>
                    complaint.status?.toLowerCase() ===
                    "open"
                ).length
              }
            </h2>
          </div>

          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              In Progress
            </p>

            <h2 className="mt-3 text-3xl font-bold text-blue-600">
              {
                complaints.filter(
                  (complaint) =>
                    complaint.status?.toLowerCase() ===
                    "in progress"
                ).length
              }
            </h2>
          </div>

          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Resolved
            </p>

            <h2 className="mt-3 text-3xl font-bold text-green-600">
              {
                complaints.filter(
                  (complaint) =>
                    complaint.status?.toLowerCase() ===
                    "resolved"
                ).length
              }
            </h2>
          </div>

        </div>

        {/* ================= FILTERS ================= */}

        <div className="mt-6 overflow-x-auto">

          <div className="inline-flex min-w-full rounded-xl border border-orange-100 bg-white p-1 shadow-sm sm:min-w-0">

            {filterTabs.map((tab) => (

              <button
                key={tab.value}
                type="button"
                onClick={() =>
                  setActiveFilter(tab.value)
                }
                className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  activeFilter === tab.value
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {tab.label}
              </button>

            ))}

          </div>

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">

            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>

          </div>
        )}

        {/* ================= COMPLAINTS ================= */}

        <div className="mt-6">

          {filteredComplaints.length > 0 ? (

            <div className="grid gap-5 xl:grid-cols-2">

              {filteredComplaints.map((complaint) => (

                <div
                  key={complaint.id}
                  className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6"
                >

                  {/* HEADER */}

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Complaint ID
                      </p>

                      <h2 className="mt-1 text-lg font-bold text-gray-900">
                        #{complaint.id}
                      </h2>

                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[complaint.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {getStatusIcon(
                        complaint.status
                      )}

                      {complaint.status}
                    </span>

                  </div>

                  {/* DETAILS */}

                  <div className="mt-5 grid grid-cols-1 gap-4 border-y border-orange-100 py-5 sm:grid-cols-3">

                    <div>

                      <p className="text-xs font-medium text-gray-400">
                        Customer
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {complaint.customer_name ||
                          "Unknown"}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs font-medium text-gray-400">
                        Order ID
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        #{complaint.order_id}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs font-medium text-gray-400">
                        Assigned To
                      </p>

                      <p className="mt-1 font-semibold text-green-600">
                        You
                      </p>

                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <div className="mt-5">

                    <p className="text-xs font-medium text-gray-400">
                      Complaint
                    </p>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                      {complaint.description}
                    </p>

                  </div>

                  {/* DATE */}

                  <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">

                    <CalendarDays className="h-4 w-4 text-orange-500" />

                    {new Date(
                      complaint.created_at
                    ).toLocaleDateString()}

                  </div>

                  {/* ACTION */}

                  <button
                    type="button"
                    onClick={() =>
                      handleViewDetails(complaint)
                    }
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
                  >

                    <Eye className="h-4 w-4" />

                    View Complaint

                  </button>

                </div>

              ))}

            </div>

          ) : (

            <div className="rounded-3xl border border-orange-100 bg-white px-6 py-16 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500">

                <MessageSquareText className="h-7 w-7" />

              </div>

              <h2 className="mt-5 text-lg font-bold text-gray-900">
                No Complaints
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                You currently have no complaints matching
                the selected filter.
              </p>

            </div>

          )}

        </div>

      </div>

      {/* ================= DETAILS MODAL ================= */}

      {isDetailsModalOpen &&
        selectedComplaint && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

              {/* MODAL HEADER */}

              <div className="flex items-start justify-between border-b border-orange-100 px-6 py-5">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                    Complaint Details
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    Complaint #{selectedComplaint.id}
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={handleCloseDetails}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>

              </div>

              {/* MODAL CONTENT */}

              <div className="space-y-6 px-6 py-6">

                {/* BASIC DETAILS */}

                <div className="grid gap-4 rounded-2xl bg-orange-50 p-4 sm:grid-cols-3">

                  <div>

                    <p className="text-xs font-medium text-gray-400">
                      Customer
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {selectedComplaint.customer_name ||
                        "Unknown"}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs font-medium text-gray-400">
                      Order ID
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      #{selectedComplaint.order_id}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs font-medium text-gray-400">
                      Status
                    </p>

                    <span
                      className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[
                          selectedComplaint.status
                        ] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {getStatusIcon(
                        selectedComplaint.status
                      )}

                      {selectedComplaint.status}
                    </span>

                  </div>

                </div>

                {/* COMPLAINT */}

                <div>

                  <p className="text-sm font-semibold text-gray-900">
                    Complaint Description
                  </p>

                  <p className="mt-2 rounded-2xl border border-orange-100 bg-white p-4 text-sm leading-6 text-gray-600">
                    {selectedComplaint.description}
                  </p>

                </div>

                {/* RESPONSE */}

                {selectedComplaint.status !==
                  "Resolved" && (

                  <div>

                    <label
                      htmlFor="complaint-response"
                      className="text-sm font-semibold text-gray-900"
                    >
                      Your Response to Admin
                    </label>

                    <textarea
                      id="complaint-response"
                      value={response}
                      onChange={(e) =>
                        setResponse(e.target.value)
                      }
                      placeholder="Explain what happened with this order..."
                      rows={5}
                      className="mt-2 w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />

                  </div>

                )}

                {/* BUTTONS */}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={handleCloseDetails}
                    className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Close
                  </button>

                  {selectedComplaint.status !==
                    "Resolved" && (

                    <button
                      type="button"
                      onClick={handleSubmitResponse}
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                    >

                      <MessageSquareText className="h-4 w-4" />

                      {submitting
                        ? "Submitting..."
                        : "Submit Response to Admin"}

                    </button>

                  )}

                </div>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}