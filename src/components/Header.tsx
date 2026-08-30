import React from 'react';
import { Shield, Bot, BarChart3, BookOpen, PhoneCall, Sparkles, ShoppingBag, Radio } from 'lucide-react';

interface HeaderProps {
  activeTab: 'portal' | 'webhook' | 'analytics' | 'knowledge';
  setActiveTab: (tab: 'portal' | 'webhook' | 'analytics' | 'knowledge') => void;
  logsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, logsCount }) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Status */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div 
            onClick={() => setActiveTab('portal')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold bg-gradient-to-l from-amber-200 via-white to-blue-200 bg-clip-text text-transparent">
                  بیمه جم
                </h1>
                <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-full">
                  جمنای نسخه ۳.۶
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">سامانه هوشمند فروش بیمه و پاسخگوی گفتینو</p>
            </div>
          </div>

          {/* Goftino Status Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-full">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>وِبهوک گفتینو: <strong className="font-semibold text-emerald-300">آنلاین و فعال</strong></span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 overflow-x-auto w-full md:w-auto justify-center">
          <button
            onClick={() => setActiveTab('portal')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'portal'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>خرید و استعلام بیمه</span>
          </button>

          <button
            onClick={() => setActiveTab('webhook')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'webhook'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>وِبهوک و شبیه‌ساز گفتینو</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap relative ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>تحلیل مشتریان</span>
            {logsCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                {logsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('knowledge')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'knowledge'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>پایگاه دانش AI</span>
          </button>
        </nav>

        {/* Quick Contact & Promo */}
        <div className="hidden lg:flex items-center gap-3">
          <a 
            href="tel:02191008888" 
            className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors dir-ltr"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span>۰۲۱-۹۱۰۰۸۸۸۸</span>
          </a>
        </div>

      </div>
    </header>
  );
};
