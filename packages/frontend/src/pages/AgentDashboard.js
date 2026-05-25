import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { createAgent, cloneAgent, exportAgents, importAgents, updateAgent } from '../api';
const models = ['local', 'gpt-4o', 'gpt-4', 'mistral', 'claude', 'llama'];
export function AgentDashboard({ agents, refresh }) {
    const [name, setName] = useState('');
    const [prompt, setPrompt] = useState('');
    const [personality, setPersonality] = useState('');
    const [model, setModel] = useState('local');
    const [tools, setTools] = useState('');
    const [permissions, setPermissions] = useState('');
    const [team, setTeam] = useState('');
    const [memoryEnabled, setMemoryEnabled] = useState(true);
    const [importJson, setImportJson] = useState('');
    const [selectedAgentId, setSelectedAgentId] = useState(null);
    const [editingAgent, setEditingAgent] = useState(null);
    const selectedAgent = useMemo(() => agents.find((agent) => agent.id === selectedAgentId), [agents, selectedAgentId]);
    const handleCreate = async () => {
        await createAgent({
            name,
            prompt,
            personality,
            model,
            tools: tools.split(',').map((tool) => tool.trim()).filter(Boolean),
            permissions: permissions.split(',').map((permission) => permission.trim()).filter(Boolean),
            team,
            memoryEnabled
        });
        setName('');
        setPrompt('');
        setPersonality('');
        setModel('local');
        setTools('');
        setPermissions('');
        setTeam('');
        setMemoryEnabled(true);
        refresh();
    };
    const startEditing = (agent) => {
        setSelectedAgentId(agent.id);
        setEditingAgent({ ...agent });
    };
    const handleSave = async () => {
        if (!editingAgent)
            return;
        await updateAgent(editingAgent.id, {
            name: editingAgent.name,
            prompt: editingAgent.prompt,
            personality: editingAgent.personality,
            model: editingAgent.model,
            tools: editingAgent.tools,
            permissions: editingAgent.permissions,
            team: editingAgent.team,
            memoryEnabled: editingAgent.memoryEnabled
        });
        setEditingAgent(null);
        setSelectedAgentId(null);
        refresh();
    };
    const handleClone = async (id) => {
        await cloneAgent(id);
        refresh();
    };
    const handleExport = async () => {
        const data = await exportAgents();
        const text = JSON.stringify(data, null, 2);
        navigator.clipboard.writeText(text).catch(() => { });
        const blob = new Blob([text], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'agents-export.json';
        anchor.click();
        URL.revokeObjectURL(url);
    };
    const handleImport = async () => {
        try {
            const parsed = JSON.parse(importJson);
            const agentsToImport = Array.isArray(parsed) ? parsed : parsed.agents || [];
            await importAgents(agentsToImport);
            setImportJson('');
            refresh();
        }
        catch (error) {
            console.error('Invalid JSON import', error);
        }
    };
    return (_jsxs("section", { children: [_jsxs("div", { className: "panel-header", children: [_jsx("h2", { children: "Agent Creator" }), _jsx("p", { children: "Create, clone, import/export, and manage custom agent personalities and models." })] }), _jsxs("div", { className: "panel-grid", children: [_jsxs("div", { className: "panel-card", children: [_jsx("h3", { children: "New agent" }), _jsx("label", { children: "Name" }), _jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "Agent name" }), _jsx("label", { children: "Prompt" }), _jsx("textarea", { value: prompt, onChange: (e) => setPrompt(e.target.value), placeholder: "Agent instructions" }), _jsx("label", { children: "Personality" }), _jsx("textarea", { value: personality, onChange: (e) => setPersonality(e.target.value), placeholder: "Character traits" }), _jsx("label", { children: "Model" }), _jsx("select", { value: model, onChange: (e) => setModel(e.target.value), children: models.map((option) => (_jsx("option", { value: option, children: option }, option))) }), _jsx("label", { children: "Tools" }), _jsx("input", { value: tools, onChange: (e) => setTools(e.target.value), placeholder: "Comma-separated tools" }), _jsx("label", { children: "Permissions" }), _jsx("input", { value: permissions, onChange: (e) => setPermissions(e.target.value), placeholder: "Comma-separated permissions" }), _jsx("label", { children: "Team" }), _jsx("input", { value: team, onChange: (e) => setTeam(e.target.value), placeholder: "Team or workflow group" }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: memoryEnabled, onChange: (e) => setMemoryEnabled(e.target.checked) }), " Enable memory"] }), _jsx("button", { onClick: handleCreate, children: "Create agent" })] }), _jsxs("div", { className: "panel-card full-width", children: [_jsx("h3", { children: "Active agents" }), _jsx("div", { className: "list", children: agents.length ? (agents.map((agent) => (_jsxs("div", { className: "list-item", children: [_jsxs("div", { children: [_jsx("strong", { children: agent.name }), _jsx("p", { children: agent.prompt || 'No prompt set' }), _jsxs("small", { children: [agent.model, " \u2022 ", agent.team || 'No team', " \u2022 ", agent.status || 'idle'] })] }), _jsxs("div", { children: [_jsx("button", { onClick: () => startEditing(agent), children: "Edit" }), _jsx("button", { onClick: () => handleClone(agent.id), children: "Clone" })] })] }, agent.id)))) : (_jsx("p", { children: "No agents yet." })) }), _jsx("div", { style: { marginTop: '1rem' }, children: _jsx("button", { onClick: handleExport, children: "Export agents" }) }), _jsxs("div", { style: { marginTop: '1rem' }, children: [_jsx("label", { children: "Import agent JSON" }), _jsx("textarea", { value: importJson, onChange: (e) => setImportJson(e.target.value), placeholder: '[{"name":"Agent X", "prompt":"..."}]' }), _jsx("button", { onClick: handleImport, children: "Import" })] })] })] }), editingAgent && (_jsxs("div", { className: "panel-card full-width", children: [_jsx("h3", { children: "Edit Agent" }), _jsx("label", { children: "Name" }), _jsx("input", { value: editingAgent.name, onChange: (e) => setEditingAgent({ ...editingAgent, name: e.target.value }) }), _jsx("label", { children: "Prompt" }), _jsx("textarea", { value: editingAgent.prompt, onChange: (e) => setEditingAgent({ ...editingAgent, prompt: e.target.value }) }), _jsx("label", { children: "Personality" }), _jsx("textarea", { value: editingAgent.personality, onChange: (e) => setEditingAgent({ ...editingAgent, personality: e.target.value }) }), _jsx("label", { children: "Model" }), _jsx("select", { value: editingAgent.model, onChange: (e) => setEditingAgent({ ...editingAgent, model: e.target.value }), children: models.map((option) => (_jsx("option", { value: option, children: option }, option))) }), _jsx("label", { children: "Tools" }), _jsx("input", { value: (editingAgent.tools || []).join(', '), onChange: (e) => setEditingAgent({ ...editingAgent, tools: e.target.value.split(',').map((item) => item.trim()) }) }), _jsx("label", { children: "Permissions" }), _jsx("input", { value: (editingAgent.permissions || []).join(', '), onChange: (e) => setEditingAgent({ ...editingAgent, permissions: e.target.value.split(',').map((item) => item.trim()) }) }), _jsx("label", { children: "Team" }), _jsx("input", { value: editingAgent.team || '', onChange: (e) => setEditingAgent({ ...editingAgent, team: e.target.value }) }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: editingAgent.memoryEnabled, onChange: (e) => setEditingAgent({ ...editingAgent, memoryEnabled: e.target.checked }) }), " Enable memory"] }), _jsx("button", { onClick: handleSave, children: "Save changes" })] }))] }));
}
