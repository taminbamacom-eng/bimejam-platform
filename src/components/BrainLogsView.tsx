import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Search, 
  Filter, 
  Layers, 
  Database, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Bot, 
  Cpu, 
  Zap,
  Info,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { brainService } from '../services/api';

export interface BrainLogData {
  id: string;
  conversationId?: string;
  customerId?: string;
  intent: string;
  stage: string;
  missingInfo?: string;
  loadedKnowledge?: string;
  promptTokens: number;
  completionTokens: number;
  rawPrompt?: string;
  generatedReply?: string;
  validationResult: 'PASSED' | 'REJECTED' | 'REGENERATED' | string;
  validationReason?: string;
  retryCount: number;
  createdAt: string;
}

export const BrainLogsView: React.FC = () => {
  const [logs, setLogs] = useState<BrainLogData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [intentFilter, setIntentFilter] = useState<string>('ALL');
  const [resultFilter, setResultFilter] = useState<string>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [showArchDiagram, setShowArchDiagram] = useState<boolean>(true);

  useEffect(() => {
    fetchBrainLogs();
  }, []);

  const fetchBrainLogs = async () => {
    setLoading(true);
    try {
      const res = await brainService.getBrainLogs({ limit: 100 });
      if (res.data?.success && Array.isArray(res.data.data)) {
        setLogs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch Brain logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      !searchQuery ||
      log.intent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.generatedReply && log.generatedReply.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.missingInfo && log.missingInfo.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesIntent = intentFilter === 'ALL' || log.intent === intentFilter;
    const matchesResult = resultFilter === 'ALL' || log.validationResult === resultFilter;

    return matchesSearch && matchesIntent && matchesResult;
  });

  // Calculate Metrics
  const totalExecutions = logs.length;
  const passedCount = logs.filter((l) => l.validationResult === 'PASSED').length;
  const regeneratedCount = logs.filter((l) => l.validationResult === 'REGENERATED').length;
  const rejectedCount = logs.filter((l) => l.validationResult === 'REJECTED').length;
  const totalPromptTokens = logs.reduce((acc, l) => acc + (l.promptTokens || 0), 0);
  const totalCompletionTokens = logs.reduce((acc, l) => acc + (l.completionTokens || 0), 0);

  return (
    <div className="space-y-6 font-['Vazirmatn',sans-serif]">
      
      {/* Page Title & Refresh Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-200 flex items-center justify-center text-purple-700">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              مدیریت و تحلیل لایه مغز هوش مصنوعی (Brain Layer)
              <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                Enterprise Sales AI
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              نظارت بر ۷ مرحله تحلیل هوشمند شامل تشخیص نیت، تحلیل نقص اطلاعات، بازیابی دانش (RAG)، اعتبارسنجی کیفیت و بازتولید خودکار.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowArchDiagram(!showArchDiagram)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-purple-600" />
            {showArchDiagram ? 'پنهان‌سازی معماری لایه مغز' : 'مشاهده معماری لایه مغز'}
          </button>
          <button
            onClick={fetchBrainLogs}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            بروزرسانی لوگ‌ها
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>کل فراخوانی‌های مغز</span>
            <Cpu className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalExecutions}</div>
          <p className="text-[11px] text-slate-400">تعداد تحلیل و تولید پاسخ</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>پاسخ‌های استاندارد (Passed)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{passedCount}</div>
          <p className="text-[11px] text-emerald-600 font-medium">
            {totalExecutions > 0 ? Math.round((passedCount / totalExecutions) * 100) : 0}% نرخ ارسال مستقیم بدون خطا
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-purple-700">
            <span>بازتولید خودکار (Regenerated)</span>
            <RefreshCw className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700">{regeneratedCount}</div>
          <p className="text-[11px] text-purple-600 font-medium">اصلاح خودکار لحن و کیفیت</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-rose-700">
            <span>پاسخ‌های ردشده (Rejected)</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700">{rejectedCount}</div>
          <p className="text-[11px] text-rose-600 font-medium">جلوگیری از ارسال متن رباتیک</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-blue-700">
            <span>مصرف توکن (Prompt/Completion)</span>
            <Zap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg font-black text-blue-950 font-mono dir-ltr">
            {totalPromptTokens.toLocaleString()} / {totalCompletionTokens.toLocaleString()}
          </div>
          <p className="text-[11px] text-blue-600 font-medium">مجموع توکن ورودی / خروجی</p>
        </div>
      </div>

      {/* Architecture Explanation Card */}
      {showArchDiagram && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white p-6 rounded-2xl shadow-xl space-y-4 border border-purple-800/40">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold flex items-center gap-2 text-purple-300">
              <Brain className="w-5 h-5 text-amber-400" />
              معماری ۷ مرحله‌ای لایه مغز هوش مصنوعی (Brain Layer Architecture)
            </h2>
            <span className="text-xs bg-purple-500/20 text-purple-200 border border-purple-400/30 px-3 py-1 rounded-full font-mono">
              Enterprise Brain Pipeline v2.5
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl space-y-1.5">
              <span className="text-amber-400 font-bold font-mono text-[10px]">مرحله ۱</span>
              <h3 className="font-bold text-slate-100">تشخیص نیت مشتری (Intent)</h3>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                تفکیک نیت مشتری بین استعلام قیمت، مقایسه پوشش‌ها، خرید اقساطی، اعلام خسارت، تمدید بیمه‌نامه یا ارجاع به انسان.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl space-y-1.5">
              <span className="text-amber-400 font-bold font-mono text-[10px]">مرحله ۲</span>
              <h3 className="font-bold text-slate-100">شناسایی نقص اطلاعات (Missing Info)</h3>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                بررسی پارامترهای ناقص (مدل خودرو، سال ساخت، سابقه تخفیف) و تمرکز برای پرسش فقط از اقلام باقی‌مانده.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl space-y-1.5">
              <span className="text-amber-400 font-bold font-mono text-[10px]">مرحله ۳</span>
              <h3 className="font-bold text-slate-100">تشخیص مرحله لید (Customer Stage)</h3>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                ارزیابی موقعیت مشتری در قیف فروش (لید جدید، در حال مقایسه، آماده خرید، مشتری قدیمی).
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl space-y-1.5">
              <span className="text-amber-400 font-bold font-mono text-[10px]">مرحله ۴</span>
              <h3 className="font-bold text-slate-100">بازیابی هوشمند دانش (Contextual RAG)</h3>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                بارگذاری تخصصی دانش بیمه‌ای مرتبط با نیت مشتری بدون ارسال تمام دیتابیس برای بهینه‌سازی توکن.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl space-y-1.5">
              <span className="text-amber-400 font-bold font-mono text-[10px]">مرحله ۵</span>
              <h3 className="font-bold text-slate-100">ساختاردهی پرامپت (System Prompt)</h3>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                ترکیب هویت بیمه جم، قوانین لحن فارسی طبیعی، استراتژی فروش و شناسنامه کامل مشتری.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl space-y-1.5">
              <span className="text-amber-400 font-bold font-mono text-[10px]">مرحله ۶</span>
              <h3 className="font-bold text-slate-100">تولید لحن طبیعی فارسی (No Chatbot)</h3>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                تولید پاسخ کاملاً روان، صمیمی و تخصصی؛ منع کامل عبارات کلیشه‌ای رباتیک یا ارجاع تکراری "با ما تماس بگیرید".
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl space-y-1.5 col-span-1 lg:col-span-2">
              <span className="text-amber-400 font-bold font-mono text-[10px]">مرحله ۷</span>
              <h3 className="font-bold text-slate-100">اعتبارسنجی کیفیت و بازتولید خودکار (Self-Correction)</h3>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                بررسی کیفیت خروجی؛ در صورت وجود متن ارجاع کلیشه‌ای یا پاسخ رباتیک، پاسخ رد شده و پرامپت اصلاحی خودکار برای تولید مجدد ارسال می‌شود.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="جستجو در نیت، اطلاعات ناقص، متن پاسخ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Intent Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
            <Filter className="w-3.5 h-3.5 text-purple-600" />
            <span>نیت (Intent):</span>
            <select
              value={intentFilter}
              onChange={(e) => setIntentFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">همه نیت‌ها</option>
              <option value="Insurance Quotation">استعلام قیمت و نرخ</option>
              <option value="Policy Comparison">مقایسه پوشش‌ها</option>
              <option value="Installment Payment">خرید اقساطی</option>
              <option value="Claim Support">پشتیبانی و خسارت</option>
              <option value="Policy Renewal">تمدید بیمه‌نامه</option>
              <option value="General Question">سوالات عمومی</option>
              <option value="Complaint">شکایت مشتری</option>
              <option value="Human Operator Request">درخواست اپراتور</option>
            </select>
          </div>

          {/* Validation Result Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
            <span>نتیجه اعتبارسنجی:</span>
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">همه وضعیت‌ها</option>
              <option value="PASSED">تایید شده (PASSED)</option>
              <option value="REGENERATED">بازتولیدشده (REGENERATED)</option>
              <option value="REJECTED">ردشده (REJECTED)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Brain Logs List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-xs flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 text-purple-600 animate-spin" />
            <span>در حال دریافت اطلاعات لوگ‌های لایه مغز هوش مصنوعی...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
            هیچ لوگی با فیلترهای انتخابی یافت نشد.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;
            const isPassed = log.validationResult === 'PASSED';
            const isRegenerated = log.validationResult === 'REGENERATED';
            const isRejected = log.validationResult === 'REJECTED';

            return (
              <div
                key={log.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all hover:border-purple-300"
              >
                {/* Log Item Header */}
                <div
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                  className="p-4 cursor-pointer flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Validation Badge Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isPassed
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : isRegenerated
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-rose-100 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {isPassed ? (
                        <ShieldCheck className="w-5 h-5" />
                      ) : isRegenerated ? (
                        <RefreshCw className="w-4 h-4" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>

                    {/* Intent & Stage */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{log.intent}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {log.stage}
                        </span>
                        {isPassed && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ PASSED
                          </span>
                        )}
                        {isRegenerated && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                            ↻ REGENERATED ({log.retryCount} تلاش)
                          </span>
                        )}
                        {isRejected && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            ✕ REJECTED
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span>زمان: {new Date(log.createdAt).toLocaleTimeString('fa-IR')}</span>
                        {log.conversationId && (
                          <span className="font-mono text-[10px]">گفتگو: {log.conversationId.substring(0, 8)}...</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Token Info & Expand Toggle */}
                  <div className="flex items-center gap-4">
                    <div className="text-left font-mono text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      <span className="text-purple-700 font-bold">{log.promptTokens || 0}</span> in /{' '}
                      <span className="text-blue-700 font-bold">{log.completionTokens || 0}</span> out
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Log Item Expanded Details */}
                {isExpanded && (
                  <div className="p-4 bg-slate-50/60 border-t border-slate-200 space-y-4 text-xs">
                    {/* Missing Information Panel */}
                    <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-xl space-y-1">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5 text-[11px]">
                        <Info className="w-3.5 h-3.5 text-amber-700" />
                        اطلاعات ناقص شناسایی‌شده (Missing Info):
                      </span>
                      <p className="text-amber-950 font-medium text-xs">{log.missingInfo || 'اطلاعات کامل است.'}</p>
                    </div>

                    {/* Loaded Knowledge (RAG) */}
                    <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-1.5">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px]">
                        <Database className="w-3.5 h-3.5 text-purple-600" />
                        دانش بیمه‌ای بازیابی‌شده (Loaded RAG Knowledge):
                      </span>
                      <pre className="text-[11px] text-slate-600 font-sans whitespace-pre-wrap leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {log.loadedKnowledge || 'دانش عمومی بیمه جم'}
                      </pre>
                    </div>

                    {/* Generated AI Response */}
                    <div className="bg-purple-50/60 border border-purple-200 p-3.5 rounded-xl space-y-1.5">
                      <span className="font-bold text-purple-900 flex items-center gap-1.5 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        پاسخ نهایی تولیدشده توسط لایه مغز:
                      </span>
                      <p className="text-purple-950 font-medium text-xs leading-relaxed whitespace-pre-wrap">
                        {log.generatedReply || 'پاسخی ثبت نشده است.'}
                      </p>
                    </div>

                    {/* Raw System Prompt Snippet */}
                    {log.rawPrompt && (
                      <div className="bg-slate-900 text-slate-200 p-3 rounded-xl space-y-1">
                        <span className="font-bold text-amber-400 text-[10px] font-mono">سیستم پرامپت ارسالی (Snippet):</span>
                        <pre className="text-[10px] font-mono overflow-x-auto text-slate-300 whitespace-pre-wrap leading-tight">
                          {log.rawPrompt}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
