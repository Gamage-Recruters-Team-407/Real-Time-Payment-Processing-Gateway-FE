import { useEffect, useState } from "react";
import RefundTable from "../components/RefundTable";
import { getAllRefunds } from "../services/refundService";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RefundStats from "../components/RefundStatCards";
import RefundFilters from "../components/RefundFilters";


const RefundManagement = () => {
  const [refunds, setRefunds] = useState([]);
  const [filteredRefunds, setFilteredRefunds] = useState([]);

  const fetchRefunds = async () => {
    const response = await getAllRefunds();
    setRefunds(response.data);
    setFilteredRefunds(response.data);
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const handleSearch = (term) => {
    if (!term) {
      setFilteredRefunds(refunds);
      return;
    }

    const lowerTerm = term.toLowerCase();
    const filtered = refunds.filter(
      (r) =>
        r.name?.toLowerCase().includes(lowerTerm) ||
        r.refundId?.toLowerCase().includes(lowerTerm) ||
        r.transactionId?.toLowerCase().includes(lowerTerm)
    );
    setFilteredRefunds(filtered);
  };

  const handleFilterChange = (filter) => {
    if (filter === "All") {
      setFilteredRefunds(refunds);
      return;
    }

    setFilteredRefunds(
      refunds.filter(
        (r) => r.status?.trim().toLowerCase() === filter.toLowerCase()
      )
    );
  };

  const handleDateChange = (date) => {
    if (!date) {
      setFilteredRefunds(refunds);
      return;
    }

    setFilteredRefunds(
      refunds.filter(
        (r) =>
          new Date(r.createdAt).toISOString().split("T")[0] === date
      )
    );
  };

  return (
    <div className="p-6">
      
      <h1 className="text-3xl font-bold mb-5">
        Refund Management
      </h1>

      <RefundStats refunds={refunds} />

      <RefundFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onDateChange={handleDateChange}
      />

      <RefundTable
        refunds={filteredRefunds}
        fetchRefunds={fetchRefunds}
      />
    </div>
  );
};

export default RefundManagement;