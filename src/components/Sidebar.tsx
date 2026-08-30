import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  UserCheck, 
  BookOpen, 
  BarChart3, 
  Bell, 
  Settings, 
  ListOrdered, 
  HelpCircle, 
  Shield, 
  Radio,
  Sparkles,
  CheckSquare,
  Zap,
  Cpu,
  Brain
} from 'lucide-react';

export type TabType = 
  | 'dashboard' 
  | 'tasks'
  | 'customers'
  | 'conversations'
  | 'leads'
  | 'automation_rules'
  | 'analytics' 
  | 'knowledge' 
  | 'reports' 
  | 'notifications' 
  | 'settings' 
  | 'activity' 
  | 'help';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  logsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, logsCount }) => {
  const navItems = [
    { id: 'dashboard' as TabType, label: 'داشبورد', icon: LayoutDashboard },
    { id: 'tasks' as TabType, label: 'مدیریت وظایف و پیگیری', icon: CheckSquare },
    { id: 'customers' as TabType, label: 'پرونده مشتریان', icon: UserCheck },
    { id: 'conversations' as TabType, label: 'مدیریت گفتگوها', icon: MessageSquare, badge: logsCount > 0 ? logsCount : undefined },
    { id: 'leads' as TabType, label: 'قیف فروش (لیدها)', icon: Users },
    { id: 'automation_rules' as TabType, label: 'قوانین اتوماسیون', icon: Zap },
    { id: 'knowledge' as TabType, label: 'مرکز آموزش و کنترل هوش مصنوعی', icon: BookOpen },
    { id: 'reports' as TabType, label: 'گزارش‌ها و تحلیل‌ها', icon: BarChart3 },
    { id: 'notifications' as TabType, label: 'مرکز اعلانات', icon: Bell },
    { id: 'settings' as TabType, label: 'تنظیمات سیستم', icon: Settings },
    { id: 'activity' as TabType, label: 'گزارش فعالیت‌ها', icon: ListOrdered },
    { id: 'help' as TabType, label: 'راهنمای سیستم', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-[#0d1527] text-slate-200 flex flex-col shrink-0 min-h-screen border-l border-slate-800 shadow-xl select-none font-['Vazirmatn',sans-serif]">
      
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80">
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0d1527] rounded-[14px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-1">
              بیمه جم
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">دستیار هوشمند فروش و خدمات</p>
          </div>
        </div>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
        <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          منوی اصلی
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white text-blue-700' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Status Box */}
      <div className="p-4 border-t border-slate-800/80 mt-auto">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400 font-medium">وضعیت وِبهوک گفتینو</span>
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold dir-ltr">
            <Radio className="w-3.5 h-3.5 shrink-0" />
            <span>Goftino: Connected</span>
          </div>
        </div>
      </div>

    </aside>
  );
};
