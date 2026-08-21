import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  MessageSquareText,
  X,
} from "lucide-react";
import DashboardLayout from "./DashboardLayout";

const CookComplaints = ({
  complaints,
  activeFilter,
  onFilterChange,
  onViewDetails,
  onCloseDetails,
  onResponseChange,
  onSubmitResponse,
  selectedComplaint,
  response,
  isDetailsModalOpen,
}) => {
  const filterTabs = [
    { label: "All", value: "all" },
    { label: "Open", value: "open" },
    { label: "In Progress", value: "in progress" },
    { label: "Resolved", value: "resolved" },
  ];

  const filteredComplaints =
    activeFilter === "all"
      ? complaints
      : complaints?.filter(
          (complaint) =>
            complaint.status?.toLowerCase() === activeFilter?.toLowerCase()
        );

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "in progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "open":
      default:
        return "bg-orange-50 text-orange-700 border-orange-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "in progress":
        return <Clock3 className="h-4 w-4" />;
      case "open":
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-600">
                  HomeFeast Support
                </p>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Customer Complaints
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Review customer concerns, respond thoughtfully, and keep every
                  HomeFeast experience exceptional.
                </p>
              </div>

              <div className="rounded-xl border border-orange-100 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Assigned complaints
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {filteredComplaints?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6 overflow-x-auto">
            <div className="inline-flex min-w-full rounded-xl border border-slate-200 bg-white p-1 shadow-sm sm:min-w-0">
              {filterTabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => onFilterChange(tab.value)}
                  className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    activeFilter === tab.value
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-slate-500 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {filteredComplaints?.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {filteredComplaints.map((complaint) => (
                <article
                  key={complaint.id || complaint.complaintId}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-orange-200 hover:shadow-md sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                        Complaint ID
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {complaint.id || complaint.complaintId}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyles(
                        complaint.status
                      )}`}
                    >
                      {getStatusIcon(complaint.status)}
                      {complaint.status}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 border-y border-slate-100 py-5 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Customer
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {complaint.customerName || complaint.customer?.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Order ID
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {complaint.orderId || complaint.order?.id}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Complaint
                    </p>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                      {complaint.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                    <CalendarDays className="h-4 w-4 text-orange-500" />
                    <span>
                      {complaint.date ||
                        complaint.complaintDate ||
                        complaint.createdAt}
                    </span>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => onViewDetails(complaint)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>

                    <button
                      type="button"
                      onClick={() => onViewDetails(complaint)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
                    >
                      <MessageSquareText className="h-4 w-4" />
                      Respond to Complaint
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                <MessageSquareText className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-lg font-bold text-slate-900">
                No assigned complaints
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                You currently have no complaints matching this filter. New
                customer concerns will appear here when they are assigned to
                you.
              </p>
            </div>
          )}
        </div>
      </main>

      {isDetailsModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                  Complaint Details
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {selectedComplaint.id || selectedComplaint.complaintId}
                </h2>
              </div>

              <button
                type="button"
                onClick={onCloseDetails}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close complaint details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 px-5 py-6 sm:px-6">
              <div className="grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium text-slate-400">Customer</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {selectedComplaint.customerName ||
                      selectedComplaint.customer?.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Order ID
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {selectedComplaint.orderId ||
                      selectedComplaint.order?.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">Status</p>
                  <span
                    className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyles(
                      selectedComplaint.status
                    )}`}
                  >
                    {getStatusIcon(selectedComplaint.status)}
                    {selectedComplaint.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Complaint description
                </p>
                <p className="mt-2 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                  {selectedComplaint.description}
                </p>
              </div>

              <div>
                <label
                  htmlFor="complaint-response"
                  className="text-sm font-semibold text-slate-900"
                >
                  Your response
                </label>
                <textarea
                  id="complaint-response"
                  value={response}
                  onChange={(event) => onResponseChange(event.target.value)}
                  placeholder="Write a thoughtful response to the customer..."
                  rows={6}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onCloseDetails}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => onSubmitResponse(selectedComplaint)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
                >
                  <MessageSquareText className="h-4 w-4" />
                  Send Response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CookComplaints;