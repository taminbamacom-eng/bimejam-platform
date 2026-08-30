import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Filter,
  Sparkles,
  Flame,
  UserPlus,
  MessageSquare,
  FileText,
  AlertTriangle,
  HelpCircle,
  Clock,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { notificationService } from '../services/api';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  read: boolean;
  customerId?: string;
  customer?: { id: string; name: string; phone?: string };
  conversationId?: string;
  createdAt: string;
}

export const NotificationCenterView: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState<boolean>(false);

  useEffect(() => {
    fetchNotifications();
  }, [filterType, filterPriority, filterUnreadOnly]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications({
        read: filterUnreadOnly ? false : undefined,
        priority: filterPriority,
        type: filterType,
      });
      if (res.data && res.data.success) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Hot Lead':
        return <Flame className="w-5 h-5 text-rose-500" />;
      case 'New Customer':
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      case 'New Conversation':
        return <MessageSquare className="w-5 h-5 text-indigo-500" />;
      case 'Quotation Ready':
        return <FileText className="w-5 h-5 text-emerald-500" />;
      case 'Task Deadline':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'AI Error':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'Knowledge Gap':
        return <HelpCircle className="w-5 h-5 text-purple-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyan-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">فوری</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">مهم</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">متوسط</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">عادی</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200/80 relative">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">مرکز اعلانات و آگاه‌سازی‌های زنده (Notification Center)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              هشدارهای لید داغ، گفتگوهای جدید، مهلت وظایف و وضعیت هوش مصنوعی
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 border border-blue-200"
          >
            <CheckCheck className="w-4 h-4" />
            علامت‌گذاری همه به‌عنوان خوانده‌شده
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="ALL">تمام انواع اعلانات</option>
            <option value="Hot Lead">لید داغ (Hot Lead)</option>
            <option value="New Customer">مشتری جدید</option>
            <option value="New Conversation">گفتگوی جدید</option>
            <option value="Quotation Ready">استعلام آماده صدور</option>
            <option value="Task Deadline">مهلت وظیفه</option>
            <option value="AI Error">خطای هوش مصنوعی</option>
            <option value="Knowledge Gap">کمبود دانش هوش مصنوعی</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="ALL">تمام اولویت‌ها</option>
            <option value="URGENT">فوری (URGENT)</option>
            <option value="HIGH">مهم (HIGH)</option>
            <option value="MEDIUM">متوسط (MEDIUM)</option>
            <option value="LOW">عادی (LOW)</option>
          </select>

          {/* Unread Checkbox */}
          <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
            <input
              type="checkbox"
              checked={filterUnreadOnly}
              onChange={(e) => setFilterUnreadOnly(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            فقط خوانده نشده‌ها ({unreadCount})
          </label>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">در حال بارگذاری اعلانات...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">هیچ اعلانی یافت نشد</h4>
            <p className="text-xs text-slate-400">تمام اعلانات بررسی شده و پیام جدیدی وجود ندارد.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all duration-200 flex items-start justify-between gap-4 ${
                  !item.read
                    ? 'bg-blue-50/40 border-blue-200 shadow-2xs font-semibold'
                    : 'bg-white border-slate-100 opacity-80'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="p-2.5 bg-slate-100 rounded-xl shrink-0 mt-0.5">
                    {getNotificationIcon(item.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      {getPriorityBadge(item.priority)}
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono">
                        {item.type}
                      </span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      {item.customer && (
                        <span className="font-semibold text-slate-700">
                          مشتری: {item.customer.name}
                        </span>
                      )}
                      <span>
                        زمان: {new Date(item.createdAt).toLocaleDateString('fa-IR')}{' '}
                        {new Date(item.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {!item.read && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors shrink-0"
                  >
                    علامت خوانده‌شده
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
