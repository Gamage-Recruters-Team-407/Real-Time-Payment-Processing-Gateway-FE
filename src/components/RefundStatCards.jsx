const RefundStats = ({ refunds }) => {

  const now = new Date();

  const currentMonthRefunds = refunds.filter((r) => {
    const date = new Date(r.createdAt);

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });


  const previousMonthRefunds = refunds.filter((r) => {
    const date = new Date(r.createdAt);

    const previousMonth = now.getMonth() - 1;

    return (
      date.getMonth() === previousMonth &&
      date.getFullYear() === now.getFullYear()
    );
  });


  const approvedRefunds = refunds.filter(
    (r) => r.status?.trim().toLowerCase() === "approved"
  );


  const currentApproved = currentMonthRefunds.filter(
    (r) => r.status?.toLowerCase() === "approved"
  );


  const previousApproved = previousMonthRefunds.filter(
    (r) => r.status?.toLowerCase() === "approved"
  );


  const totalAmount = approvedRefunds.reduce(
    (sum, r) => sum + Number(r.amount || 0),
    0
  );


  const currentAmount = currentApproved.reduce(
    (sum, r) => sum + Number(r.amount || 0),
    0
  );


  const previousAmount = previousApproved.reduce(
    (sum, r) => sum + Number(r.amount || 0),
    0
  );


  const calculatePercentage = (current, previous) => {

    if(previous === 0) return 0;

    return (
      ((current - previous) / previous) * 100
    ).toFixed(1);

  };


  const amountPercentage = calculatePercentage(
    currentAmount,
    previousAmount
  );


  const refundPercentage = calculatePercentage(
    currentMonthRefunds.length,
    previousMonthRefunds.length
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
  {amountPercentage >= 0 ? "+" : ""}
  {amountPercentage}% from last month
</p>
      </div>

      {/* Total Refunds */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
          Total refunds
        </div>
        <p className="text-2xl font-semibold text-gray-900 mb-1">
          {totalRefunds}
        </p>
       <p className="text-xs text-emerald-500">
 {refundPercentage >= 0 ? "+" : ""}
 {refundPercentage}% from last month
</p>
      </div>

      {/* Approved */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
       <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          Approved
        </div>
        <p className="text-2xl font-semibold text-gray-900 mb-1">
          {approvedCount}
        </p>
       <p className="text-xs text-gray-400">
  {approvedCount - previousApproved.length >= 0 ? "+" : ""}
  {approvedCount - previousApproved.length} from last month
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
 {rejectedCount - 
 refunds.filter(
   r => 
   r.status?.toLowerCase() === "rejected" &&
   new Date(r.createdAt).getMonth() === now.getMonth()-1
 ).length >= 0 ? "+" : ""}

 {rejectedCount - 
 refunds.filter(
   r => 
   r.status?.toLowerCase() === "rejected" &&
   new Date(r.createdAt).getMonth() === now.getMonth()-1
 ).length}

 from last month
</p>
      </div>

    </div>
  );
};

export default RefundStats;