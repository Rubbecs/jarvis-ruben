import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { createAutomationJob } from '../api';
export const ChatPanel = ({ agent, agents, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(agent);
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const handleSendMessage = async () => {
        if (!input.trim() || !selectedAgent)
            return;
        const userMessage = {
            id: Date.now().toString(),
            agentId: selectedAgent.id,
            role: 'user',
            content: input,
            timestamp: new Date().toISOString()
        };
        setMessages([...messages, userMessage]);
        setInput('');
        setLoading(true);
        try {
            // Execute command with agent
            const result = await createAutomationJob({
                agentId: selectedAgent.id,
                command: input
            });
            const agentMessage = {
                id: Date.now().toString() + '1',
                agentId: selectedAgent.id,
                role: 'agent',
                content: result.result || 'Command queued for execution',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, agentMessage]);
        }
        catch (error) {
            const errorMessage = {
                id: Date.now().toString() + '2',
                agentId: selectedAgent.id,
                role: 'agent',
                content: `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        }
        finally {
            setLoading(false);
        }
    };
    if (!selectedAgent)
        return null;
    return (_jsxs("div", { className: "fixed bottom-4 right-4 w-96 h-96 bg-slate-900 border border-blue-500 rounded-lg shadow-lg flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-blue-500", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-green-500 rounded-full" }), _jsx("select", { value: selectedAgent.id, onChange: (e) => {
                                    const agent = agents.find(a => a.id === e.target.value);
                                    if (agent)
                                        setSelectedAgent(agent);
                                }, className: "bg-slate-800 text-white text-sm rounded px-2 py-1 border border-blue-500", children: agents.map(a => (_jsx("option", { value: a.id, children: a.name }, a.id))) })] }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-white text-xl", children: "\u2715" })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: [messages.length === 0 && (_jsxs("div", { className: "text-gray-500 text-sm text-center mt-10", children: ["Start chatting with ", selectedAgent.name, "..."] })), messages.map((msg) => (_jsx("div", { className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-xs px-3 py-2 rounded-lg text-sm ${msg.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 text-gray-100'}`, children: msg.content }) }, msg.id))), loading && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-slate-700 px-3 py-2 rounded-lg text-sm text-gray-400", children: "Thinking..." }) })), _jsx("div", { ref: messagesEndRef })] }), _jsxs("div", { className: "border-t border-blue-500 p-3 flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSendMessage(), placeholder: "Message...", disabled: loading, className: "flex-1 bg-slate-800 text-white text-sm rounded px-3 py-2 border border-blue-500 focus:outline-none focus:border-blue-400" }), _jsx("button", { onClick: handleSendMessage, disabled: loading || !input.trim(), className: "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium", children: "Send" })] })] }));
};
