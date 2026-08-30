import React from 'react';
import { 
  Bell, 
  Mail, 
  Calendar, 
  ChevronDown, 
  User, 
  Sparkles,
  Search,
  FlaskConical,
  LogOut
} from 'lucide-react';
import { TabType } from './Sidebar';
import { AiMode } from '../types';

interface TopHeaderProps {
  activeTab: TabType;
  aiMode?: AiMode;
  onUpdateAiMode?: (mode: AiMode) => void;
  onLogout?: () => void;
  user?: {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
  };
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  aiMode = 'TEST_MODE',
  onUpdateAiMode,
  onLogout,
  user
}) => {
  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'داشبورد مدیریتی', subtitle: 'نمای کلی عملکرد سیستم در بازه زمانی انتخاب شده' };
      case 'ai_test':
        return { title: 'کنسول تست و سنجش پاسخگویی AI', subtitle: 'محیط ارزیابی زنده پاسخ‌های هوش مصنوعی، استخراج نیازمندی‌ها و امتیازدهی لید' };
      case 'analytics':
        return { title: 'مدیریت و تحلیل لیدها', subtitle: 'ارزیابی نیت خرید مشتریان، امتیازدهی و اولویت‌بندی پیگیری' };
      case 'conversations':
        return { title: 'مدیریت گفتگوها و چت‌روم (CRM Inbox)', subtitle: 'پاسخگویی زنده به پیام‌های گفتینو، تاریخچه زمان‌بندی و انتقال به اپراتور' };
      case 'leads':
        return { title: 'قیف فروش و مدیریت فرصت‌ها (Leads Pipeline)', subtitle: 'کانبان اولویت‌بندی لیدها براساس نمره ارزیابی، منبع جذب و رشته بیمه‌ای' };
      case 'customers':
        return { title: 'مدیریت و پرونده مشتریان (Customers CRM)', subtitle: 'مشاهده سوابق کامل بازدیدها، مشخصات، نمره لید و تاریخچه پیام‌ها' };
      case 'knowledge':
        return { title: 'مرکز آموزش و کنترل هوش مصنوعی', subtitle: 'مدیریت یکپارچه دانش بیمه‌ای، قوانین هوش مصنوعی و تست زنده پاسخگویی' };
      case 'reports':
        return { title: 'گزارش‌ها و تحلیل‌های پیشرفته', subtitle: 'آمار فروش، نرخ تبدیل و عملکرد دستیار هوشمند گفتینو' };
      case 'notifications':
        return { title: 'اعلانات و هشدارها', subtitle: 'پیام‌ها و هشدارهای سیستم پشتیبانی آنلاین گفتینو' };
      case 'settings':
        return { title: 'تنظیمات سیستم', subtitle: 'پیکربندی کلیدهای API، توکن گفتینو و اتصال به هوش مصنوعی' };
      case 'activity':
        return { title: 'گزارش فعالیت‌های سیستم', subtitle: 'لاگ تمامی رویدادها، پاسخ‌ها و لاگ‌های وب‌هوک' };
      case 'help':
        return { title: 'راهنمای سیستم بیمه جم', subtitle: 'مستندات استفاده از پنل و نحوه اتصال به چت‌روم گفتینو' };
      default:
        return { title: 'داشبورد مدیریتی', subtitle: 'نمای کلی عملکرد سیستم در بازه زمانی انتخاب شده' };
    }
  };

  const pageInfo = getPageTitle();

  return (
    <header className="bg-white border-b border-slate-200/90 px-6 py-4 shadow-2xs sticky top-0 z-30 font-['Vazirmatn',sans-serif]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Page Title & Subtitle */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <span>{pageInfo.title}</span>
            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full font-semibold italic">
              نسخه ۴.۲ هوش مصنوعی
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">{pageInfo.subtitle}</p>
        </div>

        {/* User Profile & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-4 justify-between md:justify-end flex-wrap">
          
          {/* AI Mode Indicator */}
          <div className="flex items-center gap-1.5">
            {aiMode === 'TEST_MODE' ? (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>🧪 AI Test Mode (تست مود)</span>
              </span>
            ) : aiMode === 'ACTIVE' ? (
              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>🟢 هوش مصنوعی فعال</span>
              </span>
            ) : (
              <span className="bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>🔴 هوش مصنوعی خاموش</span>
              </span>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          {/* Date Picker Button */}
          <button className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="dir-ltr font-mono text-slate-800">۱۴۰۳/۰۲/۲۵ - ۱۴۰۳/۰۲/۱۸</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all">
              <Mail className="w-4 h-4" />
            </button>

            <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                      {/* User Profile Info */}
            <div className="flex items-center gap-3 pl-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-blue-100">
                {(user?.name || user?.email || 'ک').charAt(0).toUpperCase()}
              </div>

              <div className="hidden sm:block text-right">
                <span className="text-xs font-bold text-slate-800 block">
                  {user?.name || user?.email || 'کاربر'}
                </span>

                <span className="text-[10px] text-slate-400 font-medium">
                  {user?.role === 'ADMIN' ? 'مدیر سیستم' : user?.role || 'کاربر سیستم'}
                </span>
              </div>

              <button
                type="button"
                onClick={onLogout}
                title="خروج از حساب"
                aria-label="خروج از حساب"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>خروج</span>
              </button>
            </div>

        </div>


      </div>
    </header>
  );
};
