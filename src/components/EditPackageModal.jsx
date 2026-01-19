import React, { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";

export default function EditPackageModal() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams(); // Optional: get _id from URL
  const [plan, setPlan] = useState(state?.plan || null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  // Features & form data
  const [features, setFeatures] = useState([]);
  const [formData, setFormData] = useState({
    packageName: "",
    shortDescription: "",
    actualPrice: "",
    discountedPrice: "",
  });

  // Redirect if no plan passed AND no id
  useEffect(() => {
    if (!plan && !id) navigate("/subscription");
  }, [plan, id, navigate]);

  // Fetch plan from API if id provided
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

  // Initialize form when plan is loaded
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

  const isProPlan = plan?.actualPrice > 0; // Use price instead of name

  const handleAddFeature = () => setFeatures([...features, ""]);
  const handleRemoveFeature = (index) => setFeatures(features.filter((_, i) => i !== index));
  const handleFeatureChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };
  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // SAVE PACKAGE
  const handleSave = async () => {
    if (!plan) return;

    try {
      const payload = {
        packageName: formData.packageName || "",
        shortDescription: formData.shortDescription || "",
        features: features.filter(Boolean),
      };

      if (isProPlan) {
        payload.actualPrice = Number(formData.actualPrice) || 0;
        payload.discountedPrice = Number(formData.discountedPrice) || 0;
      }

      console.log("PUT payload:", payload);

      const response = await axios.put(
        `http://192.168.1.18:5000/api/package/${plan._id}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("PUT response:", response.data);
      navigate("/subscription");
    } catch (error) {
      console.error("UPDATE ERROR:", error.response?.data || error.message);
      alert("Failed to update package");
    }
  };

  const handleCancel = () => navigate("/subscription");

  if (loadingPlan) return null; // Wait for plan if fetching

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
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
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
