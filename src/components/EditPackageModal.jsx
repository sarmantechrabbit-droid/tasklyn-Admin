import React, { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";

export default function EditPackageModal() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const [plan, setPlan] = useState(state?.plan || null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [features, setFeatures] = useState([]);
  const [formData, setFormData] = useState({
    packageName: "",
    shortDescription: "",
    actualPrice: "",
    discountedPrice: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!plan && !id) navigate("/subscription");
  }, [plan, id, navigate]);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id || plan) return;
      try {
        setLoadingPlan(true);
        const res = await axios.get(`http://192.168.1.18:5000/api/package/${id}`);
        setPlan(res.data);
      } catch (err) {
        console.error("Failed to fetch package:", err.response?.data || err.message);
        alert("Failed to load package");
        navigate("/subscription");
      } finally {
        setLoadingPlan(false);
      }
    };
    fetchPlan();
  }, [id, plan, navigate]);

  useEffect(() => {
    if (!plan) return;
    setFormData({
      packageName: plan.packageName || "",
      shortDescription: plan.shortDescription || "",
      actualPrice: plan.actualPrice ?? "",
      discountedPrice: plan.discountedPrice ?? "",
    });
    setFeatures(plan.features?.length ? plan.features : [""]);
  }, [plan]);

  const isProPlan = plan?.actualPrice > 0;

  const handleAddFeature = () => {
    if (features[features.length - 1]?.trim() === "") {
      alert("Please fill the previous feature before adding a new one!");
      return;
    }
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

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ FORM VALIDATION
  const validateForm = () => {
    const newErrors = {};

    // Package Name
    if (!formData.packageName.trim()) {
      newErrors.packageName = "Package name is required";
    } else if (!/^[A-Za-z ]+$/.test(formData.packageName)) {
      newErrors.packageName = "Package name must contain only letters";
    } else if (formData.packageName.length > 50) {
      newErrors.packageName = "Package name must not exceed 50 characters";
    }

    // Short Description
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Short description is required";
    } else if (!/^[A-Za-z ]+$/.test(formData.shortDescription)) {
      newErrors.shortDescription = "Short description must contain only letters";
    } else if (formData.shortDescription.length > 50) {
      newErrors.shortDescription = "Short description must not exceed 50 characters";
    }

    // Actual & Discounted Price Validation
    if (isProPlan) {
      // Actual Price
      if (!formData.actualPrice.toString().trim()) {
        newErrors.actualPrice = "Actual price is required";
      } else if (isNaN(formData.actualPrice) || Number(formData.actualPrice) <= 0) {
        newErrors.actualPrice = "Must be a number greater than 0";
      }

      // Discounted Price
      if (!formData.discountedPrice.toString().trim()) {
        newErrors.discountedPrice = "Discounted price is required";
      } else if (isNaN(formData.discountedPrice) || Number(formData.discountedPrice) <= 0) {
        newErrors.discountedPrice = "Must be a number greater than 0";
      } else if (Number(formData.discountedPrice) >= Number(formData.actualPrice)) {
        newErrors.discountedPrice = "Discounted price must be less than Actual Price";
      }
    }

    // Features validation
    const emptyFeatureIndex = features.findIndex((f) => f.trim() === "");
    if (emptyFeatureIndex !== -1) {
      newErrors.features = `Feature #${emptyFeatureIndex + 1} cannot be empty`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        packageName: formData.packageName,
        shortDescription: formData.shortDescription,
        features,
      };

      if (isProPlan) {
        payload.actualPrice = Number(formData.actualPrice);
        payload.discountedPrice = Number(formData.discountedPrice);
      }

      await axios.put(
        `http://192.168.1.18:5000/api/package/${plan._id}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("✅ Plan updated successfully");
      navigate("/subscription");
    } catch (error) {
      console.error("UPDATE ERROR:", error.response?.data || error.message);
      alert("❌ Failed to update package");
    }
  };

  const handleCancel = () => navigate("/subscription");

  if (loadingPlan) return null;

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
        <div className="flex items-center justify-between mb-6 border-b pb-6">
          <h2 className="text-2xl font-bold">Edit Package</h2>
          <button onClick={handleCancel}><X size={24} /></button>
        </div>

        <div className="space-y-5">
          {/* Package Name */}
          <InputField
            label="Package Name"
            name="packageName"
            value={formData.packageName}
            onChange={handleInputChange}
            error={errors.packageName}
            placeholder="Package Name"
          />

          {/* Short Description */}
          <InputField
            label="Short Description"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            error={errors.shortDescription}
            placeholder="Short Description"
          />

          {/* Prices */}
          {isProPlan && (
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Actual Price"
                name="actualPrice"
                value={formData.actualPrice}
                onChange={handleInputChange}
                error={errors.actualPrice}
                placeholder="Actual Price"
              />
              <InputField
                label="Discounted Price"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleInputChange}
                error={errors.discountedPrice}
                placeholder="Discounted Price (less than Actual Price)"
              />
            </div>
          )}

          {/* Features */}
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
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className={`flex-1 px-4 py-2.5 border rounded-lg ${
                    errors.features ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={`Feature #${index + 1}`}
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
            {errors.features && <p className="text-red-500 text-xs mt-1">{errors.features}</p>}
          </div>
        </div>

        {/* Action Buttons */}
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

// Reusable InputField Component
function InputField({ label, name, value, onChange, error, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
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
