import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { AgentDashboard } from './pages/AgentDashboard';
import { TaskDashboard } from './pages/TaskDashboard';
import { MemoryVault } from './pages/MemoryVault';
import { ApiKeyManager } from './pages/ApiKeyManager';
import { fetchAgents } from './api';
import './styles/global.css';
const tabs = [
    { id: 'agents', label: 'Agents' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'memory', label: 'Memory Vault' },
    { id: 'keys', label: 'API Keys' }
];
function App() {
    const [activeTab, setActiveTab] = useState('agents');
    const [agents, setAgents] = useState([]);
    useEffect(() => {
        fetchAgents().then(setAgents).catch(console.error);
    }, []);
    return (_jsxs("div", { className: "app-shell", children: [_jsxs("header", { className: "app-header", children: [_jsxs("div", { children: [_jsx("h1", { children: "Jarvis Ruben" }), _jsx("p", { children: "Local-first multi-agent orchestration dashboard" })] }), _jsx("nav", { className: "app-nav", children: tabs.map((tab) => (_jsx("button", { className: activeTab === tab.id ? 'active' : '', onClick: () => setActiveTab(tab.id), children: tab.label }, tab.id))) })] }), _jsxs("main", { className: "app-main", children: [activeTab === 'agents' && _jsx(AgentDashboard, { agents: agents, refresh: () => fetchAgents().then(setAgents) }), activeTab === 'tasks' && _jsx(TaskDashboard, {}), activeTab === 'memory' && _jsx(MemoryVault, {}), activeTab === 'keys' && _jsx(ApiKeyManager, {})] })] }));
}
export default App;
