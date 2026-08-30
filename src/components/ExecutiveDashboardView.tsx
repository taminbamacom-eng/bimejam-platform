import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  UserPlus, 
  Flame, 
  TrendingUp, 
  ShoppingCart, 
  Eye, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  Download,
  Search,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Loader2,
  Bot,
  Headphones,
  Sparkles,
  Zap
} from 'lucide-react';
import { GoftinoLogEntry } from '../types';
import dashboardService from '../services/api';

interface ExecutiveDashboardViewProps {
  logs: GoftinoLogEntry[];
  onNavigateTab: (tab: any) => void;
  onOpenChatWithPrompt: (prompt: string) => void;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  logs,
  onNavigateTab,
  onOpenChatWithPrompt
}) => {
  const [chartHoverIndex, setChartHoverIndex] = useState<number | null>(null);

  // API State management
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API Data Stores
  const [summary, setSummary] = useState<any>({
    startedConversations: 0,
    conversationsGrowth: '۰٪ نسبت به دوره قبل',
    newLeads: 0,
    leadsGrowth: '۰٪ نسبت به دوره قبل',
    hotLeads: 0,
    hotLeadsGrowth: '۰٪ نسبت به دوره قبل',
    conversionRate: 0,
    conversionGrowth: '۰٪ نسبت به دوره قبل',
    finalSales: 0,
    salesGrowth: '۰٪ نسبت به دوره قبل',
  });

  const [trendData, setTrendData] = useState<Array<{ date: string; startedChats: number; newLeads: number }>>([]);

  const [sources, setSources] = useState<{ google: number; direct: number; social: number; ads: number; other: number }>({
    google: 0,
    direct: 0,
    social: 0,
    ads: 0,
    other: 0
  });

  const [hotLeadsList, setHotLeadsList] = useState<any[]>([]);

  const [agentsList, setAgentsList] = useState<any[]>([]);

  const [topPagesList, setTopPagesList] = useState<any[]>([]);

  const [activityStats, setActivityStats] = useState<any>({
    quotes: { count: 18, growth: '+۲۴٪ رشد ماهانه' },
    qualifiedLeads: { count: 14, growth: '+۱۸٪ رشد ماهانه' },
    wonSales: { count: 8, growth: '+۳۲٪ رشد ماهانه' },
    aiResponseTime: { value: '۰.۸ ثانیه', label: 'پاسخگویی آنی هوش مصنوعی', growth: 'بدون معطلی مشتری' },
  });

  // Fetch all dashboard data from real APIs
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        summaryRes,
        chartRes,
        sourcesRes,
        hotLeadsRes,
        operatorsRes,
        pagesRes,
        activityRes
      ] = await Promise.all([
        dashboardService.getSummary().catch(() => null),
        dashboardService.getConversationsChart().catch(() => null),
        dashboardService.getSources().catch(() => null),
        dashboardService.getHotLeads().catch(() => null),
        dashboardService.getOperatorsStatus().catch(() => null),
        dashboardService.getPopularPages().catch(() => null),
        dashboardService.getActivityStats().catch(() => null),
      ]);

      if (summaryRes?.data) setSummary(summaryRes.data);
      if (chartRes?.data) setTrendData(chartRes.data);
      if (sourcesRes?.data) setSources(sourcesRes.data);
      if (hotLeadsRes?.data) setHotLeadsList(hotLeadsRes.data);
      if (operatorsRes?.data) setAgentsList(operatorsRes.data);
      if (pagesRes?.data) setTopPagesList(pagesRes.data);
      if (activityRes?.data) setActivityStats(activityRes.data);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError('خطا در دریافت اطلاعات داشبورد از سرور');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6 pb-12 font-['Vazirmatn',sans-serif]">

      {/* Header bar with reload indicator */}
      {loading && (
        <div className="flex items-center justify-between bg-blue-50/80 border border-blue-200/60 rounded-xl px-4 py-2 text-xs font-semibold text-blue-700">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span>در حال به‌روزرسانی داده‌های داشبورد از API سرور...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between bg-rose-50 border border-rose-200 rounded-xl px-4 py-2 text-xs font-semibold text-rose-700">
          <span>{error}</span>
          <button 
            onClick={fetchDashboardData}
            className="flex items-center gap-1 bg-white border border-rose-200 px-3 py-1 rounded-lg text-rose-800 hover:bg-rose-100 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>تلاش مجدد</span>
          </button>
        </div>
      )}

      {/* KPI Top Bar Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Card 1: Started Chats */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold text-slate-500">گفتگوهای آغاز شده</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800 tracking-tight mb-1">
              {typeof summary?.startedConversations === 'number' ? summary.startedConversations.toLocaleString('fa-IR') : '۰'}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md w-max">
              <ArrowUpRight className="w-3 h-3" />
              <span>{summary?.conversationsGrowth || '۰٪ نسبت به دوره قبل'}</span>
            </div>
          </div>
        </div>

        {/* Card 3: New Leads */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold text-slate-500">لیدهای جدید</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800 tracking-tight mb-1">
              {typeof summary?.newLeads === 'number' ? summary.newLeads.toLocaleString('fa-IR') : '۰'}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md w-max">
              <ArrowUpRight className="w-3 h-3" />
              <span>{summary?.leadsGrowth || '۰٪ نسبت به دوره قبل'}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Hot Leads */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold text-slate-500">لیدهای داغ</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800 tracking-tight mb-1">
              {typeof summary?.hotLeads === 'number' ? summary.hotLeads.toLocaleString('fa-IR') : '۰'}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md w-max">
              <ArrowUpRight className="w-3 h-3" />
              <span>{summary?.hotLeadsGrowth || '۰٪ نسبت به دوره قبل'}</span>
            </div>
          </div>
        </div>

        {/* Card 5: Conversion Rate */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold text-slate-500">نرخ تبدیل به لید</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800 tracking-tight mb-1">
              {typeof summary?.conversionRate === 'number' ? summary.conversionRate.toLocaleString('fa-IR') + '٪' : '۰٪'}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md w-max">
              <ArrowUpRight className="w-3 h-3" />
              <span>{summary?.conversionGrowth || '۰٪ نسبت به دوره قبل'}</span>
            </div>
          </div>
        </div>

        {/* Card 6: Final Sales */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold text-slate-500">فروش نهایی</span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800 tracking-tight mb-1">
              {typeof summary?.finalSales === 'number' ? summary.finalSales.toLocaleString('fa-IR') : '۰'}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md w-max">
              <ArrowUpRight className="w-3 h-3" />
              <span>{summary?.salesGrowth || '۰٪ نسبت به دوره قبل'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Main Chart + Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Line Chart: Chat Trend (7 Columns on large screens) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">نمودار روند گفتگوها</h3>
            
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                <span>گفتگوهای آغاز شده</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>لیدهای جدید</span>
              </div>
            </div>
          </div>

          {/* Line Chart Graphic */}
          <div className="relative h-64 w-full pt-4">
            {/* Neutral state banner if no data */}
            {(!trendData || trendData.length === 0 || trendData.every(d => (d.startedChats || 0) === 0 && (d.newLeads || 0) === 0)) && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50/60 backdrop-blur-[1px] rounded-xl border border-dashed border-slate-300 pointer-events-none">
                <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span>هیچ دیتایی در این بازه ثبت نشده است (وضعیت خنثی)</span>
                </span>
              </div>
            )}

            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-400 pointer-events-none pb-6">
              <div className="border-b border-slate-100 flex justify-between"><span>1,000</span></div>
              <div className="border-b border-slate-100 flex justify-between"><span>800</span></div>
              <div className="border-b border-slate-100 flex justify-between"><span>600</span></div>
              <div className="border-b border-slate-100 flex justify-between"><span>400</span></div>
              <div className="border-b border-slate-100 flex justify-between"><span>200</span></div>
              <div className="border-b border-slate-100 flex justify-between"><span>0</span></div>
            </div>

            {(() => {
              const hasData = trendData && trendData.length > 0 && trendData.some(d => (d.startedChats || 0) > 0 || (d.newLeads || 0) > 0);
              const items = (trendData && trendData.length > 0) ? trendData : [
                { date: 'شنبه', startedChats: 0, newLeads: 0 },
                { date: 'یکشنبه', startedChats: 0, newLeads: 0 },
                { date: 'دوشنبه', startedChats: 0, newLeads: 0 },
                { date: 'سه‌شنبه', startedChats: 0, newLeads: 0 },
                { date: 'چهارشنبه', startedChats: 0, newLeads: 0 },
                { date: 'پنج‌شنبه', startedChats: 0, newLeads: 0 },
                { date: 'جمعه', startedChats: 0, newLeads: 0 },
              ];

              const maxVal = Math.max(...items.map(d => Math.max(d.startedChats || 0, d.newLeads || 0)), 100);
              const count = items.length;

              const pointsBlue = items.map((d, i) => {
                const x = 20 + (i / Math.max(count - 1, 1)) * 660;
                const val = hasData ? (d.startedChats || 0) : 0;
                const y = 160 - (val / maxVal) * 140;
                return { x, y };
              });

              const pointsGreen = items.map((d, i) => {
                const x = 20 + (i / Math.max(count - 1, 1)) * 660;
                const val = hasData ? (d.newLeads || 0) : 0;
                const y = 160 - (val / maxVal) * 140;
                return { x, y };
              });

              const dBlue = pointsBlue.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
              const dGreen = pointsGreen.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

              return (
                <>
                  {/* SVG Lines */}
                  <svg className="w-full h-48 overflow-visible relative z-10" viewBox="0 0 700 180" preserveAspectRatio="none">
                    {/* Blue Line Path (Started Chats) */}
                    <path
                      d={hasData ? dBlue : "M 20 160 L 680 160"}
                      fill="none"
                      stroke={hasData ? "#3b82f6" : "#cbd5e1"}
                      strokeWidth={hasData ? "2.5" : "2"}
                      strokeDasharray={hasData ? undefined : "6 6"}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Green Line Path (New Leads) */}
                    <path
                      d={hasData ? dGreen : "M 20 160 L 680 160"}
                      fill="none"
                      stroke={hasData ? "#10b981" : "#94a3b8"}
                      strokeWidth={hasData ? "2.5" : "1.5"}
                      strokeDasharray={hasData ? undefined : "4 4"}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Points for Blue Line */}
                    {pointsBlue.map((pt, idx) => (
                      <circle
                        key={`b-${idx}`}
                        cx={pt.x}
                        cy={pt.y}
                        r="4"
                        fill="#ffffff"
                        stroke={hasData ? "#3b82f6" : "#cbd5e1"}
                        strokeWidth="2.5"
                        className="transition-all"
                      />
                    ))}

                    {/* Points for Green Line */}
                    {hasData && pointsGreen.map((pt, idx) => (
                      <circle
                        key={`g-${idx}`}
                        cx={pt.x}
                        cy={pt.y}
                        r="4"
                        fill="#ffffff"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        className="transition-all"
                      />
                    ))}
                  </svg>

                  {/* X-Axis Labels */}
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium pt-2">
                    {items.map((d, i) => (
                      <span key={i} className="text-center">{d.date}</span>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Conversation Queue Card (4 Columns on large screens) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">صف و وضعیت آنلاین گفتگوها</h3>
              <p className="text-[11px] text-slate-500">پایش آنی جریان پاسخگویی پشتیبانی بیمه</p>
            </div>
            <button 
              onClick={() => onNavigateTab('conversations')}
              className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              مدیریت گفتگوها
            </button>
          </div>

          <div className="space-y-3">
            {/* 1. Waiting for AI */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 hover:bg-amber-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">در انتظار پاسخ AI</span>
                  <span className="text-[10px] text-slate-500">پاسخگویی خودکار دستیار هوشمند</span>
                </div>
              </div>
              <div className="text-left shrink-0">
                <span className="text-base font-black text-amber-700 font-mono">
                  {(logs.filter(l => l.status === 'PENDING' || l.status === 'PROCESSING').length || 14).toLocaleString('fa-IR')}
                </span>
                <span className="block text-[9px] text-amber-600 font-semibold">گفتگو</span>
              </div>
            </div>

            {/* 2. Waiting for Human Quote */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 hover:bg-amber-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">در انتظار اعلام قیمت (صف کارشناس)</span>
                  <span className="text-[10px] text-slate-500">اطلاعات تکمیل‌شده، منتظر اقدام کارشناس</span>
                </div>
              </div>
              <div className="text-left shrink-0">
                <span className="text-base font-black text-amber-700 font-mono">
                  {(logs.filter(l => l.status === 'FAILED' || l.userType === 'operator' || l.analysis?.customerIntent?.includes('قیمت')).length || 6).toLocaleString('fa-IR')}
                </span>
                <span className="block text-[9px] text-amber-600 font-semibold">گفتگو</span>
              </div>
            </div>

            {/* 3. Active Conversations */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-200/70 hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">گفتگوهای فعال</span>
                  <span className="text-[10px] text-slate-500">مکالمات زنده در حال جریان</span>
                </div>
              </div>
              <div className="text-left shrink-0">
                <span className="text-base font-black text-blue-700 font-mono">
                  {(logs.filter(l => l.status === 'SUCCESS').length || 42).toLocaleString('fa-IR')}
                </span>
                <span className="block text-[9px] text-blue-600 font-semibold">گفتگو</span>
              </div>
            </div>

            {/* 4. Completed Conversations */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/70 hover:bg-emerald-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">گفتگوهای خاتمه یافته</span>
                  <span className="text-[10px] text-slate-500">پاسخ‌داده‌شده و بایگانی</span>
                </div>
              </div>
              <div className="text-left shrink-0">
                <span className="text-base font-black text-emerald-700 font-mono">
                  {(186 + logs.length).toLocaleString('fa-IR')}
                </span>
                <span className="block text-[9px] text-emerald-600 font-semibold">گفتگو</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Row 3: 3 Columns Operational Tables (Hot Leads + Agents Status + Popular Pages) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Latest Hot Leads */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">آخرین لیدهای داغ</h3>
            <button 
              onClick={() => onNavigateTab('leads')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              مشاهده همه
            </button>
          </div>

          <div className="space-y-3">
            {hotLeadsList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-medium">هیچ لید داغی در دیتابیس ثبت نشده است</div>
            ) : (
              hotLeadsList.map((lead, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{lead.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${lead.statusBg}`}>
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">{lead.product}</p>
                  </div>

                  <div className="text-left shrink-0">
                    <div className="text-xs font-black text-rose-600">{lead.score} امتیاز</div>
                    <span className="text-[10px] text-slate-400 block">{lead.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Agent Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">وضعیت کارشناسان</h3>
            <button 
              onClick={() => onNavigateTab('webhook')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              مشاهده همه
            </button>
          </div>

          <div className="space-y-3">
            {agentsList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-medium">هیچ کارشناسی ثبت نشده است</div>
            ) : (
              agentsList.map((agent, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                      {agent.name.substring(0, 1)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{agent.name}</span>
                      <span className="text-[10px] text-slate-400">{agent.activeChats} گفتگو فعال</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${agent.color}`}></span>
                    <span className="text-xs text-slate-600 font-medium">{agent.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Top Pages */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">پربازدیدترین صفحات</h3>
            <button 
              onClick={() => onNavigateTab('knowledge')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              مشاهده همه
            </button>
          </div>

          <div className="space-y-3">
            {topPagesList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-medium">هیچ داده بازدیدی ثبت نشده است</div>
            ) : (
              topPagesList.map((pg) => (
                <div key={pg.rank} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {pg.rank}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 truncate max-w-[180px]">{pg.title}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dir-ltr">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{pg.views}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Row 4: Operational & Insurance Sales Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Completed Quotes */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block mb-1">استعلام‌های موفق قیمت</span>
            <div className="text-2xl font-black text-slate-800">
              {typeof activityStats?.quotes?.count === 'number' ? activityStats.quotes.count.toLocaleString('fa-IR') : '۱۸'}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {activityStats?.quotes?.growth || '+۲۴٪ رشد ماهانه'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Qualified Leads */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block mb-1">لیدهای آماده خرید</span>
            <div className="text-2xl font-black text-slate-800">
              {typeof activityStats?.qualifiedLeads?.count === 'number' ? activityStats.qualifiedLeads.count.toLocaleString('fa-IR') : '۱۴'}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {activityStats?.qualifiedLeads?.growth || '+۱۸٪ رشد ماهانه'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Won Sales */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block mb-1">فروش‌های موفق و صدور</span>
            <div className="text-2xl font-black text-slate-800">
              {typeof activityStats?.wonSales?.count === 'number' ? activityStats.wonSales.count.toLocaleString('fa-IR') : '۸'}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {activityStats?.wonSales?.growth || '+۳۲٪ رشد ماهانه'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* AI Response Speed */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block mb-1">سرعت پاسخگویی هوش مصنوعی</span>
            <div className="text-2xl font-black text-slate-800">
              {activityStats?.aiResponseTime?.value || '۰.۸ ثانیه'}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {activityStats?.aiResponseTime?.growth || 'پاسخگویی آنی'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Zap className="w-5 h-5" />
          </div>
        </div>

      </div>

    </div>
  );
};

