import { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import Header from "./Header";

export default function HistoryNotification() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // 🔥 Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://192.168.1.18:5000/api/admin/notifications"
        );
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔍 Search by NAME + Filter by SUBSCRIPTION
  const filteredData = data.filter((item) => {
    const name = (item.name || "").toLowerCase();
    const plan = (item.plan || "").toLowerCase();

    const matchSearch = name.includes(search.toLowerCase());
    const matchFilter =
      filter === "All" || plan === filter.toLowerCase();

    return matchSearch && matchFilter;
  });

  return (
    <div className="flex-1 px-6 py-5 bg-[#F7F7F7]">
      <Header
        title="History Notification"
        subtitle="Manage and analyze your customer relationships"
      />

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-[16px] font-semibold text-[#141414]">
            Customer List
          </h2>

          <div className="flex gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white">
              <Search size={16} className="text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="outline-none text-sm w-36"
              />
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm outline-none bg-white"
            >
              <option value="All">All</option>
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        {/* Table Wrapper */}
        <div className="m-2.5 border border-[#F0F0F0] rounded-xl px-4 py-3">
          <table className="w-full text-sm">
            <thead className="border-b border-[#F0F0F0] text-[#141414]">
              <tr>
                <th className="px-5 py-3 text-left">Customer ID</th>
                <th className="px-5 py-3 text-left">Customer Name</th>
                <th className="px-5 py-3 text-left">Contact</th>
                <th className="px-5 py-3 text-left">
                  Last Notification
                </th>
                <th className="px-5 py-3 text-left">Subscription</th>
                <th className="px-5 py-3 text-left">
                  Notification No.
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center">
                    No data found
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item._id}>
                    <td className="px-5 py-4 border-b border-[#F0F0F0]">
                      {item._id}
                    </td>

                    <td className="px-5 py-4 border-b border-[#F0F0F0]">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-6 h-6 bg-[#ECFDF3] rounded-full"
                        />
                        {item.name}
                      </div>
                    </td>

                    <td className="px-5 py-4 border-b border-[#F0F0F0]">
                      {item.email}
                    </td>

                    <td className="px-5 py-4 border-b border-[#F0F0F0]">
                      {item.last}
                    </td>

                    <td className="px-5 py-4 border-b border-[#F0F0F0]">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          item.plan === "Paid"
                            ? "bg-[#ECFDF3] text-[#027A48]"
                            : "bg-[#F2F4F7] text-[#344054]"
                        }`}
                      >
                        {item.plan}
                      </span>
                    </td>

                    <td className="px-5 py-4 border-b border-[#F0F0F0]">
                      {item.count}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-between px-5 py-4 text-sm text-[#6B7280]">
          <span>{filteredData.length} Entries</span>
        </div>
      </div>
    </div>
  );
}
