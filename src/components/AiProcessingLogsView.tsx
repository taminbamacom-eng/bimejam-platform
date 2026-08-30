import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Search, 
  Code, 
  Send, 
  Play, 
  Clock, 
  Database, 
  Zap, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Cpu
} from 'lucide-react';

interface AiLogItem {
  id: string;
  conversationId: string | null;
  customerId: string | null;
  messageId: string | null;
  step: string;
  status: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  details: string | null;
  durationMs: number | null;
  createdAt: string;
}

export const AiProcessingLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AiLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [stepFilter, setStepFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [triggering, setTriggering] = useState<boolean>(false);
  const [triggerConvId, setTriggerConvId] = useState<string>('');
  const [retryingMsgId, setRetryingMsgId] = useState<string | null>(null);

  const fetchLogsAndStats = async () => {
    setLoading(true);
    try {
      const [logsRes, statsRes] = await Promise.all([
        fetch('/api/ai/logs?limit=100'),
        fetch('/api/ai/logs/stats'),
      ]);

      const logsData = await logsRes.json();
      const statsData = await statsRes.json();

      if (logsData.success) {
        setLogs(logsData.data || []);
      }
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (err) {
      console.error('Failed to load AI logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogsAndStats();
    const interval = setInterval(fetchLogsAndStats, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerManualPipeline = async () => {
    if (!triggerConvId) return;
    setTriggering(true);
    try {
      const res = await fetch('/api/ai/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: triggerConvId, userMessage: 'تست دستی پردازش هوش مصنوعی' }),
      });
      const data = await res.json();
      if (data.success) {
        setTriggerConvId('');
        setTimeout(fetchLogsAndStats, 1000);
      }
    } catch (err) {
      console.error('Trigger manual pipeline error:', err);
    } finally {
      setTriggering(false);
    }
  };

  const handleRetryGoftino = async (log: AiLogItem) => {
    if (!log.messageId) return;
    setRetryingMsgId(log.id);
    try {
      let textToRetry = 'پاسخ هوش مصنوعی دیتابیس';
      if (log.details) {
        try {
          const parsed = JSON.parse(log.details);
          if (parsed.replyText) textToRetry = parsed.replyText;
        } catch (e) {
          textToRetry = log.details;
        }
      }

      await fetch('/api/ai/retry-goftino', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: log.messageId,
          chatId: log.conversationId || 'test_chat',
          text: textToRetry,
        }),
      });

      fetchLogsAndStats();
    } catch (err) {
      console.error('Retry error:', err);
    } finally {
      setRetryingMsgId(null);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (statusFilter !== 'ALL' && log.status !== statusFilter) return false;
    if (stepFilter !== 'ALL' && log.step !== stepFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchConv = log.conversationId?.toLowerCase().includes(q);
      const matchStep = log.step.toLowerCase().includes(q);
      const matchDetails = log.details?.toLowerCase().includes(q);
      return matchConv || matchStep || matchDetails;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> موفق
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" /> هشدار
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> خطا
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Bot className="w-3.5 h-3.5" /> اطلاعات
          </span>
        );
    }
  };

  const getStepBadgeColor = (step: string) => {
    if (step.includes('Webhook')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (step.includes('Customer') || step.includes('Conversation')) return 'bg-sky-100 text-sky-800 border-sky-200';
    if (step.includes('Prompt')) return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    if (step.includes('OpenAI')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (step.includes('Goftino')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (step.includes('Completed')) return 'bg-teal-100 text-teal-800 border-teal-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="space-y-6 font-['Vazirmatn',sans-serif]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-600" />
            لوگ‌های پردازش هوش مصنوعی (AI Processing Logs)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ردیابی گام‌به‌گام فرایند پاسخگویی هوشمند: از دریافت وِبهوک، بارگذاری دیتابیس، ساخت پرامپت، API OpenAI تا ارسال به گفتینو
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLogsAndStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            بروزرسانی
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">پایپ‌لاین‌های تکمیل‌شده</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {stats?.totalPipelinesCompleted ?? 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">گام‌های موفق (Success)</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              {stats?.totalSuccessSteps ?? 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">هشدار ارسال گفتینو (Warnings)</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">
              {stats?.totalWarningSteps ?? 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">خطاهای سیستمی (Errors)</span>
            <span className="text-2xl font-black text-rose-600 mt-1 block">
              {stats?.totalErrorSteps ?? 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Manual Test Trigger Box */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-5 rounded-2xl shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold">تست و اجرای دستی پایپ‌لاین برای یک گفتگو</span>
          </div>
          <span className="text-[11px] text-slate-400">شناسه گفتگو را وارد کرده و اجرای AI را تست کنید</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={triggerConvId}
            onChange={(e) => setTriggerConvId(e.target.value)}
            placeholder="شناسه گفتگو (conversationId مثلاً ccb1ff6f...)"
            className="flex-1 bg-slate-800/90 border border-slate-700 text-white text-xs px-4 py-2.5 rounded-xl placeholder:text-slate-500 focus:outline-none focus:border-blue-500 dir-ltr text-left"
          />
          <button
            onClick={handleTriggerManualPipeline}
            disabled={triggering || !triggerConvId}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {triggering ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            اجرای تست AI
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700">وضعیت:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">همه وضعیت‌ها</option>
              <option value="SUCCESS">موفق (SUCCESS)</option>
              <option value="INFO">اطلاعات (INFO)</option>
              <option value="WARNING">هشدار (WARNING)</option>
              <option value="ERROR">خطا (ERROR)</option>
            </select>
          </div>

          {/* Step Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">مرحله:</span>
            <select
              value={stepFilter}
              onChange={(e) => setStepFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">همه مراحل</option>
              <option value="Webhook Received">Webhook Received</option>
              <option value="Customer Loaded">Customer Loaded</option>
              <option value="Conversation Loaded">Conversation Loaded</option>
              <option value="Prompt Built">Prompt Built</option>
              <option value="OpenAI Request">OpenAI Request</option>
              <option value="OpenAI Response">OpenAI Response</option>
              <option value="Goftino Send">Goftino Send</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در شناسه یا جزئیات..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pr-9 pl-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-black text-slate-700">
            تعداد ردیف‌های یافت‌شده: {filteredLogs.length}
          </span>
          <span className="text-[11px] text-slate-400">به‌ترتیب جدیدترین زمان ثبت</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Code className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-bold">هیچ لوگ پردازشی یافت نشد.</p>
            <p className="text-xs">یک پیام در چت گفتینو ارسال کنید یا دکمه «تست و اجرای دستی» را بفشارید.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              const formattedTime = new Date(log.createdAt).toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              return (
                <div key={log.id} className="p-4 hover:bg-slate-50/80 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Step Pill */}
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-lg border ${getStepBadgeColor(log.step)}`}>
                        {log.step}
                      </span>

                      {/* Status Badge */}
                      {getStatusBadge(log.status)}

                      {/* Time & Duration */}
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formattedTime}
                      </span>

                      {log.durationMs !== null && log.durationMs > 0 && (
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {log.durationMs}ms
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Retry Goftino Button if Goftino Send step */}
                      {log.step.includes('Goftino') && log.status !== 'SUCCESS' && (
                        <button
                          onClick={() => handleRetryGoftino(log)}
                          disabled={retryingMsgId === log.id}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {retryingMsgId === log.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                          ارسال مجدد به گفتینو
                        </button>
                      )}

                      <button
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {isExpanded ? 'پنهان‌سازی جزییات' : 'مشاهده جزییات'}
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Conversation & Message Context */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dir-ltr text-left font-mono">
                    {log.conversationId && (
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        conv: <strong className="text-slate-800">{log.conversationId}</strong>
                      </span>
                    )}
                    {log.customerId && (
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        cust: <strong className="text-slate-800">{log.customerId}</strong>
                      </span>
                    )}
                    {log.messageId && (
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        msg: <strong className="text-slate-800">{log.messageId}</strong>
                      </span>
                    )}
                  </div>

                  {/* Expanded JSON / Text details */}
                  {isExpanded && (
                    <div className="mt-3 p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto dir-ltr text-left shadow-inner border border-slate-800">
                      <pre className="whitespace-pre-wrap break-words">{log.details || 'بدون جزئیات تکمیلی'}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
