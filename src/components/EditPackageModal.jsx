import React, { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function EditPackageModal() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // ✅ full plan object
  const plan = state?.plan;

  // ✅ redirect safely
  useEffect(() => {
    if (!plan) {
      navigate("/subscription");
    }
  }, [plan, navigate]);

  if (!plan) return null;

  const isProPlan =
    plan?.packageName?.toLowerCase().includes("pro");

  const [features, setFeatures] = useState([]);
  const [formData, setFormData] = useState({
    packageName: "",
    shortDescription: "",
    actualPrice: "",
    discountedPrice: "",
  });

  // ✅ prefill data
  useEffect(() => {
    setFormData({
      packageName: plan.packageName || "",
      shortDescription: plan.shortDescription || "",
      actualPrice: plan.actualPrice || "",
      discountedPrice: plan.discountedPrice || "",
    });

    setFeatures(plan.features || []);
  }, [plan]);

  const handleAddFeature = () => {
    setFeatures([...features, ""]);
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ SAVE → UPDATE BACKEND
  const handleSave = async () => {
    try {
      const payload = {
        packageName: formData.packageName,
        shortDescription: formData.shortDescription,
        features: features.filter(Boolean),
      };

      if (isProPlan) {
        payload.actualPrice = Number(formData.actualPrice);
        payload.discountedPrice = Number(formData.discountedPrice);
      }

      await axios.put(
        `http://192.168.1.18:5000/api/package/${plan._id}`,
        payload
      );

      navigate("/subscription");
    } catch (error) {
      console.error(
        "UPDATE ERROR:",
        error.response?.data || error.message
      );
      alert("Failed to update package");
    }
  };

  const handleCancel = () => {
    navigate("/subscription");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleCancel}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex w-full items-center justify-between mb-6 border-b border-[#E8EAED] pb-[25px]">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Package
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Package Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package Name
            </label>
            <input
              type="text"
              name="packageName"
              value={formData.packageName}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border rounded-lg"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border rounded-lg"
            />
          </div>

          {/* PRO PRICE */}
          {isProPlan && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actual Price
                </label>
                <input
                  type="text"
                  name="actualPrice"
                  value={formData.actualPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discounted Price
                </label>
                <input
                  type="text"
                  name="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Features */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Features
              </label>
              <button
                onClick={handleAddFeature}
                className="text-teal-600 text-sm flex items-center gap-1"
              >
                <Plus size={16} /> Add Feature
              </button>
            </div>

            {features.map((feature, index) => (
              <input
                key={index}
                type="text"
                value={feature}
                onChange={(e) =>
                  handleFeatureChange(index, e.target.value)
                }
                className="w-full px-4 py-2.5 border rounded-lg mb-3"
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
