import React, { useState } from 'react';
import { 
  Car, 
  ShieldCheck, 
  HeartPulse, 
  Flame, 
  TrendingUp, 
  Plane, 
  Calculator, 
  CheckCircle2, 
  Zap, 
  Sparkles, 
  ArrowLeft, 
  Bot, 
  HelpCircle,
  CreditCard,
  Clock,
  Award
} from 'lucide-react';
import { InsuranceType, InsurancePolicyInfo, QuoteCalculationResult } from '../types';

interface PublicPortalProps {
  policies: InsurancePolicyInfo[];
  onOpenChatWithPrompt?: (prompt: string) => void;
}

export const PublicInsurancePortal: React.FC<PublicPortalProps> = ({ policies, onOpenChatWithPrompt }) => {
  const [selectedType, setSelectedType] = useState<InsuranceType>('third_party');
  
  // Calculator Form States
  const [vehicleType, setVehicleType] = useState<'pride' | 'peugeot' | 'suv' | 'motorcycle' | 'truck'>('peugeot');
  const [buildYear, setBuildYear] = useState<number>(1400);
  const [noClaimYears, setNoClaimYears] = useState<number>(3);
  const [coverageFinancial, setCoverageFinancial] = useState<number>(60);
  const [familyCount, setFamilyCount] = useState<number>(2);
  
  // Calculation Result
  const [calcResult, setCalcResult] = useState<QuoteCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const response = await fetch('/api/calculate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insuranceType: selectedType,
          vehicleType,
          buildYear,
          noClaimYears,
          desiredFinancialCoverageMillion: coverageFinancial,
          familyMembersCount: familyCount
        })
      });
      const data = await response.json();
      if (data.success) {
        setCalcResult(data.result);
      }
    } catch (err) {
      console.error('Failed to calculate quote:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const getPolicyIcon = (type: InsuranceType) => {
    switch (type) {
      case 'third_party': return <Car className="w-6 h-6 text-blue-400" />;
      case 'hull': return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case 'health': return <HeartPulse className="w-6 h-6 text-rose-400" />;
      case 'fire': return <Flame className="w-6 h-6 text-amber-400" />;
      case 'life': return <TrendingUp className="w-6 h-6 text-purple-400" />;
      case 'travel': return <Plane className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-blue-500/20 p-8 lg:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-amber-500/10 border border-blue-500/20 text-blue-300 text-xs sm:text-sm font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>صدور آنلاین انواع بیمه‌نامه با پشتیبانی مستقیم چت گفتینو و هوش مصنوعی</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            استعلام آنلاین و خرید اقساطی <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">بیمه جم</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            محاسبه دقیق قیمت با اعمال حداکثر تخفیف‌های عدم خسارت، امکان پرداخت اقساطی بدون ضامن و چک، و پاسخگویی آنی هوشمند ۲۴ ساعته.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('calculator-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              <Calculator className="w-5 h-5 text-amber-300" />
              <span>استعلام آنلاین قیمت</span>
            </button>

            <button
              onClick={() => onOpenChatWithPrompt && onOpenChatWithPrompt('سلام، چطوری میتونم بیمه شخص ثالث پراید رو اقساطی بخرم؟')}
              className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-6 py-3.5 rounded-2xl transition-all hover:border-amber-500/40"
            >
              <Bot className="w-5 h-5 text-amber-400" />
              <span>گفتگو با دستیار هوشمند گفتینو</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80">
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/60">
              <div className="flex items-center justify-center gap-2 text-amber-400 font-extrabold text-xl mb-1">
                <Clock className="w-5 h-5" />
                <span>۵ دقیقه</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">زمان میانگین صدور بیمه‌نامه</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/60">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-extrabold text-xl mb-1">
                <CreditCard className="w-5 h-5" />
                <span>اقساط ۴ تا ۸ ماهه</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">بدون چک و ضامن</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/60">
              <div className="flex items-center justify-center gap-2 text-blue-400 font-extrabold text-xl mb-1">
                <Zap className="w-5 h-5" />
                <span>پاسخگویی زیر ۱ ثانیه</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">هوش مصنوعی گفتینو</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/60">
              <div className="flex items-center justify-center gap-2 text-purple-400 font-extrabold text-xl mb-1">
                <Award className="w-5 h-5" />
                <span>۷۰٪ تخفیف</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">حداکثر عدم خسارت</p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator-section" className="scroll-mt-24 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Calculator className="w-4 h-4" />
            <span>محاسبه‌گر پیشرفته بیمه جم</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">استعلام فوری و محاسبه دقیق قیمت</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">نوع بیمه مد نظر خود را انتخاب کرده و نرخ را با تخفیف‌های ویژه بیمه جم مشاهده کنید.</p>
        </div>

        {/* Insurance Category Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {policies.map((p) => {
            const isSelected = selectedType === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedType(p.id);
                  setCalcResult(null);
                }}
                className={`p-4 rounded-2xl border transition-all text-right flex flex-col justify-between h-32 ${
                  isSelected
                    ? 'bg-gradient-to-b from-blue-900/60 to-slate-900 border-blue-500 shadow-lg shadow-blue-500/10 scale-[1.02]'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-blue-600/20' : 'bg-slate-800'}`}>
                    {getPolicyIcon(p.id)}
                  </div>
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />}
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>{p.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-1">{p.basePriceFormatted}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Calculator Body & Parameters */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                {getPolicyIcon(selectedType)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  پارامترهای استعلام {policies.find((p) => p.id === selectedType)?.title}
                </h3>
                <p className="text-xs text-slate-400">اطلاعات را وارد کنید تا دقیقا تعرفه سال ۱۴۰۳ با سود اقساط محاسبه شود.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Conditional Fields depending on Insurance Type */}
            {(selectedType === 'third_party' || selectedType === 'hull') && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">نوع و مدل خودرو / وسیله نقلیه</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="pride">پراید / تیبا / ساینا / کوئیک (سواری ۴ سیلندر)</option>
                    <option value="peugeot">پژو ۴۰۵ / ۲۰۶ / سمند / دنا / تارا (سواری)</option>
                    <option value="suv">خودروهای شاسی‌بلند (SUV) و کراس‌اوور</option>
                    <option value="motorcycle">موتورسیکلت</option>
                    <option value="truck">وانت‌بار و کامیونت</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">سال ساخت (شمسی)</label>
                  <select
                    value={buildYear}
                    onChange={(e) => setBuildYear(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    {[1403, 1402, 1401, 1400, 1399, 1398, 1397, 1396, 1395, 1390, 1385].map((y) => (
                      <option key={y} value={y}>سال {y}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">تعداد سال تخفیف عدم خسارت</label>
                  <select
                    value={noClaimYears}
                    onChange={(e) => setNoClaimYears(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value={0}>بدون تخفیف (سال اول)</option>
                    <option value={1}>۱ سال (۵٪ تخفیف)</option>
                    <option value={2}>۲ سال (۱۰٪ تخفیف)</option>
                    <option value={3}>۳ سال (۱۵٪ تخفیف)</option>
                    <option value={4}>۴ سال (۲۰٪ تخفیف)</option>
                    <option value={5}>۵ سال (۲۵٪ تخفیف)</option>
                    <option value={7}>۷ سال (۳۵٪ تخفیف)</option>
                    <option value={10}>۱۰ سال (۵۰٪ تخفیف)</option>
                    <option value={14}>۱۴ سال و بیشتر (۷۰٪ حداکثر تخفیف)</option>
                  </select>
                </div>

                {selectedType === 'third_party' && (
                  <div className="space-y-2 md:col-span-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-300">سقف پوشش مالی درخواستی</span>
                      <span className="text-amber-400 font-bold">{coverageFinancial} میلیون تومان</span>
                    </div>
                    <input
                      type="range"
                      min={60}
                      max={600}
                      step={20}
                      value={coverageFinancial}
                      onChange={(e) => setCoverageFinancial(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>۶۰ میلیون (پایه)</span>
                      <span>۳۰۰ میلیون</span>
                      <span>۶۰۰ میلیون (حداکثر)</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {selectedType === 'health' && (
              <div className="space-y-2 md:col-span-3">
                <label className="text-xs font-semibold text-slate-300">تعداد اعضای خانواده برای پوشش درمان</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => setFamilyCount(num)}
                      className={`flex-1 py-3 rounded-xl font-bold border transition-all ${
                        familyCount === num
                          ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/20'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {num} نفر
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(selectedType === 'fire' || selectedType === 'life' || selectedType === 'travel') && (
              <div className="md:col-span-3 p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-sm text-slate-300 space-y-2">
                <p className="font-semibold text-amber-300">ℹ️ اطلاعات طرح‌های عمومی {policies.find((p) => p.id === selectedType)?.title}:</p>
                <p className="text-xs text-slate-400">
                  این بیمه‌نامه با حداقل فرانشیز و پوشش کامل در سال ۱۴۰۳ با جشنواره تخفیف ویژه بیمه جم محاسبه می‌گردد.
                </p>
              </div>
            )}

          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isCalculating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>در حال استعلام نرخ...</span>
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5" />
                  <span>محاسبه و دریافت نرخ دقیق</span>
                </>
              )}
            </button>
          </div>

          {/* Calculation Result Box */}
          {calcResult && (
            <div className="mt-6 p-6 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    قیمت محاسبه شده بیمه جم
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-white">{calcResult.finalPriceTomanFormatted}</span>
                    <span className="text-xs text-slate-400 line-through">{calcResult.estimatedPriceTomanFormatted}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-left bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl">
                    <span className="text-[10px] text-amber-400 block font-medium">سود تخفیف اعمال شده</span>
                    <span className="text-lg font-bold text-amber-300">{calcResult.discountAppliedPercentage}٪ تخفیف</span>
                  </div>

                  <button
                    onClick={() => {
                      const prompt = `سلام، من استعلام ${policies.find(p => p.id === selectedType)?.title} رو انجام دادم و مبلغش شد ${calcResult.finalPriceTomanFormatted}. چطور میتونم اقساطی بخرمش؟`;
                      onOpenChatWithPrompt && onOpenChatWithPrompt(prompt);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg transition-all"
                  >
                    <Bot className="w-4 h-4" />
                    <span>خرید اقساطی در چت گفتینو</span>
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {calcResult.breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="font-bold text-slate-200">{item.amountToman}</span>
                  </div>
                ))}
              </div>

              {/* AI Advisor Tip */}
              {calcResult.aiAdvisorTip && (
                <div className="flex items-start gap-3 p-4 bg-blue-950/40 border border-blue-500/20 rounded-xl text-xs text-blue-200">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300 font-bold block mb-0.5">توصیه مشاور هوشمند بیمه جم:</strong>
                    <p>{calcResult.aiAdvisorTip}</p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* Insurance Policies Overview Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">انواع بیمه‌نامه‌های بیمه جم</h2>
          <p className="text-slate-400 text-sm">پوشش‌های کامل با بهترین شرایط صدور و پشتیبانی هوشمند آنلاین</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 rounded-3xl p-6 space-y-5 transition-all hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                    {getPolicyIcon(policy.id)}
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                    {policy.basePriceFormatted}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                    {policy.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {policy.shortDesc}
                  </p>
                </div>

                <ul className="space-y-2 border-t border-slate-800/80 pt-4">
                  {policy.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedType(policy.id);
                  const el = document.getElementById('calculator-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white font-bold py-3 rounded-2xl transition-all border border-slate-700 hover:border-blue-500 text-xs"
              >
                <span>استعلام و صدور {policy.title}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Why Bimeh Jam */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">چرا بیمه جم؟</h2>
          <p className="text-xs text-slate-400">مزایای منحصر‌به‌فرد خرید از پلتفرم بیمه جم با هوش مصنوعی پاسخگویی گفتینو</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">پاسخگویی آنی با هوش مصنوعی جمنای</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              هر ساعتی از شبانه‌روز که در گفتینو پیام بفرستید، سیستم هوشمند بیمه جم با تحلیل کامل نیاز شما پاسخ دقیق ارائه می‌دهد.
            </p>
          </div>

          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">اقساط بدون چک و ضامن</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              پرداخت در ۴ تا ۸ قسط ماهانه بدون نیاز به ضامن یا مراجعه حضوری با صدور آنی بیمه‌نامه رسمى.
            </p>
          </div>

          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">ضمانت اصالت و صدور فوری</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ارسال کد یکتای بیمه مرکزی ج.ا.ا بلافاصله بعد از ثبت سفارش و تحویل رایگان نسخه فیزیکی درب منزل.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
