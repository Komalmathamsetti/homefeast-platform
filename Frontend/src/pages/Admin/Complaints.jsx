import { useState,useEffect } from "react";
import { getAllComplaints,updateComplaintStatus } from "../../services/adminServices";
import {
AlertCircle,
CalendarDays,
ChevronDown,
Clock3,
FileText,
MessageSquareWarning,
Search,
UserRound,
X,
} from "lucide-react";
export default function ComplaintsAndDisputes() {
const [complaints,setComplaints] = useState([]);
const [error,setError] = useState("");
const [loading,setLoading] = useState(true);
const [activeFilter,setActiveFilter] = useState("All");
const [searchTerm,setSearchTerm] = useState("");
const [updatingId,setUpdatingId] = useState(null);
useEffect(()=>{
  const loadComplaints = async()=>{
    try{
      setLoading(true);
      setError("");
      const response = await getAllComplaints();
      setComplaints(response?.complaints || []);
    }catch(error){
      console.error("Failed to load complaints:",error);
      setError(error?.response?.data?.message || "Failed to load complaints");
    }finally{
      setLoading(false);
    }
  };
  loadComplaints();
},[]);
const filters = ["All", "Open", "In Progress", "Resolved"];

const statusConfig = {
Open: {
icon: AlertCircle,
badge: "bg-orange-50 text-orange-700 ring-orange-600/20",
border: "border-l-orange-500",
},
"In Progress": {
icon: Clock3,
badge: "bg-blue-50 text-blue-700 ring-blue-600/20",
border: "border-l-blue-500",
},
Resolved: {
icon: FileText,
badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
border: "border-l-emerald-500",
},
};
const filteredComplaints = complaints.filter((complaint) => {
  const matchesStatus =
    activeFilter === "All" ||
    complaint.status === activeFilter;
  const search = searchTerm.toLowerCase();
  const matchesSearch =
    !search ||
    String(complaint.id || "")
      .toLowerCase()
      .includes(search) ||
    String(complaint.customer_name || "")
      .toLowerCase()
      .includes(search) ||
    String(complaint.order_id || "")
      .toLowerCase()
      .includes(search) ||
    String(complaint.description || "")
      .toLowerCase()
      .includes(search);

  return matchesStatus && matchesSearch;
});
return (
<div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
<div className="mx-auto max-w-7xl">
<div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
<div>
<div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
<MessageSquareWarning className="h-3.5 w-3.5" />
Customer support
</div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Complaints & Disputes
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Review customer concerns, manage disputes, and keep every
          resolution organized in one place.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <MessageSquareWarning className="h-5 w-5 text-orange-500" />
        <div>
          <p className="text-xs font-medium text-slate-500">
            Total complaints
          </p>
          <p className="text-lg font-bold text-slate-900">
            {complaints?.length ?? 0}
          </p>
        </div>
      </div>
    </div>

    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 overflow-x-auto">
          <div className="flex min-w-max items-center gap-1 rounded-xl bg-slate-100 p-1">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={()=>setActiveFilter(filter)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  activeFilter === filter
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            readOnly
            placeholder="Search complaints..."
            aria-label="Search complaints"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
          />
        </div>
      </div>
    </div>
    {loading ? (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Loading complaints...
        </p>
      </div>) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
          <h2 className="mt-4 text-lg font-bold text-red-700">
            Unable to load complaints
          </h2>
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        </div>
      ) : filteredComplaints?.length > 0 ? (
      <div className="grid gap-4">
        {filteredComplaints.map((complaint) => {
          const status = complaint.status || "Open";
          const config = statusConfig[status] || statusConfig.Open;
          const StatusIcon = config.icon;

          const complaintId = String(
            complaint.id || complaint.complaintId
          ).replace(/[^a-zA-Z0-9-_]/g, "-");

          const customerName = complaint.customer_name || "Unknown customer";

          const customerAvatar =
            complaint.customerAvatar || complaint.customer?.avatar;

          const initials = customerName
            .split(" ")
            .map((name) => name[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <article
              key={complaint.id || complaint.complaintId}
              className={`rounded-2xl border border-slate-200 border-l-4 ${config.border} bg-white shadow-sm transition hover:shadow-md`}
            >
              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-6 xl:flex-row xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-bold text-slate-900">
                        #{complaint.id || complaint.complaintId}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.badge}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      {customerAvatar ? (
                        <img
                          src={customerAvatar}
                          alt={customerName}
                          className="h-10 w-10 rounded-full object-cover ring-4 ring-slate-50"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700 ring-4 ring-slate-50">
                          {initials || (
                            <UserRound className="h-5 w-5" />
                          )}
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-slate-900">
                          {customerName}
                        </p>
                        <p className="text-xs text-slate-500">Customer</p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Order ID
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {complaint.order_id || "Not available"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Complaint date
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                          <CalendarDays className="h-4 w-4 text-slate-400" />
                          {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : "Not available"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl bg-slate-50 p-4">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                        Complaint description
                      </p>
                      <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                        {complaint.description ||
                          complaint.complaintDescription ||
                          "No description provided."}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row xl:flex-col">
                    <button
                      type="button"
                      onClick={() =>
                        document
                          .getElementById(`complaint-${complaintId}`)
                          ?.showModal()
                      }
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                    >
                      View Details
                    </button>

                    <div className="relative">
                      <select value={status}
                      disabled={updatingId === complaint.id}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          setUpdatingId(complaint.id);
                          await updateComplaintStatus(
                            complaint.id,newStatus
                          );
                          setComplaints((prev) => prev.map((item) =>
                            item.id === complaint.id ? {
                              ...item,status: newStatus,
                            }: item
                          )
                        );
                      } catch (error) {
                        console.error("Failed to update complaint status:",error);
                        setError(error?.response?.data?.message || "Failed to update complaint status");
                      } finally {                        
                        setUpdatingId(null);
                      }
                    }}
                        className="h-10 w-full appearance-none rounded-xl border border-orange-200 bg-orange-50 pl-4 pr-9 text-sm font-semibold text-orange-700 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 sm:w-auto"
                      >
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              <dialog
                id={`complaint-${complaintId}`}
                className="m-auto w-[calc(100%-2rem)] max-w-2xl rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-900/40"
              >
                <div className="flex items-start justify-between border-b border-slate-200 p-5 sm:p-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                      Complaint details
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      #{complaint.id || complaint.complaintId}
                    </h2>
                  </div>

                  <form method="dialog">
                    <button
                      type="submit"
                      aria-label="Close complaint details"
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </form>
                </div>

                <div className="space-y-6 p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    {customerAvatar ? (
                      <img
                        src={customerAvatar}
                        alt={customerName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700">
                        {initials}
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-slate-900">
                        {customerName}
                      </p>
                      <p className="text-sm text-slate-500">
                        Order {complaint.orderId || "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Status
                      </p>
                      <span
                        className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.badge}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Complaint date
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        {complaint.date ||
                          complaint.complaintDate ||
                          "Not available"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-900">
                      Complaint description
                    </p>
                    <p className="text-sm leading-7 text-slate-600">
                      {complaint.description ||
                        complaint.complaintDescription ||
                        "No description provided."}
                    </p>
                  </div>
                </div>
              </dialog>
            </article>
          );
        })}
      </div>
    ) : (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-600">
          <AlertCircle className="h-7 w-7" />
        </div>

        <h2 className="mt-5 text-lg font-bold text-slate-900">
          No complaints found
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          There are no complaints matching your current filters or search.
          New customer concerns will appear here.
        </p>
      </div>
    )}
  </div>
</div>
);
}