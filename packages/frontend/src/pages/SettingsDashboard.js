import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { fetchTools, fetchKeys, createApiKey, updateAgent } from '../api';
export const SettingsDashboard = ({ agents, onRefresh }) => {
    const [tools, setTools] = useState([]);
    const [keys, setKeys] = useState([]);
    const [activeTab, setActiveTab] = useState('tools');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Integration form states
    const [newKeyProvider, setNewKeyProvider] = useState('discord');
    const [newKeyValue, setNewKeyValue] = useState('');
    const [newKeyLabel, setNewKeyLabel] = useState('');
    const [selectedAgents, setSelectedAgents] = useState([]);
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            setLoading(true);
            const [toolsData, keysData] = await Promise.all([
                fetchTools(),
                fetchKeys()
            ]);
            setTools(toolsData);
            setKeys(keysData);
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load settings');
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddKey = async () => {
        if (!newKeyValue.trim()) {
            setError('Please enter an API key');
            return;
        }
        try {
            setLoading(true);
            await createApiKey({
                provider: newKeyProvider,
                key: newKeyValue,
                label: newKeyLabel || newKeyProvider,
                assignedAgents: selectedAgents
            });
            setNewKeyValue('');
            setNewKeyLabel('');
            setSelectedAgents([]);
            await loadData();
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add API key');
        }
        finally {
            setLoading(false);
        }
    };
    const handleAssignToolToAgent = async (agentId, toolId) => {
        try {
            const agent = agents.find(a => a.id === agentId);
            if (!agent)
                return;
            const updatedTools = agent.tools.includes(toolId)
                ? agent.tools.filter(t => t !== toolId)
                : [...agent.tools, toolId];
            await updateAgent(agentId, { tools: updatedTools });
            onRefresh();
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update agent');
        }
    };
    const getToolsByCategory = (category) => {
        return tools.filter(t => t.category === category);
    };
    const categories = ['communication', 'email', 'productivity', 'automation', 'development', 'storage', 'collaboration', 'utility'];
    return (_jsxs("div", { className: "bg-slate-900 text-white p-6 rounded-lg border border-blue-500", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Settings & Plugins" }), error && (_jsx("div", { className: "bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4", children: error })), _jsx("div", { className: "flex gap-4 mb-6 border-b border-blue-500", children: ['tools', 'integrations', 'agent-setup'].map(tab => (_jsx("button", { onClick: () => setActiveTab(tab), className: `px-4 py-2 capitalize font-medium transition ${activeTab === tab
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-400 hover:text-gray-300'}`, children: tab.replace('-', ' ') }, tab))) }), activeTab === 'tools' && (_jsxs("div", { children: [_jsxs("p", { className: "text-gray-400 mb-6", children: ["Available tools and integrations (", tools.length, " total)"] }), categories.map(category => {
                        const categoryTools = getToolsByCategory(category);
                        if (categoryTools.length === 0)
                            return null;
                        return (_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-semibold text-blue-400 capitalize mb-3", children: category }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: categoryTools.map(tool => (_jsxs("div", { className: "bg-slate-800 p-3 rounded border border-blue-500 hover:border-blue-400 transition", children: [_jsx("div", { className: "font-medium text-white", children: tool.name }), _jsx("div", { className: "text-sm text-gray-400", children: tool.description })] }, tool.id))) })] }, category));
                    })] })), activeTab === 'integrations' && (_jsxs("div", { children: [_jsxs("div", { className: "bg-slate-800 p-6 rounded border border-blue-500 mb-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Add API Key" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Provider" }), _jsxs("select", { value: newKeyProvider, onChange: (e) => setNewKeyProvider(e.target.value), className: "w-full bg-slate-700 border border-blue-500 rounded px-3 py-2 text-white", children: [_jsx("option", { value: "discord", children: "Discord" }), _jsx("option", { value: "gmail", children: "Gmail" }), _jsx("option", { value: "slack", children: "Slack" }), _jsx("option", { value: "github", children: "GitHub" }), _jsx("option", { value: "openai", children: "OpenAI" }), _jsx("option", { value: "anthropic", children: "Anthropic" }), _jsx("option", { value: "groq", children: "Groq" }), _jsx("option", { value: "gemini", children: "Gemini" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "API Key" }), _jsx("input", { type: "password", value: newKeyValue, onChange: (e) => setNewKeyValue(e.target.value), placeholder: "Paste your API key...", className: "w-full bg-slate-700 border border-blue-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-400" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Label (optional)" }), _jsx("input", { type: "text", value: newKeyLabel, onChange: (e) => setNewKeyLabel(e.target.value), placeholder: "e.g., 'My Discord Bot'", className: "w-full bg-slate-700 border border-blue-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-400" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Assign to Agents" }), _jsx("div", { className: "space-y-2 max-h-32 overflow-y-auto", children: agents.map(agent => (_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: selectedAgents.includes(agent.id), onChange: (e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedAgents([...selectedAgents, agent.id]);
                                                                }
                                                                else {
                                                                    setSelectedAgents(selectedAgents.filter(id => id !== agent.id));
                                                                }
                                                            }, className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: agent.name })] }, agent.id))) })] }), _jsx("button", { onClick: handleAddKey, disabled: loading, className: "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 rounded transition", children: loading ? 'Adding...' : 'Add Key' })] })] }), _jsx("h3", { className: "text-lg font-semibold mb-4", children: "Active Keys" }), _jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto", children: keys.length === 0 ? (_jsx("p", { className: "text-gray-400", children: "No API keys configured yet" })) : (keys.map(key => (_jsxs("div", { className: "bg-slate-800 p-3 rounded border border-blue-500 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium capitalize", children: key.provider }), _jsx("div", { className: "text-sm text-gray-400", children: key.label })] }), _jsxs("div", { className: "text-xs text-gray-500", children: [key.assignedAgents?.length || 0, " agent(s)"] })] }, key.id)))) })] })), activeTab === 'agent-setup' && (_jsxs("div", { children: [_jsx("p", { className: "text-gray-400 mb-6", children: "Assign tools to agents for enhanced capabilities" }), _jsx("div", { className: "space-y-4 max-h-96 overflow-y-auto", children: agents.map(agent => (_jsxs("div", { className: "bg-slate-800 p-4 rounded border border-blue-500", children: [_jsx("h4", { className: "font-semibold mb-3", children: agent.name }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2", children: tools.map(tool => (_jsxs("label", { className: "flex items-center gap-2 cursor-pointer hover:bg-slate-700 p-2 rounded transition", children: [_jsx("input", { type: "checkbox", checked: agent.tools.includes(tool.id), onChange: () => handleAssignToolToAgent(agent.id, tool.id), disabled: loading, className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: tool.name })] }, tool.id))) })] }, agent.id))) })] }))] }));
};
