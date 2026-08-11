import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getPendingCooks,
  approveCook,
  rejectCook,
} from "../../services/adminServices";

export default function CookApprovals({onCookAction}) {
  const [cooks, setCooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchPendingCooks = async () => {
    try {
      setLoading(true);

      const response = await getPendingCooks();

      console.log("PENDING COOKS:", response);

      setCooks(response.cooks || []);
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Unable to load pending cooks",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPendingCooks = async()=>{
       await  fetchPendingCooks();
    };
    loadPendingCooks();
  }, []);

  // ==========================================
  // APPROVE COOK
  // ==========================================
  const handleApprove = async (cook) => {
    const result = await Swal.fire({
      title: "Approve Cook?",
      text: `Are you sure you want to approve ${cook.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setProcessingId(cook.id);

      await approveCook(cook.id);

      // Remove immediately from UI
      setCooks((previous) =>
        previous.filter((item) => item.id !== cook.id)
      );
       if(onCookAction){
        onCookAction();
       }
      await Swal.fire({
        title: "Approved!",
        text: `${cook.name} has been approved successfully.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Approval Failed",
        text:
          error.response?.data?.message ||
          "Unable to approve cook",
        icon: "error",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================
  // REJECT COOK
  // ==========================================
  const handleReject = async (cook) => {
    const result = await Swal.fire({
      title: "Reject Cook?",
      text: `Are you sure you want to reject ${cook.name}'s registration?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setProcessingId(cook.id);

      await rejectCook(cook.id);

      // Remove immediately from UI
      setCooks((previous) =>
        previous.filter((item) => item.id !== cook.id)
      );
       if(onCookAction){
        onCookAction();
       }
      await Swal.fire({
        title: "Rejected",
        text: `${cook.name}'s registration has been rejected.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Rejection Failed",
        text:
          error.response?.data?.message ||
          "Unable to reject cook",
        icon: "error",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="flex min-h-125 items-center justify-center">
        <h2 className="text-2xl font-bold text-orange-500">
          Loading Cook Applications...
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-orange-600">
          Cook Approvals
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Review and manage pending cook registrations.
        </p>
      </div>

      {/* Pending count */}
      <div className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white px-5 py-4 shadow-sm">

        <div>
          <p className="text-sm text-gray-500">
            Pending Applications
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {cooks.length}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
          👨‍🍳
        </div>

      </div>

      {/* Empty state */}
      {cooks.length === 0 && (
        <div className="rounded-3xl border border-green-100 bg-white p-12 text-center shadow-sm">

          <div className="text-6xl">
            ✅
          </div>

          <h2 className="mt-4 text-xl font-bold text-gray-900">
            No Pending Applications
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            All cook registrations have been reviewed.
          </p>

        </div>
      )}

      {/* Cook cards */}
      <div className="grid gap-6 lg:grid-cols-2">

        {cooks.map((cook) => (

          <div
            key={cook.id}
            className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition hover:shadow-md"
          >

            {/* Card Header */}
            <div className="flex items-start justify-between border-b border-gray-100 p-6">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-orange-600">
                  {cook.name
                    ? cook.name.charAt(0).toUpperCase()
                    : "C"}
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {cook.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Cook ID: #{cook.id}
                  </p>
                </div>

              </div>

              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                Pending
              </span>

            </div>

            {/* Details */}
            <div className="space-y-4 p-6">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Email
                </p>

                <p className="mt-1 text-sm text-gray-800">
                  {cook.email || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Phone
                </p>

                <p className="mt-1 text-sm text-gray-800">
                  {cook.phone || "Not provided"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Service Area
                  </p>

                  <p className="mt-1 text-sm text-gray-800">
                    {cook.service_area || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Delivery Timings
                  </p>

                  <p className="mt-1 text-sm text-gray-800">
                    {cook.delivery_timings || "Not provided"}
                  </p>
                </div>

              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Bio
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-700">
                  {cook.bio || "No bio provided."}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Rating
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-800">
                  ⭐ {cook.rating ?? "0"}
                </p>
              </div>

            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 border-t border-gray-100 bg-gray-50 p-5">

              <button
                onClick={() => handleApprove(cook)}
                disabled={processingId === cook.id}
                className="rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processingId === cook.id
                  ? "Processing..."
                  : "✓ Approve"}
              </button>

              <button
                onClick={() => handleReject(cook)}
                disabled={processingId === cook.id}
                className="rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processingId === cook.id
                  ? "Processing..."
                  : "✕ Reject"}
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}