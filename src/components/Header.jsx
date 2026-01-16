import { Search, Bell, ChevronDown } from "lucide-react";
import profile from '../assets/Profile.png'

export default function Header({ title, subtitle }) {
  return (
    <header
      className="
     
        bg-[#F7F7F7]
        
      "
    >
         {/* sticky top-0 z-50 */}
         <div className="flex justify-between items-center px-6 py-4 ">
      
      <div>
        <h1 className="text-[20px] font-semibold text-[#141414]">
          {title}
        </h1>
        <p className="text-[14px] text-[#6B7280]">
          {subtitle}
        </p>
      </div>

        <div className="flex items-center gap-4">
<div className="bg-white p-3 rounded-[12px] border border-[#E5E7EB]">
  <Search className="w-5 h-5 text-[#6B7280]" />
</div>
<div className="bg-white p-3 rounded-[12px] border border-[#E5E7EB]">
   <Bell className="w-5 h-5 text-[#6B7280]" />
</div>
       

         <div className="flex items-center gap-2 bg-white p-3 rounded-[12px] border border-[#E5E7EB]">
  <img
    src={profile}
    className="w-8 h-8 rounded-full"
  />

  <div className="text-sm leading-tight">
    <p className="font-medium text-[#141414]">Jacob Farrel</p>
    <p className="text-xs text-[#6B7280]">
      jacobfarrel@gmail.com
    </p>
  </div>

  <ChevronDown size={16} className="text-[#6B7280]" />
</div>

        </div>
      </div>
    </header>
  );
}
