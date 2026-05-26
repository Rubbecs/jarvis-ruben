import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { AgentDashboard } from './pages/AgentDashboard';
import { TaskDashboard } from './pages/TaskDashboard';
import { MemoryVault } from './pages/MemoryVault';
import { ApiKeyManager } from './pages/ApiKeyManager';
import { SettingsDashboard } from './pages/SettingsDashboard';
import { AutomationExecutor } from './components/AutomationExecutor';
import { ChatPanel } from './components/ChatPanel';
import { NotificationCenter } from './components/NotificationCenter';
import { fetchAgents } from './api';
import './styles/global.css';
const tabs = [
    { id: 'agents', label: '🤖 Agents' },
    { id: 'tasks', label: '✓ Tasks' },
    { id: 'memory', label: '🧠 Memory' },
    { id: 'automation', label: '⚙️ Automation' },
    { id: 'settings', label: '⚡ Settings' },
    { id: 'keys', label: '🔑 Keys' }
];
function App() {
    const [activeTab, setActiveTab] = useState('agents');
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [chatOpen, setChatOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    useEffect(() => {
        loadAgents();
    }, []);
    const loadAgents = async () => {
        try {
            const data = await fetchAgents();
            setAgents(data);
            if (data.length > 0 && !selectedAgent) {
                setSelectedAgent(data[0]);
            }
        }
        catch (error) {
            console.error('Failed to load agents:', error);
        }
    };
    return (_jsxs("div", { className: "app-shell", children: [_jsxs("header", { className: "app-header", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "text-3xl", children: "\uD83E\uDD16" }), _jsxs("div", { children: [_jsx("h1", { children: "Jarvis Ruben" }), _jsx("p", { children: "Local-first multi-agent orchestration \u2014 OpenSwarm for localhost" })] })] }), _jsx("nav", { className: "app-nav", children: tabs.map((tab) => (_jsx("button", { className: activeTab === tab.id ? 'active' : '', onClick: () => setActiveTab(tab.id), children: tab.label }, tab.id))) }), _jsxs("div", { className: "flex gap-3 items-center", children: [_jsx("button", { onClick: () => setNotificationsOpen(!notificationsOpen), className: "relative px-3 py-2 hover:bg-blue-600 rounded transition", title: "Notifications", children: "\uD83D\uDD14" }), agents.length > 0 && (_jsx("button", { onClick: () => setChatOpen(!chatOpen), className: "px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded transition font-medium", children: "\uD83D\uDCAC Chat" }))] })] }), _jsxs("main", { className: "app-main", children: [activeTab === 'agents' && _jsx(AgentDashboard, { agents: agents, refresh: loadAgents }), activeTab === 'tasks' && _jsx(TaskDashboard, {}), activeTab === 'memory' && _jsx(MemoryVault, {}), activeTab === 'keys' && _jsx(ApiKeyManager, {}), activeTab === 'automation' && _jsx(AutomationExecutor, { agents: agents }), activeTab === 'settings' && _jsx(SettingsDashboard, { agents: agents, onRefresh: loadAgents })] }), chatOpen && (_jsx(ChatPanel, { agent: selectedAgent, agents: agents, onClose: () => setChatOpen(false) })), _jsx(NotificationCenter, { isOpen: notificationsOpen, onClose: () => setNotificationsOpen(false) })] }));
}
export default App;
