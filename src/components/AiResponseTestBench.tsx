import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  RefreshCw, 
  Brain, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  User, 
  Phone, 
  MapPin, 
  Globe, 
  FileText, 
  Star, 
  TrendingUp, 
  Clock, 
  Code2, 
  Layers, 
  HelpCircle,
  MessageSquare,
  Flame,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { GoftinoLogEntry } from '../types';

interface AiResponseTestBenchProps {
  onLogGenerated?: (log: GoftinoLogEntry) => void;
}

export const AiResponseTestBench: React.FC<AiResponseTestBenchProps> = ({ onLogGenerated }) => {
  // Input parameters
  const [promptInput, setPromptInput] = useState('سلام، برای بیمه بدنه خودروی تارا ۱۴۰۲ با ۵۰٪ تخفیف چقدر میشه؟ آیا بازدید در محل مشتری دارین؟');
  const [clientName, setClientName] = useState('علیرضا شریفی');
  const [clientPhone, setClientPhone] = useState('۰۹۱۲۳۴۵۶۷۸۹');
  const [clientCity, setClientCity] = useState('تهران');
  const [clientPage, setClientPage] = useState('https://bimehjam.ir/body-insurance');

  // Execution State
  const [isLoading, setIsLoading] = useState(false);
  const [resultLog, setResultLog] = useState<GoftinoLogEntry | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Sample Test Cases
  const samplePrompts = [
    {
      title: 'استعلام ثالث و اقساط دنا پلاس',
      prompt: 'سلام، قیمت بیمه شخص ثالث دنا پلاس مدل ۱۴۰۱ با ۲ سال تخفیف عدم خسارت چقدر میشه؟ اقساط هم دارین؟',
      category: 'ثالث و بدنه'
    },
    {
      title: 'درمان انفرادی و دوره انتظار زایمان',
      prompt: 'سلام وقت بخیر، آیا بیمه درمان انفرادی زایمان رو پوشش میده؟ دوره انتظارش چقدره و شرایط پرداختش چجوریه؟',
      category: 'درمان تکمیلی'
    },
    {
      title: 'بیمه آتش‌سوزی و سرقت کارگاه',
      prompt: 'درود، برای بیمه آتش‌سوزی، زلزله و سرقت کارگاه صنعتی ۲۰۰ متری تو کرج چه شرایطی دارین؟ تخفیف هم میدین؟',
      category: 'آتش‌سوزی و مسئولیت'
    },
    {
      title: 'استعلام پوشش زلزله و آتش‌سوزی',
      prompt: 'سلام، آیا پوشش زلزله و انفجار هم به بیمه آتش‌سوزی ساختمان مسکونی اضافه میشه و شرایط اقساطش چیه؟',
      category: 'آتش‌سوزی و زلزله'
    },
    {
      title: 'سوال غیرمرتبط جهت ارزیابی هوش مصنوعی',
      prompt: 'ساعت کاری صرافی یا قیمت امروز طلا چقدره؟ شما خریدار خودرو هم دارین؟',
      category: 'چالش سیستم'
    }
  ];

  const handleRunTest = async () => {
    if (!promptInput.trim() || isLoading) return;
    setIsLoading(true);
    setResultLog(null);

    try {
      const response = await fetch('/api/goftino/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageText: promptInput,
          clientName,
          clientPhone,
          clientCity,
          clientPage
        })
      });

      const data = await response.json();
      if (data.success && data.result) {
        setResultLog(data.result);
        if (onLogGenerated) onLogGenerated(data.result);
      }
    } catch (err) {
      console.error('Error running AI response test:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyResponse = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 font-['Vazirmatn',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>محیط تست و ارزیابی هوش مصنوعی (AI Response Workbench)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">کنسول تست و سنجش پاسخگویی AI بیمه جم</h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              در این بخش می‌توانید سناریوها، سوالات و چالش‌های مختلف خریداران بیمه را وارد کرده و نحوه پاسخگویی، استخراج نیازمندی‌ها و امتیازدهی لید توسط هوش مصنوعی را به صورت زنده ارزیابی کنید.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center">
              <span className="text-2xl font-black text-amber-400 block">GPT-5</span>
              <span className="text-[10px] text-slate-300 font-medium block">موتور هوش مصنوعی OpenAI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Test Case Selector */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>سناریوهای آماده و تست‌های نمونه:</span>
          </h3>
          <span className="text-xs text-slate-400">جهت درج سریع کلیک کنید</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {samplePrompts.map((sc, i) => (
            <button
              key={i}
              onClick={() => {
                setPromptInput(sc.prompt);
              }}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 transition-all text-right space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                  {sc.category}
                </span>
                <span className="text-[10px] text-slate-400">تست #{i + 1}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                {sc.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {sc.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Test Input Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">ورودی تست پیام خریدار و اطلاعات متادیتا</h3>
              <p className="text-xs text-slate-500">مشخصات و سوال مشتری را تنظیم نموده و دکمه اجرای تست را بفشارید</p>
            </div>
          </div>
        </div>

        {/* Customer Context Metadata Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>نام فرضی مشتری:</span>
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>شماره تماس:</span>
            </label>
            <input
              type="text"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              <span>شهر و موقعیت:</span>
            </label>
            <input
              type="text"
              value={clientCity}
              onChange={(e) => setClientCity(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              <span>صفحه بازدید شده:</span>
            </label>
            <input
              type="text"
              value={clientPage}
              onChange={(e) => setClientPage(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-blue-600 dir-ltr text-left"
            />
          </div>
        </div>

        {/* Prompt Input Area */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              متن سوال یا چالش خریدار جهت ارزیابی پاسخ هوش مصنوعی:
            </span>
            <span className="text-[11px] text-slate-400 font-normal">تعداد کاراکتر: {promptInput.length}</span>
          </label>
          <textarea
            rows={4}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="سوال یا پیام خریدار را اینجا بنویسید..."
            className="w-full bg-slate-50 border border-slate-300 focus:bg-white rounded-2xl p-4 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 leading-relaxed shadow-inner"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>پاسخگویی بر اساس قوانین مصوب و پایگاه دانش بیمه جم</span>
          </div>

          <button
            onClick={handleRunTest}
            disabled={isLoading || !promptInput.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-md transition-all hover:shadow-lg disabled:opacity-50 text-xs sm:text-sm"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>در حال تحلیل و تولید پاسخ با GPT-5...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>ارسال و سنجش پاسخ AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Output Section */}
      {resultLog && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* AI Generated Answer Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">پاسخ رسمی تولیدشده توسط هوش مصنوعی</h3>
                  <p className="text-xs text-slate-500">متن آماده جهت ارسال در چت‌روم گفتینو</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1 rounded-full">
                  زمان پاسخگویی: {resultLog.responseTimeMs} میلی‌ثانیه
                </span>
                <button
                  onClick={() => copyResponse(resultLog.aiResponse)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>کپی شد</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>کپی متن</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Response Box */}
            <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-['Vazirmatn'] shadow-inner">
              {resultLog.aiResponse}
            </div>
          </div>

          {/* Customer Intelligence & Needs Extraction */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">تحلیل هوشمند نیت مشتری و فیلترهای استخراج‌شده</h3>
                  <p className="text-xs text-slate-500">استخراج دقیق نوع بیمه، تخفیف‌ها، خودرو و اولویت‌های خریدار</p>
                </div>
              </div>

              {/* Lead Score Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">امتیاز ارزیابی خرید:</span>
                <span className={`text-sm font-black px-4 py-1.5 rounded-full border ${
                  resultLog.analysis.leadScore >= 75
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : resultLog.analysis.leadScore >= 50
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {resultLog.analysis.leadScore} از ۱۰۰
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs text-slate-500 font-bold block">حس و حال خریدار (Sentiment):</span>
                <span className="text-sm font-black text-slate-800 block">{resultLog.analysis.sentiment}</span>
                <p className="text-[11px] text-slate-500">ارزیابی بر اساس واژگان، لحن و فوریت مشتری</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs text-slate-500 font-bold block">هدف اصلی گفتگو (Customer Intent):</span>
                <span className="text-sm font-black text-blue-700 block">{resultLog.analysis.customerIntent}</span>
                <p className="text-[11px] text-slate-500">موضوع محوری استعلام یا سوال مطرح‌شده</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs text-slate-500 font-bold block">نوع بیمه‌نامه درخواستی:</span>
                <span className="text-sm font-black text-emerald-700 block">
                  {resultLog.analysis.extractedNeeds.insuranceType || 'مشخص نشده'}
                </span>
                <p className="text-[11px] text-slate-500">رشته بیمه‌ای مربوطه</p>
              </div>

            </div>

            {/* Extracted Requirements Pills */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-indigo-600" />
                <span>اطلاعات جزئی استخراج‌شده از متن پیام:</span>
              </h4>

              <div className="flex flex-wrap gap-2 text-xs">
                {(resultLog.analysis.extractedNeeds as any).vehicleOrPropertyDetails && (
                  <span className="bg-white text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl font-bold">
                    جزئیات مورد بیمه: <strong className="text-blue-600">{(resultLog.analysis.extractedNeeds as any).vehicleOrPropertyDetails}</strong>
                  </span>
                )}
                {(resultLog.analysis.extractedNeeds as any).budgetOrDiscountMentioned && (
                  <span className="bg-white text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl font-bold">
                    شرایط تخفیف/اقساط: <strong className="text-amber-700">{(resultLog.analysis.extractedNeeds as any).budgetOrDiscountMentioned}</strong>
                  </span>
                )}
                {resultLog.analysis.extractedNeeds.urgencyLevel && (
                  <span className="bg-white text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl font-bold">
                    سطح عجله: <strong className="text-rose-600">{resultLog.analysis.extractedNeeds.urgencyLevel}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Actionable Sales Recommendation */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
              <span className="font-extrabold text-amber-800 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                پیشنهاد اقدام پیگیری جهت ارجاع به اپراتور بیمه جم:
              </span>
              <p className="text-amber-900 leading-relaxed font-medium">
                {resultLog.analysis.recommendedAction}
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
