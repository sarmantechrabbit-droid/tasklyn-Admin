import { Search, Bell, Check } from "lucide-react";
import icon from '../assets/Icon.png'
import user from '../assets/User.png'

export default function Subscription() {
  return (
    <div className="flex-1 bg-[#F7F7F7] px-6 py-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-[#141414]">
            Subscription
          </h1>
          <p className="text-sm text-[#6B7280]">
            Manage and analyze your customer relationships
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-9 h-9 bg-white rounded-lg border flex items-center justify-center">
            <Search size={18} />
          </button>
          <button className="w-9 h-9 bg-white rounded-lg border flex items-center justify-center">
            <Bell size={18} />
          </button>

          <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2">
            <img
              src="https://i.pravatar.cc/40"
              className="w-8 h-8 rounded-full"
            />
            <div className="text-sm leading-tight">
              <p className="font-medium">Jacob Farrel</p>
              <p className="text-xs text-[#6B7280]">
                jacobfarrel@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-1 p-4 border-[#E7E9E9] rounded-[19px]">

        {/* Free Plan */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
          <div className="mb-4">
            <div className="w-9 h-9 rounded-[11px] bg-[#F8F9F9] flex items-center justify-center mb-3">
                <div className="bg-white m-auto">
                <img src={user} alt="user" />
                </div>
              {/* <Search size={16} className="" /> */}
            </div>

            <h3 className="font-semibold text-[#141414]">
              Starter plan
            </h3>
            <p className="text-sm text-[#6B7280]">
              Limited access to basic features
            </p>
          </div>

          <div className="border rounded-xl p-4 mb-4">
            <h2 className="text-[28px] font-semibold text-[#115545]">
              Free
              <span className="text-sm font-normal text-[#6B7280]">
                {" "} /month
              </span>
            </h2>

            <button className="mt-3 w-full border rounded-lg py-2 text-sm font-medium">
              Edit Package
            </button>
          </div>

          <ul className="space-y-3 text-sm">
            {[
              "1,000 contacts",
              "Up to 10,000 emails/month",
              "AI-Content (Email Only)",
              "Basic stats (open rate, CTR)",
              "A/B testing (1 variant only)",
              "Basic reports",
              "Email support (48h response time)",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#22C55E]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="relative bg-[#0F1F1C] rounded-2xl border border-[#1F3D36] p-6 text-white">

          {/* Badge */}
          <span className="absolute top-4 right-4 text-xs bg-[#1F3D36] px-3 py-1 rounded-full">
            Most popular
          </span>

          <div className="mb-4">
            <div className="w-9 h-9 rounded-lg bg-[#1F3D36] flex items-center justify-center mb-3">
              <Search size={16} />
            </div>

            <h3 className="font-semibold">Pro plan</h3>
            <p className="text-sm text-[#9CA3AF]">
              Full access to all premium features
            </p>
          </div>

          <div className="bg-[#1A2F2A] rounded-xl p-4 mb-4">
            <h2 className="text-[28px] font-semibold text-[#34D399]">
              $32.00
              <span className="text-sm font-normal text-[#9CA3AF]">
                {" "} /month
              </span>
            </h2>

            <button className="mt-3 w-full bg-gradient-to-r from-[#2EB67D] to-[#1E9E6A] rounded-lg py-2 text-sm font-medium">
              Edit Package
            </button>
          </div>

          <ul className="space-y-3 text-sm">
            {[
              "5,000 contacts",
              "Up to 50,000 emails/month",
              "AI-Content (Full Access)",
              "Smart insights & timing suggestions",
              "A/B testing (2 variants)",
              "Advanced reports",
              "Up to 3 team members",
              "Email support (48h response time)",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#22C55E]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
