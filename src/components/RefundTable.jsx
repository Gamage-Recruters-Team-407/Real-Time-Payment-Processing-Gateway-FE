import { useState } from "react";
import ConfirmDialog from "./RefundConfirmDialog";

import {
  approveRefund,
  rejectRefund,
  refundPayment,
  deleteRefund,
} from "../services/refundService";

const RefundTable = ({ refunds, fetchRefunds }) => {

     const [refundDates, setRefundDates] = useState({});
  const [dateErrors, setDateErrors] = useState({});
  const [confirmAction, setConfirmAction] = useState(null);
  // confirmAction shape: { type: "approve" | "reject" | "delete" | "refund", id: string }

  const runApprove = async (id) => {
    await approveRefund(id);
    fetchRefunds();
  };

  const runReject = async (id) => {
    await rejectRefund(id);
    fetchRefunds();
  };

  const runRefund = async (id) => {
    await refundPayment(id);
    fetchRefunds();
  };

  const runDelete = async (id) => {
    await deleteRefund(id);
    fetchRefunds();
  };

  const handleConfirm = () => {
    if (!confirmAction) return;

    const { type, id } = confirmAction;

    if (type === "approve") runApprove(id);
    if (type === "reject") runReject(id);
    if (type === "delete") runDelete(id);
    if (type === "refund") runRefund(id);

    setConfirmAction(null);
  };

  const dialogContent = {
    approve: {
      title: "Approve Refund",
      message: "Are you sure you want to approve this refund request?",
      confirmText: "Approve",
      confirmColor: "bg-blue-500 hover:bg-blue-600",
    },
    reject: {
      title: "Reject Refund",
      message: "Are you sure you want to reject this refund request?",
      confirmText: "Reject",
      confirmColor: "bg-red-500 hover:bg-red-600",
    },
    delete: {
      title: "Delete Refund",
      message: "Are you sure you want to delete this refund? This action cannot be undone.",
      confirmText: "Delete",
      confirmColor: "bg-gray-700 hover:bg-gray-800",
    },
    refund: {
      title: "Process Refund",
      message: "Are you sure you want to process this refund payment?",
      confirmText: "Refund",
      confirmColor: "bg-green-500 hover:bg-green-600",
    },
  };

  const today = new Date().toISOString().split("T")[0];

  const handleDateChange = (id, date) => {
    if (date > today) {
      setDateErrors({
        ...dateErrors,
        [id]: "Future date not allowed",
      });
      return;
    }

    setDateErrors({
      ...dateErrors,
      [id]: "",
    });

    setRefundDates({
      ...refundDates,
      [id]: date,
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-orange-50 text-orange-600 border border-orange-200";
      case "Rejected":
        return "bg-red-50 text-red-600 border border-red-200";
      case "New":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200";
      case "Failed":
        return "bg-gray-100 text-gray-500 border border-gray-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
            <tr>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Refund ID</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Transaction ID</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Customer Name</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Amount</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Reason</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Proof</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Status</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Request Date</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Approved Date</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Refunded Date</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {refunds.length > 0 ? (
              refunds.map((refund) => {
                const normalizedStatus = refund.status?.trim().toLowerCase();
                const isApproved = normalizedStatus === "approved";
                const isRejected = normalizedStatus === "rejected";
                const canAddRefundedDate = isApproved;

                return (
                <tr
                  key={refund._id}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  <td className="p-4 font-medium text-gray-700 whitespace-nowrap">{refund.refundId}</td>

                  <td className="p-4 text-gray-600 whitespace-nowrap">
                    {refund.transactionId}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {refund.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {refund.phone}
                      </p>
                    </div>
                  </td>

                  <td className="p-4 font-medium text-gray-700 whitespace-nowrap">
                    Rs. {refund.amount}
                  </td>

                  <td className="p-4 text-gray-600 whitespace-nowrap">
                    {refund.reason}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <img
                      src={refund.itemPhoto}
                      alt="Proof"
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                        refund.status
                      )}`}
                    >
                      {refund.status}
                    </span>
                  </td>

                  <td className="p-4 text-gray-600 whitespace-nowrap">
                    {new Date(
                      refund.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-gray-600 whitespace-nowrap">
                    {refund.approvedDate
                      ? new Date(refund.approvedDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <input
                      type="date"
                      max={today}
                      disabled={!canAddRefundedDate}
                      value={
                        refundDates[refund._id] || ""
                      }
                      onChange={(e) =>
                        handleDateChange(
                          refund._id,
                          e.target.value
                        )
                      }
                      className={`border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 ${
                        !canAddRefundedDate
                          ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-200 text-gray-600 focus:ring-emerald-500/30 focus:border-emerald-400"
                      }`}
                    />
                    
                    {!isRejected && !isApproved && (
                      <p className="text-xs text-gray-400 mt-1">
                        Approve first
                      </p>
                    )}
                    {dateErrors[refund._id] && (
                      <p className="text-xs text-red-500 mt-1">
                        {dateErrors[refund._id]}
                      </p>
                    )}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 transition-colors text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                        onClick={() =>
                          setConfirmAction({ type: "approve", id: refund._id })
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="bg-red-500 hover:bg-red-600 transition-colors text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                        onClick={() =>
                          setConfirmAction({ type: "reject", id: refund._id })
                        }
                      >
                        Reject
                      </button>

                      <button
                        className="bg-gray-500 hover:bg-gray-600 transition-colors text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                        onClick={() =>
                          setConfirmAction({ type: "delete", id: refund._id })
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )})
            ) : (
              <tr>
                <td
                  colSpan="11"
                  className="text-center p-8 text-gray-400"
                >
                  No Refund Requests Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!confirmAction}
        title={confirmAction ? dialogContent[confirmAction.type].title : ""}
        message={confirmAction ? dialogContent[confirmAction.type].message : ""}
        confirmText={confirmAction ? dialogContent[confirmAction.type].confirmText : ""}
        confirmColor={confirmAction ? dialogContent[confirmAction.type].confirmColor : ""}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
};

export default RefundTable;