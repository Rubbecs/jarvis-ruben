import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { fetchNotifications } from '../api';
export const NotificationCenter = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (isOpen) {
            loadNotifications();
            const interval = setInterval(loadNotifications, 5000);
            return () => clearInterval(interval);
        }
    }, [isOpen]);
    const loadNotifications = async () => {
        try {
            setLoading(true);
            const data = await fetchNotifications();
            setNotifications(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        }
        catch (error) {
            console.error('Failed to load notifications:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const getNotificationColor = (type) => {
        switch (type) {
            case 'error': return 'bg-red-900 border-red-700';
            case 'warning': return 'bg-yellow-900 border-yellow-700';
            case 'success': return 'bg-green-900 border-green-700';
            default: return 'bg-blue-900 border-blue-700';
        }
    };
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'success': return '✅';
            default: return 'ℹ️';
        }
    };
    if (!isOpen)
        return null;
    const unreadCount = notifications.filter(n => !n.read).length;
    return (_jsxs("div", { className: "fixed top-20 right-4 w-96 max-h-96 bg-slate-900 border border-blue-500 rounded-lg shadow-lg flex flex-col z-50", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-blue-500", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-2xl", children: "\uD83D\uDD14" }), _jsxs("h3", { className: "font-semibold", children: ["Notifications ", unreadCount > 0 && `(${unreadCount})`] })] }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-white text-xl", children: "\u2715" })] }), _jsxs("div", { className: "flex-1 overflow-y-auto", children: [loading && (_jsx("div", { className: "p-4 text-center text-gray-400", children: "Loading..." })), notifications.length === 0 && !loading && (_jsx("div", { className: "p-4 text-center text-gray-400", children: "No notifications" })), _jsx("div", { className: "p-2 space-y-2", children: notifications.map(notif => (_jsx("div", { className: `p-3 rounded border ${getNotificationColor(notif.type)} ${notif.read ? 'opacity-60' : 'opacity-100'}`, children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-xl mt-0.5", children: getNotificationIcon(notif.type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm break-words", children: notif.message }), _jsx("time", { className: "text-xs text-gray-400 mt-1", children: new Date(notif.createdAt).toLocaleTimeString() })] })] }) }, notif.id))) })] })] }));
};
