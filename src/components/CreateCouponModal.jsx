import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create Coupon Modal Component
export default function CreateCouponModal() {
 const [couponForm, setCouponForm] = useState({
  name: "",
  discountValue: "",
  maxUsesPerUser: "",
  maxTotalUses: "",
  expiresAt: "",
});


  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCouponForm({
      ...couponForm,
      [e.target.name]: e.target.value,
    });
  };

  /* ======================
     SAVE COUPON USING API
  ======================= */
  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        name: couponForm.name,
        maxUsesPerUser: Number(couponForm.maxUsesPerUser),
        maxTotalUses: Number(couponForm.maxTotalUsers),
        discountValue: Number(couponForm.discountValue),
        expiresAt: couponForm.expireDate,
      };

      await axios.post(
        "http://192.168.1.18:5000/api/coupons",
        payload
      );

      alert("✅ Coupon created successfully");

      // Reset form
      setCouponForm({
        name: "",
        maxUsesPerUser: "",
        maxTotalUsers: "",
        discountValue: "",
        expireDate: "",
      });

      navigate("/coupon");
    } catch (error) {
      console.error("Create Coupon Error:", error);
      alert(
        error.response?.data?.message ||
          "❌ Failed to create coupon"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/coupon");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with minimal blur */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={handleCancel}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Create Coupon
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Coupon Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Name
            </label>
            <input
              type="text"
              name="name"
              value={couponForm.name}
              onChange={handleInputChange}
              placeholder="Enter Coupon Name"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Max Uses Per User */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Uses Per User
            </label>
            <input
              type="text"
              name="maxUsesPerUser"
              value={couponForm.maxUsesPerUser}
              onChange={handleInputChange}
              placeholder="Enter Max Uses Per User"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Max Total Users Use */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Total Users Use
            </label>
            <input
              type="text"
              name="maxTotalUsers"
              value={couponForm.maxTotalUsers}
              onChange={handleInputChange}
              placeholder="Enter Max Total Users use"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Value
            </label>
            <input
              type="text"
              name="discountValue"
              value={couponForm.discountValue}
              onChange={handleInputChange}
              placeholder="Enter Discount value"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Expire Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expire Date
            </label>
            <input
              type="date"
              name="expireDate"
              value={couponForm.expireDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
