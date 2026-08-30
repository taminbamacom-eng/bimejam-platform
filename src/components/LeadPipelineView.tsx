import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  TrendingUp, 
  Flame, 
  Snowflake, 
  Sun, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  ShieldCheck, 
  RefreshCw, 
  X, 
  ChevronRight, 
  FileText,
  DollarSign
} from 'lucide-react';
import { leadService } from '../services/api';

export type LeadStatus = 'Cold' | 'Warm' | 'Hot' | 'Converted' | 'Lost';

export interface LeadItem {
  id: string;
  customerName: string;
  customerPhone?: string;
  insuranceInterest: string;
  score: number;
  status: LeadStatus;
  source: string;
  lastActivity: string;
  assignedOperator: string;
  estimatedValue?: number;
  notes?: string;
}

export const LeadPipelineView: React.FC = () => {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Form states for creating a new Lead
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newInsuranceInterest, setNewInsuranceInterest] = useState('بیمه مسئولیت مدیر ساختمان');
  const [newScore, setNewScore] = useState(80);
  const [newStatus, setNewStatus] = useState<LeadStatus>('Hot');
  const [newSource, setNewSource] = useState('گفتینو');
  const [newOperator, setNewOperator] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await leadService.getLeads({ search: searchQuery });
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: LeadItem[] = res.data.map((l: any) => ({
          id: l.id,
          customerName: l.customer?.name || 'مشتری',
          customerPhone: l.customer?.phone || '',
          insuranceInterest: l.insuranceType === 'BODY' ? 'بیمه بدنه خودرو' :
                             l.insuranceType === 'THIRD_PARTY' ? 'بیمه شخص ثالث' :
                             l.insuranceType === 'HEALTH' ? 'بیمه درمان تکمیلی' :
                             l.insuranceType === 'FIRE' ? 'بیمه آتش‌سوزی' : 'بیمه عمومی',
          score: l.score || 70,
          status: (l.status === 'NEW' ? 'Hot' : l.status === 'WON' ? 'Converted' : l.status === 'LOST' ? 'Lost' : 'Warm') as LeadStatus,
          source: l.source || 'گفتینو',
          lastActivity: 'چند دقیقه پیش',
          assignedOperator: l.assignedUser?.name || 'بدون تخصیص',
          estimatedValue: l.estimatedValue || 0,
          notes: l.notes || ''
        }));
        setLeads(mapped);
      } else {
        setLeads([]);
      }
    } catch (err) {
      console.warn('Error fetching leads:', err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (leadId: string, targetStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: targetStatus } : l));
    try {
      await leadService.updateLead(leadId, { status: targetStatus });
    } catch (err) {
      console.error('Failed to patch lead status:', err);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName) return;

    const newLead: LeadItem = {
      id: `lead-${Date.now()}`,
      customerName: newCustomerName,
      customerPhone: newCustomerPhone || '۰۹۱۲۰۰۰۰۰۰۰',
      insuranceInterest: newInsuranceInterest,
      score: newScore,
      status: newStatus,
      source: newSource,
      lastActivity: 'هم‌اکنون',
      assignedOperator: newOperator,
      estimatedValue: 3500000,
      notes: 'ثبت لید جدید از طریق خط لوله CRM'
    };

    setLeads([newLead, ...leads]);
    setShowCreateModal(false);

    try {
      await leadService.createLead({
        customerId: `cust-${Date.now()}`,
        insuranceType: 'THIRD_PARTY',
        score: newScore,
        status: newStatus,
        source: newSource
      });
    } catch (err) {
      console.warn('Backend create lead fallback:', err);
    }

    setNewCustomerName('');
    setNewCustomerPhone('');
  };

  const stages: { id: LeadStatus; title: string; color: string; badgeBg: string; icon: any }[] = [
    { id: 'Cold', title: 'لید سرد (Cold)', color: 'border-slate-300 text-slate-700', badgeBg: 'bg-slate-100 text-slate-700', icon: Snowflake },
    { id: 'Warm', title: 'لید گرم (Warm)', color: 'border-amber-300 text-amber-800', badgeBg: 'bg-amber-100 text-amber-800', icon: Sun },
    { id: 'Hot', title: 'لید داغ (Hot)', color: 'border-rose-400 text-rose-800', badgeBg: 'bg-rose-100 text-rose-800', icon: Flame },
    { id: 'Converted', title: 'موفق (Converted)', color: 'border-emerald-400 text-emerald-800', badgeBg: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
    { id: 'Lost', title: 'از دست رفته (Lost)', color: 'border-slate-200 text-slate-500', badgeBg: 'bg-slate-100 text-slate-500', icon: XCircle },
  ];

  const filteredLeads = leads.filter(l => 
    searchQuery === '' || 
    l.customerName.includes(searchQuery) || 
    l.insuranceInterest.includes(searchQuery)
  );

  return (
    <div className="space-y-6 font-['Vazirmatn',sans-serif] text-slate-800">
      
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">خط لوله فرصت‌های فروش (Lead Pipeline)</h2>
            <p className="text-xs text-slate-500 font-medium">دسته‌بندی خودکار بر اساس امتیاز، منبع ورودی و تغییر وضعیت قیچی فروش</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchLeads}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            title="به‌روزرسانی قیف فروش"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-600' : ''}`} />
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت لید جدید</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="جستجوی لید براساس نام، بیمه..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs focus:outline-hidden focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>

        <div className="text-xs font-bold text-slate-600 hidden sm:block">
          مجموع لیدهای فعال: <span className="text-amber-600 font-black">{filteredLeads.length} مورد</span>
        </div>
      </div>

      {/* Kanban Pipeline Board Grid (5 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
        {stages.map((stage) => {
          const StageIcon = stage.icon;
          const stageLeads = filteredLeads.filter((l) => l.status === stage.id);

          return (
            <div key={stage.id} className="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-3 space-y-3 min-h-[500px] flex flex-col">
              
              {/* Stage Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                  <StageIcon className="w-4 h-4" />
                  <span>{stage.title}</span>
                </div>
                <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${stage.badgeBg}`}>
                  {stageLeads.length}
                </span>
              </div>

              {/* Lead Cards List */}
              <div className="space-y-3 flex-1">
                {stageLeads.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-[11px] font-medium border border-dashed border-slate-300 rounded-xl">
                    موردی نیست
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div 
                      key={lead.id} 
                      className={`bg-white rounded-xl border p-3.5 space-y-2.5 shadow-2xs hover:shadow-md transition-all ${stage.color}`}
                    >
                      {/* Customer Name & Score */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-900 text-xs">{lead.customerName}</span>
                        <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          امتیاز: {lead.score}
                        </span>
                      </div>

                      {/* Insurance Interest */}
                      <p className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{lead.insuranceInterest}</span>
                      </p>

                      {/* Source & Operator */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>منبع: <strong className="text-slate-700">{lead.source}</strong></span>
                        <span>اپراتور: <strong className="text-slate-700">{lead.assignedOperator}</strong></span>
                      </div>

                      {/* Estimated Value if present */}
                      {lead.estimatedValue && (
                        <div className="bg-slate-50 p-1.5 rounded-lg text-[10px] text-slate-700 flex justify-between items-center">
                          <span className="text-slate-500">ارزش تخمینی:</span>
                          <span className="font-bold text-emerald-700">{lead.estimatedValue.toLocaleString('fa-IR')} تومان</span>
                        </div>
                      )}

                      {/* Status Selector dropdown */}
                      <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">{lead.lastActivity}</span>
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                          className="bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 px-2 py-1 focus:outline-hidden"
                        >
                          <option value="Cold">تغییر: سرد</option>
                          <option value="Warm">تغییر: گرم</option>
                          <option value="Hot">تغییر: داغ</option>
                          <option value="Converted">تغییر: موفق (فروش)</option>
                          <option value="Lost">تغییر: از دست رفته</option>
                        </select>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Create Lead Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                <span>ثبت فرصت فروش جدید (Lead)</span>
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">نام مشتری <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="مانند: علی حسینی"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">شماره همراه</label>
                <input
                  type="text"
                  placeholder="۰۹۱۲..."
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 dir-ltr text-right focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">رشته بیمه‌ای مورد تقاضا</label>
                <select
                  value={newInsuranceInterest}
                  onChange={(e) => setNewInsuranceInterest(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-amber-500"
                >
                  <option value="بیمه مسئولیت مدیر ساختمان">بیمه مسئولیت مدیر ساختمان</option>
                  <option value="بیمه بدنه خودرو">بیمه بدنه خودرو</option>
                  <option value="بیمه شخص ثالث خودرو">بیمه شخص ثالث خودرو</option>
                  <option value="بیمه درمان تکمیلی انفرادی">بیمه درمان تکمیلی انفرادی</option>
                  <option value="بیمه آتش سوزی و زلزله">بیمه آتش سوزی و زلزله</option>
                  <option value="بیمه عمر و سرمایه‌گذاری">بیمه عمر و سرمایه‌گذاری</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">امتیاز ارزیابی (Score)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newScore}
                    onChange={(e) => setNewScore(parseInt(e.target.value) || 50)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">مرحله اولیه</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as LeadStatus)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="Hot">لید داغ (Hot)</option>
                    <option value="Warm">لید گرم (Warm)</option>
                    <option value="Cold">لید سرد (Cold)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl transition-colors shadow-md shadow-amber-500/20"
                >
                  ایجاد لید
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
