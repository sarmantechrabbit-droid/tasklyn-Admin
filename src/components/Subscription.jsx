import { Check } from "lucide-react";
import icon from "../assets/Icon.png";
import user from "../assets/User.png";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Subscription() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(
        "http://192.168.1.18:5000/api/package"
      );

      // backend returns array directly
      setPlans(res.data || []);
    } catch (error) {
      console.error("Error fetching plans", error);
    } finally {
      setLoading(false);
    }
  };

  // identify plans using packageName
  const freePlan = plans.find(
    (p) => p.packageName?.toLowerCase().includes("starter")
  );
  const proPlan = plans.find(
    (p) => p.packageName?.toLowerCase().includes("pro")
  );

  if (loading) {
    return (
      <div className="flex-1 bg-[#F7F7F7] px-6 py-5">
        <Header
          title="Subscription"
          subtitle="Manage and analyze your customer relationships"
        />
        <p className="text-center mt-10 text-sm text-gray-500">
          Loading plans...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F7F7F7] px-6 py-5">
      <Header
        title="Subscription"
        subtitle="Manage and analyze your customer relationships"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-1 p-4 border-[#E7E9E9] rounded-[19px]">
        {/* ================= FREE PLAN ================= */}
        {freePlan && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
            <div className="mb-4">
              <div className="w-9 h-9 rounded-[11px] bg-[#F6F7F7] flex items-center justify-center mb-3">
                <div className="m-auto">
                  <img src={user} alt="user" />
                </div>
              </div>

              <h3 className="font-semibold text-[#141414]">
                {freePlan.packageName}
              </h3>
              <p className="text-sm text-[#6B7280]">
                {freePlan.shortDescription}
              </p>
            </div>

            <div className="border-1 rounded-t-[10px] border-[#E7E9E9] p-[13px]">
              <div className="p-4 mb-4 border-b border-[#E7E9E9]">
                <h2 className="text-[28px] font-semibold text-[#115545]">
                  Free
                  <span className="text-sm font-normal text-[#6B7280]">
                    /month
                  </span>
                </h2>

                <button
                  onClick={() =>
                    navigate("/editplan", { state: { plan: freePlan } })
                  }
                  className="mt-3 w-full h-[39px] border rounded-[11px] py-2 text-sm font-medium"
                >
                  Edit Package
                </button>
              </div>

              <ul className="space-y-3 text-sm">
                {freePlan.features?.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-4 border-b border-[#DCDEDE] border-dashed last:border-none"
                  >
                    <Check className="w-4 h-4 text-[#22C55E] border-1 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ================= PRO PLAN ================= */}
        {proPlan && (
          <div className="relative bg-[#0F1F1C] rounded-2xl border border-[#1F3D36] p-6 text-white">
            <span className="absolute top-4 right-4 text-xs bg-[#1F3D36] px-3 py-1 rounded-full">
              Most popular
            </span>

            <div className="mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#1F3D36] flex items-center justify-center mb-3">
                <div className="m-auto">
                  <img src={icon} alt="user" />
                </div>
              </div>

              <h3 className="font-semibold">{proPlan.packageName}</h3>
              <p className="text-sm text-[#9CA3AF]">
                {proPlan.shortDescription}
              </p>
            </div>

            <div className="border-1 rounded-t-[10px] border-[#4F5857] p-4">
              <div className="bg-[#1A2F2A] rounded-t-[10px] p-4 mb-4 border-b border-[#4F5857]">
                <h2 className="text-[28px] font-semibold text-[#34D399]">
                  ${proPlan.actualPrice}
                  <span className="text-sm font-normal text-[#9CA3AF]">
                    /month
                  </span>
                </h2>

                <button
                  onClick={() =>
                    navigate("/editplan", { state: { plan: proPlan } })
                  }
                  className="mt-3 w-full bg-gradient-to-r from-[#2EB67D] to-[#1E9E6A] rounded-lg py-2 text-sm font-medium"
                >
                  Edit Package
                </button>
              </div>

              <ul className="space-y-3 text-sm">
                {proPlan.features?.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 border-b border-[#DCDEDE] border-dashed last:border-none"
                  >
                    <Check className="w-4 h-4 text-[#22C55E] border-1 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
