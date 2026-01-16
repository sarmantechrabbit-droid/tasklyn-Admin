import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  Bell,
  ChevronDown,
} from "lucide-react";
import Header from "./Header";

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ NEW STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");

  useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = async () => {
    try {
      const res = await axios.get(
        "http://192.168.1.18:5000/api/user"
      );

      setCustomers(res.data.users || []);
      setStats(res.data.counts || null);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FILTER LOGIC
  const filteredCustomers = customers.filter((c) => {
    const matchName = c.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchSubscription =
      subscriptionFilter === "all" ||
      c.subscription === subscriptionFilter;

    return matchName && matchSubscription;
  });

  return (
    <main className="flex-1 p-6 bg-[#F8F8F8]">
      {/* Header */}
           <Header
        title="Customer"
        subtitle="Manage and analyze your customer relationships"
      />
      {/* <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-[#141414]">
            Customer
          </h1>
          <p className="text-sm text-[#6B7280]">
            Manage and analyze your customer relationships
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Search className="w-5 h-5 text-[#6B7280]" />
          <Bell className="w-5 h-5 text-[#6B7280]" />

          <div className="flex items-center gap-2">
            <img
              src="https://i.pravatar.cc/40?10"
              className="w-8 h-8 rounded-full"
            />
            <div className="text-sm">
              <p className="font-medium">Jacob Farrel</p>
              <p className="text-xs text-[#6B7280]">
                jacobfarrel@gmail.com
              </p>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </div> */}

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

          {/* ✅ SEARCH + FILTER */}
          <div className="flex gap-3">
            {/* Search */}
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

            {/* Filter */}
            <select
              value={subscriptionFilter}
              onChange={(e) =>
                setSubscriptionFilter(e.target.value)
              }
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
            <thead className="border-b border-[#F0F0F0] text-[#141414]">
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
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c._id}>
                    <td className="px-5 py-4 border-b">{c._id}</td>
                    <td className="px-5 py-4 border-b">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 border-b">
                      <div className="flex items-center gap-2">
                        <img
                          src={c.avatar}
                          className="w-6 h-6 rounded-full"
                        />
                        {c.name}
                      </div>
                    </td>
                    <td className="px-5 py-4 border-b">
                      {c.email}
                    </td>
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
                    <td className="px-5 py-4 border-b">
                      {c.subscriptionDuration} Days
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between px-5 py-4 text-sm text-[#6B7280]">
          <span>{filteredCustomers.length} Entries</span>
        </div>
      </div>
    </main>
  );
}

/* Reusable Stat Card */
function StatCard({ title, value }) {
  return (
    <div className="bg-white h-[100px] border border-[#E5E7EB] rounded-2xl p-5">
      <p className="text-[#141414] font-[Geist] text-[16px] font-medium leading-[24px]">
        {title}
      </p>
      <p className="text-[#141414] font-[Geist] text-[32px] font-semibold leading-[40px] tracking-[-0.32px]">
        + {value}
      </p>
    </div>
  );
}
