const RefundStats = ({ refunds }) => {
  const approvedRefunds = refunds.filter(
    (r) => r.status?.trim().toLowerCase() === "approved"
  );

  const totalAmount = approvedRefunds.reduce(
    (sum, r) => sum + Number(r.amount || 0),
    0
  );

  const totalRefunds = refunds.length;

  const approvedCount = approvedRefunds.length;

  const rejectedCount = refunds.filter(
    (r) => r.status?.trim().toLowerCase() === "rejected"
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

      {/* Total Refunds Amount (Approved only) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Total Refunds Amount
        </div>
        <p className="text-2xl font-semibold text-gray-900 mb-1">
          LKR {totalAmount.toLocaleString()}
        </p>
        <p className="text-xs text-emerald-500">
          +12.5% from last month
        </p>
      </div>

      {/* Total Refunds */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Total refunds
        </div>
        <p className="text-2xl font-semibold text-gray-900 mb-1">
          {totalRefunds}
        </p>
        <p className="text-xs text-emerald-500">
          +18.7% from last month
        </p>
      </div>

      {/* Approved */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
          Approved
        </div>
        <p className="text-2xl font-semibold text-gray-900 mb-1">
          {approvedCount}
        </p>
        <p className="text-xs text-gray-400">
          2 from last month
        </p>
      </div>

      {/* Rejected */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Rejected
        </div>
        <p className="text-2xl font-semibold text-gray-900 mb-1">
          {rejectedCount}
        </p>
        <p className="text-xs text-gray-400">
          1 from last month
        </p>
      </div>

    </div>
  );
};

export default RefundStats;