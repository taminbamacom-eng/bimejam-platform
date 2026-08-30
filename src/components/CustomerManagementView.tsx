import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  MapPin,
  Phone,
  Mail,
  Eye,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  ChevronLeft,
  UserCheck,
  RefreshCw,
  X,
} from 'lucide-react';
import { customerService } from '../services/api';

export interface CustomerData {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  city?: string;
  source?: string;
  leadScore?: number;
  leadStatus?: string;
  assignedOperator?: string | null;
  createdAt: string;
  firstVisit?: string;
  lastVisit?: string;
  visitedPages?: string[];
  conversationsCount?: number;
  interestedProducts?: string[];
  interestedInsuranceTypes?: string[] | string;
  websiteActivity?:
    | Array<{
        url: string;
        date?: string;
      }>
    | string;
  conversations?: any[];
  leads?: any[];
  tags?: string;
}

interface CustomerManagementViewProps {
  onOpenConversation?: (conversationId: string) => void;
}

export const CustomerManagementView: React.FC<CustomerManagementViewProps> = ({
  onOpenConversation,
}) => {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerData | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Customer Form State
  const [newCustomerName, setNewCustomerName] = useState<string>('');
  const [newCustomerPhone, setNewCustomerPhone] = useState<string>('');
  const [newCustomerEmail, setNewCustomerEmail] = useState<string>('');
  const [newCustomerCity, setNewCustomerCity] = useState<string>('تهران');

  const fetchCustomers = async () => {
    setLoading(true);

    try {
      const res = await customerService.getCustomers({
        search: searchQuery,
        city: cityFilter !== 'ALL' ? cityFilter : '',
      });

      if (res && res.data && Array.isArray(res.data)) {
        setCustomers(res.data);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      console.warn('Error fetching customers:', err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

    const openCustomerProfile = async (customer: CustomerData) => {
      try {
        const res: any = await customerService.getCustomerById(customer.id);

        const fullCustomer =
          res?.customer ||
          res?.data?.customer ||
          res?.data ||
          res;

        if (fullCustomer) {
          console.log("PROFILE API RESPONSE:", res);
          console.log("PROFILE FULL CUSTOMER:", fullCustomer);
          console.log("PROFILE CONVERSATIONS:", fullCustomer?.conversations);

          setSelectedCustomer({
            ...customer,
            ...fullCustomer,
            websiteActivity:
              fullCustomer.websiteActivity ?? customer.websiteActivity,
            conversations:
              Array.isArray(fullCustomer.conversations)
                ? fullCustomer.conversations
                : [],
            interestedInsuranceTypes:
              fullCustomer.interestedInsuranceTypes ??
              customer.interestedInsuranceTypes,
          });
        } else {
          setSelectedCustomer(customer);
        }

      } catch (error) {
        console.warn('Error loading customer profile:', error);
        setSelectedCustomer(customer);
      }
    };






  useEffect(() => {
    fetchCustomers();
  }, [cityFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCustomerName.trim()) {
      return;
    }

    try {
      const res: any = await customerService.createCustomer({
        name: newCustomerName.trim(),
        phone: newCustomerPhone.trim(),
        email: newCustomerEmail.trim(),
        city: newCustomerCity,
      });

      if (res && res.customer) {
        setCustomers((prev) => [res.customer, ...prev]);
      } else {
        const mockNew: CustomerData = {
          id: `cust-${Date.now()}`,
          name: newCustomerName.trim(),
          phone: newCustomerPhone.trim() || '۰۹۱۲۰۰۰۰۰۰۰',
          email: newCustomerEmail.trim() || 'user@example.com',
          city: newCustomerCity,
          source: 'ثبت دستی',
          leadScore: 70,
          leadStatus: 'Warm',
          assignedOperator: null,
          createdAt: new Date().toLocaleDateString('fa-IR'),
          firstVisit: 'هم‌اکنون',
          lastVisit: 'هم‌اکنون',
          visitedPages: ['پورتال ثبت مشتری'],
          conversationsCount: 0,
          interestedProducts: ['بیمه عمومی'],
          interestedInsuranceTypes: [],
          websiteActivity: [],
          conversations: [],
          leads: [],
          tags: '',
        };

        setCustomers((prev) => [mockNew, ...prev]);
      }

      setShowAddModal(false);
      setNewCustomerName('');
      setNewCustomerPhone('');
      setNewCustomerEmail('');
      setNewCustomerCity('تهران');
    } catch (err) {
      console.error('Failed to create customer:', err);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    const matchesSearch =
      normalizedSearch === '' ||
      customer.name?.toLowerCase().includes(normalizedSearch) ||
      customer.phone?.includes(searchQuery.trim()) ||
      customer.email?.toLowerCase().includes(normalizedSearch);

    const matchesCity =
      cityFilter === 'ALL' || customer.city === cityFilter;

    return matchesSearch && matchesCity;
  });

  const getLeadLabel = (status?: string) => {
    if (status === 'Hot') return 'داغ';
    if (status === 'Warm') return 'گرم';
    return 'سرد';
  };

  const getLeadBadgeClass = (status?: string) => {
    if (status === 'Hot') {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }

    if (status === 'Warm') {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }

    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getInterestedInsuranceTypes = (): string[] => {
    if (!selectedCustomer) return [];

    const raw = selectedCustomer.interestedInsuranceTypes;

    if (!raw) return [];

    if (Array.isArray(raw)) {
      return raw.map(String);
    }

    try {
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        return parsed.map(String);
      }

      return [];
    } catch {
      return [];
    }
  };

  const getWebsiteActivity = (): Array<{
    url: string;
    date?: string;
  }> => {
    if (!selectedCustomer) return [];

    const raw = selectedCustomer.websiteActivity;

    if (!raw) return [];

    if (Array.isArray(raw)) {
      return raw;
    }

    try {
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        return parsed;
      }

      return [];
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-6 font-['Vazirmatn',sans-serif] text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <UserCheck className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              مدیریت پرونده مشتریان (CRM)
            </h2>

            <p className="text-xs text-slate-500 font-medium">
              مشاهده اطلاعات، سوابق بازدیدها، نمره لید و تاریخچه گفتگوهای بیمه‌ای
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={fetchCustomers}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            title="به‌روزرسانی لیست"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                loading ? 'animate-spin text-blue-600' : ''
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>ثبت پرونده مشتری جدید</span>
          </button>
        </div>
      </div>

      {/* Customer profile OR customer table */}
      {selectedCustomer ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6 animate-fadeIn">
          {/* Profile header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-5 gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-700 text-white flex items-center justify-center text-xl font-black shadow-md">
                {selectedCustomer.name?.charAt(0) || '?'}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-2xl font-black text-slate-900">
                    {selectedCustomer.name}
                  </h3>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getLeadBadgeClass(
                      selectedCustomer.leadStatus
                    )}`}
                  >
                    لید {getLeadLabel(selectedCustomer.leadStatus)} (
                    {selectedCustomer.leadScore ?? 50})
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    {selectedCustomer.phone || 'ثبت نشده'}
                  </span>

                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    {selectedCustomer.email || 'ثبت نشده'}
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    {selectedCustomer.city || 'نامشخص'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCustomer(null)}
              className="shrink-0 flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>بازگشت به لیست</span>
            </button>
          </div>

          {/* Customer profile grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic information */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>اطلاعات پایه و فروش</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">منبع جذب:</span>
                  <span>{selectedCustomer.source || 'گوگل'}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">اپراتور مسئول:</span>
                  <span>
                    {selectedCustomer.assignedOperator || 'بدون تخصیص'}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">امتیاز لید:</span>
                  <span className="font-bold text-amber-600">
                    {selectedCustomer.leadScore ?? 50} / ۱۰۰
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">تعداد گفتگوها:</span>
                  <span>
                    {selectedCustomer.conversationsCount ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Behavior */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>رفتار و علاقه‌مندی‌ها</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">اولین بازدید:</span>
                  <span>{selectedCustomer.firstVisit || '-'}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">آخرین بازدید:</span>
                  <span>{selectedCustomer.lastVisit || '-'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  موضوع انتخابی:
                </span>

                {getInterestedInsuranceTypes().length > 0 ? (
                  getInterestedInsuranceTypes().map(
                    (topic: string, idx: number) => (
                      <div
                        key={`${topic}-${idx}`}
                        className="bg-white border border-slate-200 rounded-xl p-2 text-xs mb-2"
                      >
                        {topic}
                      </div>
                    )
                  )
                ) : (
                  <div className="text-xs text-slate-400">
                    موضوعی ثبت نشده است
                  </div>
                )}
              </div>
            </div>

            {/* Website Activity - horizontal slider */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span>صفحات بازدیدشده در وب‌سایت</span>
                </h4>

                {getWebsiteActivity().length > 0 && (
                  <span className="text-[10px] text-slate-400 font-medium">
                    {getWebsiteActivity().length} صفحه
                  </span>
                )}
              </div>

              {getWebsiteActivity().length > 0 ? (
                <div>
                  <div
                    className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth"
                    dir="rtl"
                    style={{
                      scrollbarWidth: 'thin',
                      overscrollBehaviorX: 'contain',
                    }}
                  >
                    {getWebsiteActivity().map(
                      (
                        page: {
                          url: string;
                          date?: string;
                        },
                        idx: number
                      ) => {
                        const pageTitle =
                          page.url
                            ?.replace(/^https?:\/\/(www\.)?/, '')
                            ?.split('/')
                            ?.filter(Boolean)
                            ?.pop() || 'صفحه وب';

                        return (
                          <div
                            key={`${page.url}-${idx}`}
                            title={page.url}
                            className="shrink-0 w-[240px] h-[125px] bg-white border border-slate-200 rounded-xl p-3 snap-start flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-700 truncate">
                                {pageTitle}
                              </div>

                              <div className="text-[11px] text-slate-400 line-clamp-2 break-all mt-2">
                                {page.url}
                              </div>
                            </div>

                            {page.date && (
                              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                                {page.date}
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>

                  {getWebsiteActivity().length > 1 && (
                    <div className="text-center pt-1">
                      <span className="text-[10px] text-slate-400">
                        برای مشاهده صفحات بیشتر، افقی اسکرول کنید
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-400 py-6 text-center">
                  صفحه‌ای ثبت نشده است
                </div>
              )}
            </div>
          </div>

          {/* Conversation History */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>تاریخچه گفتگوها</span>
            </h4>

            {!selectedCustomer.conversations ||
            selectedCustomer.conversations.length === 0 ? (
              <div className="bg-slate-50 border rounded-2xl p-8 text-center text-xs text-slate-500">
                هنوز گفتگویی ثبت نشده است.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCustomer.conversations.map(
                  (conv: any, convIndex: number) => (
                    <div
                      key={conv.id ?? convIndex}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          گفتگو {convIndex + 1}
                        </span>

                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">
                          {conv.status || 'NEW'}
                        </span>
                      </div>

                      {conv.currentProductName && (
                        <div className="text-xs text-slate-500">
                          محصول:
                          <span className="font-bold text-slate-700 mr-1">
                            {conv.currentProductName}
                          </span>
                        </div>
                      )}

                      <div className="bg-white border rounded-xl p-3 text-xs text-slate-600 line-clamp-2">
                        {conv.lastMessage || 'پیامی ثبت نشده است'}
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>
                          {conv.lastMessage ? 'آخرین پیام ثبت شده' : 'بدون پیام'}
                        </span>

                        <span>
                          {conv.lastMessageAt || '-'}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          onOpenConversation?.(conv.id)
                        }
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-xl"
                      >
                        مشاهده گفتگو
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
          {/* Filters */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full sm:w-80"
            >
              <input
                type="text"
                placeholder="جستجو با نام، شماره تماس، ایمیل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-xs focus:outline-hidden focus:border-blue-500"
              />

              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-2.5" />
            </form>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />

              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs"
              >
                <option value="ALL">همه شهرها</option>
                <option value="تهران">تهران</option>
                <option value="اصفهان">اصفهان</option>
                <option value="مشهد">مشهد</option>
                <option value="شیراز">شیراز</option>
                <option value="تبریز">تبریز</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100/70 border-b border-slate-200">
                <tr>
                  <th className="p-4">نام مشتری</th>
                  <th className="p-4">شماره تماس</th>
                  <th className="p-4">شهر</th>
                  <th className="p-4">منبع جذب</th>
                  <th className="p-4">امتیاز لید</th>
                  <th className="p-4">اپراتور</th>
                  <th className="p-4">تاریخ ثبت</th>
                  <th className="p-4">عملیات</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-12 text-center text-slate-400"
                    >
                      مشتری یافت نشد.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => openCustomerProfile(customer)}
                    >
                      <td className="p-4 font-bold">
                        {customer.name}
                      </td>

                      <td className="p-4">
                        {customer.phone || '—'}
                      </td>

                      <td className="p-4">
                        {customer.city || 'نامشخص'}
                      </td>

                      <td className="p-4">
                        {customer.source || 'گوگل'}
                      </td>

                      <td className="p-4">
                        {customer.leadScore ?? 50} / ۱۰۰
                      </td>

                      <td className="p-4">
                        {customer.assignedOperator || 'بدون تخصیص'}
                      </td>

                      <td className="p-4">
                        {customer.createdAt}
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openCustomerProfile(customer);
                          }}
                          className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-[11px]"
                        >
                          مشاهده پرونده
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span>ثبت پرونده مشتری جدید</span>
              </h3>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateCustomer}
              className="space-y-4 text-xs"
            >
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  نام و نام خانوادگی{' '}
                  <span className="text-rose-500">*</span>
                </label>

                <input
                  type="text"
                  required
                  placeholder="مانند: محمد علیزاده"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  شماره تماس
                </label>

                <input
                  type="text"
                  placeholder="۰۹۱۲..."
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 dir-ltr text-right focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  آدرس ایمیل
                </label>

                <input
                  type="email"
                  placeholder="email@example.com"
                  value={newCustomerEmail}
                  onChange={(e) => setNewCustomerEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 dir-ltr text-right focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  شهر سکونت
                </label>

                <select
                  value={newCustomerCity}
                  onChange={(e) => setNewCustomerCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-blue-500"
                >
                  <option value="تهران">تهران</option>
                  <option value="اصفهان">اصفهان</option>
                  <option value="مشهد">مشهد</option>
                  <option value="شیراز">شیراز</option>
                  <option value="تبریز">تبریز</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors shadow-md shadow-blue-600/20"
                >
                  ثبت پرونده
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
