import React, { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function EditPackageModal() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const plan = state?.plan;

  useEffect(() => {
    if (!plan) navigate("/subscription");
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

  useEffect(() => {
    setFormData({
      packageName: plan.packageName || "",
      shortDescription: plan.shortDescription || "",
      actualPrice: plan.actualPrice || "",
      discountedPrice: plan.discountedPrice || "",
    });

    setFeatures(plan.features?.length ? plan.features : [""]);
  }, [plan]);

  const handleAddFeature = () => {
    setFeatures([...features, ""]);
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
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
      console.error("UPDATE ERROR:", error.response?.data || error.message);
      alert("Failed to update package");
    }
  };

  const handleCancel = () => navigate("/subscription");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleCancel}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 border-b pb-6">
          <h2 className="text-2xl font-bold">Edit Package</h2>
          <button onClick={handleCancel}>
            <X size={24} />
          </button>
        </div>

        <div className="space-y-5">
          <input
            name="packageName"
            value={formData.packageName}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border rounded-lg"
            placeholder="Package Name"
          />

          <input
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border rounded-lg"
            placeholder="Short Description"
          />

          {isProPlan && (
            <div className="grid grid-cols-2 gap-4">
              <input
                name="actualPrice"
                value={formData.actualPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border rounded-lg"
                placeholder="Actual Price"
              />
              <input
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border rounded-lg"
                placeholder="Discounted Price"
              />
            </div>
          )}

          {/* FEATURES */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Features</label>
              <button
                type="button"
                onClick={handleAddFeature}
                className="text-teal-600 text-sm flex items-center gap-1"
              >
                <Plus size={16} /> Add Feature
              </button>
            </div>

            {features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) =>
                    handleFeatureChange(index, e.target.value)
                  }
                  className="flex-1 px-4 py-2.5 border rounded-lg"
                />

                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="px-3 border rounded-lg text-red-500 hover:bg-red-50"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleCancel}
            className="flex-1 border-2 border-red-500 text-red-500 rounded-lg py-3"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-teal-600 text-white rounded-lg py-3"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
