import React from 'react';
import { Sparkles } from 'lucide-react';

const ProCard = () => {
  return (
    <div className="bg-[#1E293B] text-white p-8 rounded-[1.5rem] relative overflow-hidden flex flex-col items-start gap-4 shadow-xl">
      {/* Visual Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#BEF264] opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      
      <div className="bg-[#BEF264] p-3 rounded-2xl text-black">
        <Sparkles size={24} />
      </div>
      
      <div className="flex flex-col gap-1">
        <h3 className="text-2xl font-bold tracking-tight">Upgrade to Pro</h3>
        <p className="text-slate-400 text-sm max-w-[200px]">
          Unlock advanced AI agent capabilities and custom branding.
        </p>
      </div>
      
      <button className="bg-[#BEF264] text-black font-semibold py-3 px-6 rounded-[0.75rem] hover:bg-[#A3D94E] transition-colors w-full mt-2">
        Get Started
      </button>
      
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
        Free 7-Day Trial
      </p>
    </div>
  );
};

export default ProCard;
