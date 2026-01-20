import { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import Header from "./Header";

/* Pagination constants */
const ITEMS_PER_PAGE = 10;
const MAX_PAGE_BUTTONS = 5; // max numeric page buttons visible

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getCustomers();
  }, []);

  // Reset page on search/filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, subscriptionFilter]);

  const getCustomers = async () => {
    try {
      const res = await axios.get("http://192.168.1.18:5000/api/user");
      setCustomers(res.data.users || []);
      setStats(res.data.counts || null);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  /* FILTER */
  const filteredCustomers = customers.filter((c) => {
    const matchName = c.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSubscription =
      subscriptionFilter === "all" || c.subscription === subscriptionFilter;
    return matchName && matchSubscription;
  });

  /* PAGINATION */
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Generate numeric page buttons
  const getPageNumbers = () => {
    let start = Math.max(currentPage - Math.floor(MAX_PAGE_BUTTONS / 2), 1);
    let end = Math.min(start + MAX_PAGE_BUTTONS - 1, totalPages);
    if (end - start + 1 < MAX_PAGE_BUTTONS) {
      start = Math.max(end - MAX_PAGE_BUTTONS + 1, 1);
    }
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };
  const totalEntries = filteredCustomers.length;

  return (
    <main className="flex-1 p-6 bg-[#F8F8F8]">
      <Header
        title="Customer"
        subtitle="Manage and analyze your customer relationships"
      />

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6 mt-8">
          <StatCard title="Total Customer" value={stats.all} />
          <StatCard title="Free Customer" value={stats.free} />
          <StatCard title="Paid Customer" value={stats.paid} />
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB]">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="font-semibold">Customer List</h2>

          {/* Search & Filter */}
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="outline-none text-sm w-36"
              />
            </div>

            <select
              value={subscriptionFilter}
              onChange={(e) => setSubscriptionFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm outline-none"
            >
              <option value="all">All</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        <div className="m-2.5 border rounded-xl border-[#F0F0F0] px-4 py-3">
          <table className="w-full text-sm">
            <thead className="border-b border-[#F0F0F0]">
              <tr>
                <th className="px-5 py-3 text-left">Customer ID</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Customer Name</th>
                <th className="px-5 py-3 text-left">Contact</th>
                <th className="px-5 py-3 text-left">Subscription</th>
                <th className="px-5 py-3 text-left">Subscription Day</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center">
                    Loading customers...
                  </td>
                </tr>
              ) : paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center">
                    No customers found
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((c) => (
                  <tr key={c._id}>
                    <td className="px-5 py-4 border-b">{c._id}</td>
                    <td className="px-5 py-4 border-b">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 border-b">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            c.avatar || `https://ui-avatars.com/api/?name=${c.name}`
                          }
                          className="w-6 h-6 rounded-full"
                        />
                        {c.name}
                      </div>
                    </td>
                    <td className="px-5 py-4 border-b">{c.email}</td>
                    <td className="px-5 py-4 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          c.subscription === "paid"
                            ? "bg-[#ECFDF3] text-[#027A48]"
                            : "bg-[#F2F4F7] text-[#344054]"
                        }`}
                      >
                        {c.subscription}
                      </span>
                    </td>
                    <td className="px-5 py-4 border-b">{c.subscriptionDuration} Days</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm text-[#6B7280]">
            {totalEntries === 0
              ? "0 Entries"
              : `${startIndex + 1} – ${Math.min(endIndex, filteredCustomers.length)} of ${filteredCustomers.length} Entries`}
          </span>

          <div className="flex items-center gap-2">
            {/* PREV */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 border rounded-lg disabled:opacity-40"
            >
              &lt;
            </button>

            {/* PAGE NUMBERS */}
            {getPageNumbers().map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 border rounded-lg ${
                  num === currentPage ? "bg-blue-500 text-white" : "bg-white text-black"
                }`}
              >
                {num}
              </button>
            ))}

            {/* NEXT */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 border rounded-lg disabled:opacity-40"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* Stat Card */
function StatCard({ title, value }) {
  return (
    <div className="bg-white h-[100px] border border-[#E5E7EB] rounded-2xl p-5">
      <p className="text-[#141414] text-[16px] font-medium">{title}</p>
      <p className="text-[#141414] text-[32px] font-semibold">+ {value}</p>
    </div>
  );
}
