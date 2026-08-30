import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Key,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  Save,
  Zap,
  Sliders,
  Check,
  Copy,
  Terminal,
  ShieldCheck,
} from 'lucide-react';
import { settingService } from '../services/api';

const DEFAULT_KEY = "";

export function AiModelConfigCard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  const [openaiKey, setOpenaiKey] = useState<string>('');
  const [openaiModel, setOpenaiModel] = useState<string>('gpt-5');
  const [temperature, setTemperature] = useState<number>(0.6);
  const [maxTokens, setMaxTokens] = useState<number>(1500);

  const [testResult, setTestResult] = useState<{
    success: boolean;
    provider?: string;
    modelUsed?: string;
    latencyMs?: number;
    replyText?: string;
    error?: string;
    timestamp?: string;
  } | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const res: any = await settingService.getAiConfig();
      if (res?.success && res.data) {
        const d = res.data;
        if (d.openaiApiKey) setOpenaiKey(d.openaiApiKey);
        if (d.openaiModel) setOpenaiModel(d.openaiModel);
        if (typeof d.temperature === 'number') setTemperature(d.temperature);
        if (typeof d.maxTokens === 'number') setMaxTokens(d.maxTokens);
      }
    } catch (err) {
      console.warn('Failed to load AI config, using defaults:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);

    try {
      const payload = {
        aiProvider: 'openai',
        openaiApiKey: openaiKey.trim(),
        openaiModel: openaiModel.trim(),
        temperature,
        maxTokens,
      };

      const res: any = await settingService.updateAiConfig(payload);
      if (res?.success) {
        setSaveSuccessMsg('تنظیمات مدل و کلید API چت‌جی‌پی‌تی (OpenAI) با موفقیت ذخیره شد.');
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      } else {
        setSaveErrorMsg(res?.error || 'خطا در ذخیره‌سازی تنظیمات');
      }
    } catch (err: any) {
      setSaveErrorMsg(err.message || 'خطا در برقراری ارتباط با سرور');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res: any = await settingService.testAiConnection({
        provider: 'openai',
        apiKey: openaiKey.trim(),
        model: openaiModel.trim(),
      });

      if (res?.success && res.data) {
        setTestResult({
          success: true,
          provider: 'OpenAI ChatGPT',
          modelUsed: res.data.modelUsed,
          latencyMs: res.data.latencyMs,
          replyText: res.data.replyText,
          timestamp: new Date().toLocaleTimeString('fa-IR'),
        });
      } else {
        setTestResult({
          success: false,
          error: res?.error || 'پاسخی از سرور دریافت نشد.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || 'خطا در تست اتصال با سرور OpenAI ChatGPT',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(openaiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 flex items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span className="text-xs font-bold">در حال بارگذاری تنظیمات هوش مصنوعی...</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
              <span>تنظیمات هوش مصنوعی چت‌جی‌پی‌تی (OpenAI / GPT-5)</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-black">
                GPT-5 فعال
              </span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              مدیریت موتور تولید پاسخ، انتخاب مدل فعال (GPT-5)، کلید اختصاصی API و تست زنده اتصال
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing || saving}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" /> : <RefreshCw className="w-3.5 h-3.5 text-slate-600" />}
            <span>تست اتصال مدل</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving || testing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : <Save className="w-3.5 h-3.5 text-white" />}
            <span>ذخیره تنظیمات</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {saveSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {saveErrorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 font-bold flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{saveErrorMsg}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Active Provider Card */}
        <div className="space-y-2">
          <label className="font-bold text-slate-700 block text-xs">
            ارائه‌دهنده فعال هوش مصنوعی (AI Provider)
          </label>
          <div className="p-4 rounded-xl border-2 bg-blue-50/80 border-blue-500 text-blue-950 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-sm text-blue-900">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <span>OpenAI ChatGPT</span>
                <span className="bg-blue-200 text-blue-900 text-[10px] px-2 py-0.5 rounded-md font-bold">
                  پیش‌فرض و اختصاصی سیستم
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg font-bold text-[11px]">
                <Check className="w-3.5 h-3.5" />
                <span>فعال و متصل</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              پردازش هوشمند تمامی استعلام‌ها، مکالمات و تحلیل نیاز مشتریان توسط سرویس رسمی OpenAI ChatGPT با مدل <strong>GPT-5</strong> و استدلال پیشرفته انجام می‌شود.
            </p>
          </div>
        </div>

        {/* OpenAI Key & Model Configuration */}
        <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4.5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
            <h5 className="font-bold text-slate-800 text-xs flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600" />
              <span>پیکربندی OpenAI و مدل چت‌جی‌پی‌تی (ChatGPT Settings)</span>
            </h5>
            <span className="text-[10px] text-slate-500 font-mono">OpenAI API v1</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* OpenAI API Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 text-[11px] flex items-center gap-1.5">
                  <span>کلید OpenAI API (OPENAI_API_KEY)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center gap-0.5 font-bold cursor-pointer"
                  >
                    {copiedKey ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey ? 'کپی شد' : 'کپی کلید'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="text-[10px] text-slate-500 hover:text-slate-700 flex items-center gap-0.5 cursor-pointer"
                  >
                    {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showKey ? 'مخفی' : 'نمایش'}</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 font-mono text-slate-800 dir-ltr text-[11px] outline-hidden transition-all"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                کلید API اختصاصی شما به صورت امن در دیتابیس ذخیره شده و در مکالمات و تحلیل‌ها استفاده می‌شود.
              </p>
            </div>

            {/* Model Selector */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 text-[11px] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-600" />
                <span>مدل هوش مصنوعی انتخابی (OpenAI Model)</span>
              </label>

              <select
                value={openaiModel}
                onChange={(e) => setOpenaiModel(e.target.value)}
                className="w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 font-mono text-slate-800 text-[11px] outline-hidden cursor-pointer"
              >
                <option value="gpt-5">gpt-5 (جدیدترین و باهوش‌ترین مدل OpenAI - پیش‌فرض)</option>
                <option value="gpt-4o">gpt-4o (مدل همه‌منظوره چندوجهی با سرعت و دقت بالا)</option>
                <option value="gpt-4o-mini">gpt-4o-mini (مدل کم‌مصرف، بسیار سریع و اقتصادی)</option>
                <option value="o3-mini">o3-mini (مدل تخصصی استدلال و تصمیم‌گیری مرحله‌ای)</option>
                <option value="chatgpt-4o-latest">chatgpt-4o-latest (نسخه پویا و بروزرسانی مداوم)</option>
              </select>

              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  مدل فعال: {openaiModel}
                </span>
                <span className="text-[10px] text-slate-400">پشتیبانی کامل از زبان فارسی و فرمت JSON</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hyperparameters / Advanced Tuning */}
        <div className="bg-white border border-slate-200 rounded-xl p-4.5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h5 className="font-bold text-slate-800 text-xs flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>تنظیمات پیشرفته تولید پاسخ (Hyperparameters)</span>
            </h5>
            <span className="text-[10px] text-slate-400">توصیه شده برای سناریوی بیمه</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 text-[11px]">
                  دمای پاسخ (Temperature): <span className="font-mono text-blue-700">{temperature}</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  {temperature <= 0.3 ? 'کاملاً دقیق و غیرخلاقانه' : temperature <= 0.7 ? 'متعادل و صمیمی (پیشنهادی)' : 'بسیار خلاقانه'}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Max Tokens */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 text-[11px]">
                  حداکثر طول توکن خروجی (Max Output Tokens): <span className="font-mono text-blue-700">{maxTokens}</span>
                </label>
                <span className="text-[10px] text-slate-400">حدود ۱۲۰۰ کلمه فارسی</span>
              </div>
              <input
                type="number"
                min="300"
                max="4000"
                step="100"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value, 10) || 1500)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-mono text-slate-800 dir-ltr text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Live Test Console Result */}
        {testResult && (
          <div
            className={`p-4 rounded-xl border space-y-2 animate-fade-in ${
              testResult.success
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                : 'bg-rose-50/80 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-center justify-between border-b border-current/20 pb-2 font-bold">
              <div className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>
                  {testResult.success ? 'اتصال هوش مصنوعی با موفقیت تایید شد' : 'خطا در تست اتصال'}
                </span>
              </div>
              {testResult.latencyMs && (
                <div className="text-[11px] font-mono dir-ltr">
                  زمان پاسخ: <strong>{testResult.latencyMs} ms</strong> | مدل: <strong>{testResult.modelUsed}</strong>
                </div>
              )}
            </div>

            {testResult.success && testResult.replyText && (
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                  <Terminal className="w-3 h-3" />
                  <span>پاسخ دریافتی از هوش مصنوعی:</span>
                </span>
                <div className="bg-white p-2.5 rounded-lg border border-emerald-200 text-xs text-slate-800 font-medium">
                  {testResult.replyText}
                </div>
              </div>
            )}

            {!testResult.success && testResult.error && (
              <p className="text-xs font-medium text-rose-800 leading-relaxed">
                {testResult.error}
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
