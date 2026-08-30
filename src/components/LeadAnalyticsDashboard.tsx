import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Zap, 
  Search, 
  Trash2, 
  Brain, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Clock, 
  Filter, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { GoftinoLogEntry } from '../types';

interface LeadAnalyticsProps {
  logs: GoftinoLogEntry[];
  onClearLogs: () => void;
}

export const LeadAnalyticsDashboard: React.FC<LeadAnalyticsProps> = ({ logs, onClearLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScore, setFilterScore] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const totalLogs = logs.length;
  const avgScore = totalLogs > 0 
    ? Math.round(logs.reduce((acc, curr) => acc + curr.analysis.leadScore, 0) / totalLogs) 
    : 0;

  const highIntentCount = logs.filter(l => l.analysis.leadScore >= 75).length;
  const avgResponseTime = totalLogs > 0 
    ? Math.round(logs.reduce((acc, curr) => acc + curr.responseTimeMs, 0) / totalLogs) 
    : 0;

  // Filtered Logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.client.name?.includes(searchTerm) ||
      log.client.phone?.includes(searchTerm) ||
      log.incomingMessage.includes(searchTerm) ||
      log.aiResponse.includes(searchTerm);

    if (!matchesSearch) return false;

    if (filterScore === 'high') return log.analysis.leadScore >= 75;
    if (filterScore === 'medium') return log.analysis.leadScore >= 50 && log.analysis.leadScore < 75;
    if (filterScore === 'low') return log.analysis.leadScore < 50;

    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>داشبورد تحلیل هوشمند مشتریان گفتینو (Customer Intelligence)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">تحلیل رفتار خریداران و لیدها</h2>
          <p className="text-slate-400 text-sm">پایش آنی حس و حال خریداران، نیت خرید و رتبه‌بندی لیدها توسط AI</p>
        </div>

        {totalLogs > 0 && (
          <button
            onClick={onClearLogs}
            className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all w-max"
          >
            <Trash2 className="w-4 h-4" />
            <span>پاکسازی تاریخچه چت‌ها</span>
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">کل گفتگوهای گفتینو</span>
            <MessageSquare className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{totalLogs} مکالمه</div>
          <p className="text-[11px] text-slate-500">پردازش شده توسط AI بیمه جم</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">میانگین امتیاز تبدیل خریدار</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">{avgScore} از ۱۰۰</div>
          <p className="text-[11px] text-slate-500">شاخص آمادگی خرید (Lead Quality)</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">لیدهای با احتمال خرید بالا</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300">{highIntentCount} خریدار</div>
          <p className="text-[11px] text-slate-500">امتیاز خریدار بالای ۷۵٪</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">سرعت پاسخگویی AI</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300">{avgResponseTime}ms</div>
          <p className="text-[11px] text-slate-500">کمتر از ۱ ثانیه در چت گفتینو</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            <input
              type="text"
              placeholder="جستجو در نام، شماره تلفن یا متن پیام..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-400 shrink-0">فیلتر امتیاز خریدار:</span>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setFilterScore('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterScore === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                همه ({totalLogs})
              </button>
              <button
                onClick={() => setFilterScore('high')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterScore === 'high' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                احتمال خرید بالا ({highIntentCount})
              </button>
              <button
                onClick={() => setFilterScore('medium')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterScore === 'medium' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                متوسط (نیازمند پیگیری)
              </button>
            </div>
          </div>
        </div>

        {/* Conversation Cards List */}
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 space-y-3 bg-slate-950/50 rounded-2xl border border-slate-800/80">
            <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-400 font-semibold text-sm">هیچ گفتگویی با این مشخصات یافت نشد.</p>
            <p className="text-slate-500 text-xs">در بخش شبیه‌ساز، یک پیام آزمایشی ارسال کنید.</p>
          </div>
        ) : (
          <div className="space-y-6 pt-2">
            {filteredLogs.map((log) => {
              const isHigh = log.analysis.leadScore >= 75;
              const isMed = log.analysis.leadScore >= 50 && log.analysis.leadScore < 75;

              return (
                <div
                  key={log.id}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 space-y-5 transition-all shadow-lg"
                >
                  {/* Client Header Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg">
                        {log.client.name ? log.client.name.substring(0, 1) : 'خ'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-base">{log.client.name || 'کاربر گفتینو'}</h3>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                            زمان: {log.timestamp}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                          {log.client.phone && (
                            <span className="flex items-center gap-1 dir-ltr font-mono text-slate-300">
                              <Phone className="w-3.5 h-3.5 text-emerald-400" />
                              {log.client.phone}
                            </span>
                          )}
                          {log.client.city && (
                            <span className="flex items-center gap-1 text-slate-400">
                              <MapPin className="w-3.5 h-3.5 text-rose-400" />
                              {log.client.city}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 truncate max-w-[200px]">
                            صفحه: {log.client.page || 'صفحه اصلی'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Lead Score Badge */}
                    <div className="flex items-center gap-3">
                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 block font-medium">امتیاز تبدیل (Lead Score)</span>
                        <div className={`text-base font-black px-3 py-1 rounded-xl border inline-block ${
                          isHigh
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : isMed
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        }`}>
                          {log.analysis.leadScore} از ۱۰۰
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages Exchange */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                    {/* User Incoming Message */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                        <span className="text-amber-400">پیام کاربر در گفتینو:</span>
                        <span>{log.timestamp}</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed font-medium">{log.incomingMessage}</p>
                    </div>

                    {/* AI Response Sent */}
                    <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/20 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-cyan-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          پاسخ هوشمند دستیار بیمه جم:
                        </span>
                        <span className="text-slate-400">{log.responseTimeMs}ms</span>
                      </div>
                      <p className="text-blue-100 leading-relaxed">{log.aiResponse}</p>
                    </div>
                  </div>

                  {/* AI Behavioral & Sentiment Analysis Box */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Brain className="w-4 h-4 text-purple-400" />
                        تحلیل رفتار و پیشنهاد فروش هوشمند:
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        هدف: <strong className="text-white">{log.analysis.customerIntent}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">حس و حال خریدار:</span>
                        <span className="font-bold text-slate-200">{log.analysis.sentiment}</span>
                      </div>

                      <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">بیمه / اطلاعات استخراج شده:</span>
                        <span className="font-bold text-emerald-400">
                          {log.analysis.extractedNeeds.insuranceType || 'بیمه عمومی'}
                        </span>
                      </div>

                      <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">سطح عجله:</span>
                        <span className="font-bold text-amber-400">
                          {log.analysis.extractedNeeds.urgencyLevel || 'متوسط'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs space-y-1">
                      <strong className="text-amber-300 font-bold block">اقدام پیشنهادی به کارشناسان فروش:</strong>
                      <p className="text-amber-200/90">{log.analysis.recommendedAction}</p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
