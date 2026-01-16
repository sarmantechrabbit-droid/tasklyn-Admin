import { useEffect, useState } from "react";
import axios from "axios";
import { Search, ChevronDown } from "lucide-react";
import Header from "./Header";

const PAGE_SIZE = 10;

export default function HistoryNotification() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [stats, setStats] = useState(null);

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://192.168.1.18:5000/api/admin/notifications"
        );
        setData(res.data || []);
        setStats(res.data?.counts || null);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔍 Filter + Search
  const filteredData = data.filter((item) => {
    const userName = (item.userId?.name || "").toLowerCase();
    const subscription = (item.userId?.subscription || "").toLowerCase();

    const matchSearch = userName.includes(search.toLowerCase());
    const matchFilter =
      filter === "All" || subscription === filter.toLowerCase();

    return matchSearch && matchFilter;
  });

  // ✅ Pagination logic
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="flex-1 px-6 py-5 bg-[#F7F7F7]">
      <Header
        title="History Notification"
        subtitle="Manage and analyze your customer relationships"
      />

      <div className="bg-white rounded-2xl border border-[#E5E7EB]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-[16px] font-semibold text-[#141414]">
            Customer List
          </h2>

          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white">
              <Search size={16} className="text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search by name"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="outline-none text-sm w-36"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm outline-none bg-white"
            >
              <option value="All">All</option>
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-6 mt-8 px-5">
            <StatCard title="Total Customer" value={stats.all} />
            <StatCard title="Free Customer" value={stats.free} />
            <StatCard title="Paid Customer" value={stats.paid} />
          </div>
        )}

        {/* Table */}
        <div className="m-2.5 border border-[#F0F0F0] rounded-xl px-4 py-3">
          <table className="w-full text-sm">
            <thead className="border-b border-[#F0F0F0]">
              <tr>
                <th className="px-5 py-3 text-left">Customer ID</th>
                <th className="px-5 py-3 text-left">Customer Name</th>
                <th className="px-5 py-3 text-left">Contact</th>
                <th className="px-5 py-3 text-left">Last Notification</th>
                <th className="px-5 py-3 text-left">Subscription</th>
                <th className="px-5 py-3 text-left">Notification No.</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center">
                    No data found
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item._id}>
                    <td className="px-5 py-4 border-b">{item._id}</td>
                    <td className="px-5 py-4 border-b">
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://ui-avatars.com/api/?name=${
                            item.userId?.name || "User"
                          }`}
                          className="w-6 h-6 rounded-full"
                        />
                        {item.userId?.name || "Unknown User"}
                      </div>
                    </td>
                    <td className="px-5 py-4 border-b">{item.recipient}</td>
                    <td className="px-5 py-4 border-b">{item.sentAt}</td>
                    <td className="px-5 py-4 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          item.userId?.subscription?.toLowerCase() === "paid"
                            ? "bg-[#ECFDF3] text-[#027A48]"
                            : "bg-[#F2F4F7] text-[#344054]"
                        }`}
                      >
                        {item.userId?.subscription || "Unknown"}
                      </span>
                    </td>
                    <td className="px-5 py-4 border-b">{item.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination Footer (MATCH IMAGE) */}
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm text-[#6B7280]">
            {startIndex + 1} – {Math.min(endIndex, totalEntries)} of{" "}
            {totalEntries} Entries
          </span>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm">
              1 – 10 <ChevronDown size={16} />
            </button>

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 border rounded-lg disabled:opacity-40"
            >
              ←
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="flex items-center gap-2 px-3 py-2 border rounded-lg disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white h-[100px] border border-[#E5E7EB] rounded-2xl p-5">
      <p className="text-[#141414] text-[16px] font-medium">{title}</p>
      <p className="text-[#141414] text-[32px] font-semibold">+ {value}</p>
    </div>
  );
}
