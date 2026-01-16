import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

export default function CouponDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [discountFilter, setDiscountFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const itemsPerPage = 10;

  /* =======================
     GET ALL COUPONS API
  ======================== */
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://192.168.1.18:5000/api/coupons"
        );

        // API returns array directly
        setCoupons(res.data || []);
      } catch (err) {
        console.error("Coupon API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  /* =======================
     SEARCH + FILTER
  ======================== */
  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchSearch = coupon.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchDiscount =
        discountFilter === "all" ||
        String(coupon.discountValue) ===
          discountFilter.replace("%", "");

      return matchSearch && matchDiscount;
    });
  }, [coupons, searchTerm, discountFilter]);

  /* =======================
     PAGINATION
  ======================== */
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCoupons = filteredCoupons.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, discountFilter]);

  return (
    <div className="flex h-screen bg-[#F7F7F7]">
      <div className="flex-1 flex flex-col">
        <Header
          title="Create Coupon"
          subtitle="Manage and analyze your customer relationships"
        />

        <div className="flex-1 p-8 overflow-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* TABLE HEADER */}
            <div className="px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Coupon List
              </h3>

              <div className="flex items-center gap-3">
                {/* SEARCH */}
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                {/* FILTER */}
                <select
                  value={discountFilter}
                  onChange={(e) => setDiscountFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All</option>
                  <option value="10%">10%</option>
                  <option value="20%">20%</option>
                  <option value="30%">30%</option>
                  <option value="40%">40%</option>
                  <option value="50%">50%</option>
                  <option value="60%">60%</option>
                  <option value="70%">70%</option>
                </select>

                <button
                  onClick={() => navigate("/createcoupon")}
                  className="px-4 py-2 bg-[#2B5F60] text-white rounded-lg text-sm font-medium"
                >
                  + Create Coupon
                </button>
              </div>
            </div>

            {/* TABLE */}
          <div className="border-1 border-[#F0F0F0] rounded-[10px] m-[16px]">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="border-b border-gray-200 text-center">
        <tr>
          <th className="px-6 py-3">No.</th>
          <th className="px-6 py-3">Coupon Name</th>
          <th className="px-6 py-3">Max Uses Per User</th>
          <th className="px-6 py-3">Max Total Users Use</th>
          <th className="px-6 py-3">Discount Value</th>
          <th className="px-6 py-3">Expire Date</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200 text-center align-middle">
        {loading ? (
          <tr>
            <td colSpan="6" className="py-6">
              Loading...
            </td>
          </tr>
        ) : paginatedCoupons.length === 0 ? (
          <tr>
            <td colSpan="6" className="py-6">
              No data found
            </td>
          </tr>
        ) : (
          paginatedCoupons.map((coupon, index) => (
            <tr key={coupon._id}>
              <td className="px-6 py-4">
                {startIndex + index + 1}
              </td>
              <td className="px-6 py-4">
                {coupon.name}
              </td>
              <td className="px-6 py-4">
                {coupon.maxUsesPerUser ?? "-"}
              </td>
              <td className="px-6 py-4">
                {coupon.maxTotalUses ?? "-"}
              </td>
              <td className="px-6 py-4">
                {coupon.discountValue}%
              </td>
              <td className="px-6 py-4">
                {new Date(coupon.expiresAt).toLocaleDateString()}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>

  {/* PAGINATION */}
  <div className="px-6 py-4 flex items-center justify-between">
    <p className="text-sm text-[#667085]">
      <span className="text-[#101828] font-medium">
        {startIndex + 1} –{" "}
        {Math.min(
          startIndex + itemsPerPage,
          filteredCoupons.length
        )}
      </span>{" "}
      of {filteredCoupons.length} Entries
    </p>

    <div className="flex items-center gap-3">
      <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm">
        1 - 4 <ChevronDown size={16} />
      </button>

      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => p - 1)}
        className="p-2 border rounded-lg disabled:opacity-50"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => p + 1)}
        className="flex items-center gap-2 px-4 py-2 border rounded-lg disabled:opacity-50"
      >
        Next <ChevronRight size={18} />
      </button>
    </div>
  </div>
</div>

          </div>
        </div>
      </div>
    </div>
  );
}
