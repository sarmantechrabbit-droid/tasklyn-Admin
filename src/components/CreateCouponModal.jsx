import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateCouponModal() {
  const [couponForm, setCouponForm] = useState({
    name: "",
    discountValue: "",
    maxUsesPerUser: "",
    maxTotalUsers: "",
    expireDate: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [existingCoupons, setExistingCoupons] = useState([]);
  const navigate = useNavigate();

  // Fetch existing coupons for duplicate validation
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get("http://192.168.1.18:5000/api/coupons");
        // Extract only the coupon names
        setExistingCoupons(res.data.map(c => c.name));
      } catch (err) {
        console.error("Failed to fetch existing coupons", err);
      }
    };
    fetchCoupons();
  }, []);

  const handleInputChange = (e) => {
    setCouponForm({
      ...couponForm,
      [e.target.name]: e.target.value,
    });
  };

  // Helper to normalize coupon names for duplicate check
  const normalizeName = (name) => name.replace(/\s+/g, "").toLowerCase();

  // ✅ FORM VALIDATION
  const validateForm = () => {
    const newErrors = {};

    // Coupon Name
    if (!couponForm.name.trim()) {
      newErrors.name = "Coupon name is required";
    } else if (!/^[A-Za-z ]+$/.test(couponForm.name)) {
      newErrors.name = "Coupon name must contain only letters";
    } else if (couponForm.name.length > 50) {
      newErrors.name = "Coupon name must not exceed 50 characters";
    } else {
      // Duplicate check
      const normalizedNewName = normalizeName(couponForm.name);
      const isDuplicate = existingCoupons.some(
        (existing) => normalizeName(existing) === normalizedNewName
      );
      if (isDuplicate) {
        newErrors.name = "Coupon name already exists";
      }
    }

    // Max Uses Per User
    if (!couponForm.maxUsesPerUser.trim()) {
      newErrors.maxUsesPerUser = "Max uses per user is required";
    } else if (isNaN(couponForm.maxUsesPerUser)) {
      newErrors.maxUsesPerUser = "Must be a number";
    } else if (Number(couponForm.maxUsesPerUser) <= 0) {
      newErrors.maxUsesPerUser = "Must be greater than 0";
    }

    // Max Total Users
    if (!couponForm.maxTotalUsers.trim()) {
      newErrors.maxTotalUsers = "Max total uses is required";
    } else if (isNaN(couponForm.maxTotalUsers)) {
      newErrors.maxTotalUsers = "Must be a number";
    } else if (Number(couponForm.maxTotalUsers) <= 0) {
      newErrors.maxTotalUsers = "Must be greater than 0";
    }

    // Discount Value
    if (!couponForm.discountValue.trim()) {
      newErrors.discountValue = "Discount value is required";
    } else {
      const discount = Number(couponForm.discountValue);
      if (isNaN(discount)) {
        newErrors.discountValue = "Must be a number";
      } else if (discount <= 0) {
        newErrors.discountValue = "Must be greater than 0";
      } else if (discount > 99) {
        newErrors.discountValue = "Must not exceed 99%";
      }
    }

    // Expire Date
    if (!couponForm.expireDate.trim()) newErrors.expireDate = "Expire date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ======================
     SAVE COUPON USING API
  ======================= */
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        name: couponForm.name,
        maxUsesPerUser: Number(couponForm.maxUsesPerUser),
        maxTotalUses: Number(couponForm.maxTotalUsers),
        discountValue: Number(couponForm.discountValue),
        expiresAt: couponForm.expireDate,
      };

      await axios.post("http://192.168.1.18:5000/api/coupons", payload);

      alert("✅ Coupon created successfully");

      // Clear form
      setCouponForm({
        name: "",
        discountValue: "",
        maxUsesPerUser: "",
        maxTotalUsers: "",
        expireDate: "",
      });
      setErrors({});

      // Refresh existing coupons for live validation
      const res = await axios.get("http://192.168.1.18:5000/api/coupons");
      setExistingCoupons(res.data.map(c => c.name));

      navigate("/coupon");
    } catch (error) {
      console.error("Create Coupon Error:", error);
      alert(error.response?.data?.message || "❌ Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/coupon");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={handleCancel}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Create Coupon</h2>
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <InputField
            label="Coupon Name"
            name="name"
            value={couponForm.name}
            onChange={handleInputChange}
            error={errors.name}
            placeholder="Enter Coupon Name (letters only)"
          />

          <InputField
            label="Max Uses Per User"
            name="maxUsesPerUser"
            value={couponForm.maxUsesPerUser}
            onChange={handleInputChange}
            error={errors.maxUsesPerUser}
            placeholder="Enter Max Uses Per User"
          />

          <InputField
            label="Max Total Users Use"
            name="maxTotalUsers"
            value={couponForm.maxTotalUsers}
            onChange={handleInputChange}
            error={errors.maxTotalUsers}
            placeholder="Enter Max Total Users Use"
          />

          <InputField
            label="Discount Value"
            name="discountValue"
            value={couponForm.discountValue}
            onChange={handleInputChange}
            error={errors.discountValue}
            placeholder="Enter Discount Value (0-99)"
          />

          <InputField
            label="Expire Date"
            name="expireDate"
            value={couponForm.expireDate}
            onChange={handleInputChange}
            type="date"
            error={errors.expireDate}
          />
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

// Reusable Input Field Component
function InputField({ label, name, value, onChange, error, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all focus:ring-2 ${
          error ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-teal-500"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
