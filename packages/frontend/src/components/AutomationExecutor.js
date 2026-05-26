import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { fetchAutomationJobs, createAutomationJob } from '../api';
export const AutomationExecutor = ({ agents }) => {
    const [jobs, setJobs] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(agents[0]?.id || '');
    const [command, setCommand] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        loadJobs();
        const interval = setInterval(loadJobs, 3000);
        return () => clearInterval(interval);
    }, []);
    const loadJobs = async () => {
        try {
            const data = await fetchAutomationJobs();
            setJobs(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        }
        catch (err) {
            console.error('Failed to load automation jobs:', err);
        }
    };
    const handleExecuteCommand = async () => {
        if (!command.trim() || !selectedAgent) {
            setError('Please select an agent and enter a command');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            await createAutomationJob({
                agentId: selectedAgent,
                command
            });
            setCommand('');
            await loadJobs();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to execute command');
        }
        finally {
            setLoading(false);
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-900 text-green-100';
            case 'running': return 'bg-blue-900 text-blue-100';
            case 'failed': return 'bg-red-900 text-red-100';
            default: return 'bg-yellow-900 text-yellow-100';
        }
    };
    return (_jsxs("div", { className: "bg-slate-900 text-white p-6 rounded-lg border border-blue-500", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Automation & Commands" }), error && (_jsx("div", { className: "bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4", children: error })), _jsxs("div", { className: "bg-slate-800 p-4 rounded border border-blue-500 mb-6", children: [_jsx("h3", { className: "font-semibold mb-4", children: "Execute Command" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Agent" }), _jsx("select", { value: selectedAgent, onChange: (e) => setSelectedAgent(e.target.value), className: "w-full bg-slate-700 border border-blue-500 rounded px-3 py-2 text-white focus:outline-none", children: agents.map(agent => (_jsx("option", { value: agent.id, children: agent.name }, agent.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Command" }), _jsx("textarea", { value: command, onChange: (e) => setCommand(e.target.value), placeholder: "Enter command or action for the agent...", rows: 3, className: "w-full bg-slate-700 border border-blue-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-400 font-mono text-sm" })] }), _jsx("button", { onClick: handleExecuteCommand, disabled: loading, className: "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 rounded transition", children: loading ? 'Executing...' : 'Execute' })] })] }), _jsx("h3", { className: "font-semibold mb-4", children: "Execution History" }), _jsx("div", { className: "space-y-3 max-h-64 overflow-y-auto", children: jobs.length === 0 ? (_jsx("p", { className: "text-gray-400", children: "No commands executed yet" })) : (jobs.map(job => (_jsxs("div", { className: "bg-slate-800 p-4 rounded border border-blue-500", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium text-white", children: job.command }), _jsx("div", { className: "text-xs text-gray-400 mt-1", children: agents.find(a => a.id === job.agentId)?.name || 'Unknown Agent' })] }), _jsx("span", { className: `px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(job.status)}`, children: job.status })] }), job.result && (_jsx("div", { className: "bg-slate-700 p-2 rounded mt-2 text-xs text-gray-300 font-mono max-h-24 overflow-y-auto", children: job.result })), _jsx("time", { className: "text-xs text-gray-500 block mt-2", children: new Date(job.createdAt).toLocaleString() })] }, job.id)))) })] }));
};
