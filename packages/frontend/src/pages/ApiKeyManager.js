import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { createApiKey, fetchAgents, fetchKeys } from '../api';
const providers = [
    'OpenAI',
    'Anthropic',
    'Gemini',
    'Groq',
    'DeepSeek',
    'OpenRouter',
    'Together AI',
    'Fireworks AI',
    'Mistral',
    'Ollama',
    'LM Studio',
    'llama.cpp',
    'vLLM'
];
export function ApiKeyManager() {
    const [keys, setKeys] = useState([]);
    const [agents, setAgents] = useState([]);
    const [provider, setProvider] = useState('OpenAI');
    const [label, setLabel] = useState('');
    const [secret, setSecret] = useState('');
    const [assignedAgents, setAssignedAgents] = useState([]);
    const load = async () => {
        setKeys(await fetchKeys());
        setAgents(await fetchAgents());
    };
    useEffect(() => {
        load().catch(console.error);
    }, []);
    const handleCreate = async () => {
        if (!secret.trim())
            return;
        await createApiKey({
            provider,
            label: label || provider,
            key: secret,
            assignedAgents
        });
        setProvider('OpenAI');
        setLabel('');
        setSecret('');
        setAssignedAgents([]);
        load().catch(console.error);
    };
    const toggleAgentAssignment = (id) => {
        setAssignedAgents((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    };
    return (_jsxs("section", { children: [_jsxs("div", { className: "panel-header", children: [_jsx("h2", { children: "API Key Manager" }), _jsx("p", { children: "Store provider keys locally, assign keys to agents, and keep credentials encrypted on device." })] }), _jsxs("div", { className: "panel-grid", children: [_jsxs("div", { className: "panel-card", children: [_jsx("h3", { children: "Add provider key" }), _jsx("label", { children: "Provider" }), _jsx("select", { value: provider, onChange: (e) => setProvider(e.target.value), children: providers.map((item) => (_jsx("option", { value: item, children: item }, item))) }), _jsx("label", { children: "Label" }), _jsx("input", { value: label, onChange: (e) => setLabel(e.target.value), placeholder: "Key label" }), _jsx("label", { children: "Secret" }), _jsx("textarea", { value: secret, onChange: (e) => setSecret(e.target.value), placeholder: "API key secret" }), _jsx("label", { children: "Assign to agents" }), _jsx("div", { className: "list", children: agents.map((agent) => (_jsx("div", { className: "list-item", children: _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: assignedAgents.includes(agent.id), onChange: () => toggleAgentAssignment(agent.id) }), ' ', agent.name] }) }, agent.id))) }), _jsx("button", { onClick: handleCreate, children: "Store API key" })] }), _jsxs("div", { className: "panel-card full-width", children: [_jsx("h3", { children: "Saved keys" }), _jsx("div", { className: "list", children: keys.length ? (keys.map((key) => (_jsx("div", { className: "list-item", children: _jsxs("div", { children: [_jsx("strong", { children: key.label }), _jsx("p", { children: key.provider }), _jsxs("small", { children: ["Assigned to ", key.assignedAgents?.length || 0, " agent(s)"] })] }) }, key.id)))) : (_jsx("p", { children: "No API keys configured." })) })] })] })] }));
}
