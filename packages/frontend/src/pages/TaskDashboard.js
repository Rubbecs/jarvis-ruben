import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { createTask, fetchAgents, fetchTasks, pauseTask, retryTask, resumeTask } from '../api';
export function TaskDashboard() {
    const [tasks, setTasks] = useState([]);
    const [agents, setAgents] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [agentId, setAgentId] = useState('');
    const [priority, setPriority] = useState(3);
    const [scheduledAt, setScheduledAt] = useState('');
    const load = async () => {
        setTasks(await fetchTasks());
        setAgents(await fetchAgents());
    };
    useEffect(() => {
        load().catch(console.error);
    }, []);
    const handleCreate = async () => {
        await createTask({
            title,
            description,
            agentId,
            priority,
            scheduledAt: scheduledAt || undefined,
            status: 'pending',
            workflow: [],
            history: []
        });
        setTitle('');
        setDescription('');
        setAgentId('');
        setPriority(3);
        setScheduledAt('');
        load().catch(console.error);
    };
    const handleAction = async (id, action) => {
        if (action === 'pause')
            await pauseTask(id);
        if (action === 'resume')
            await resumeTask(id);
        if (action === 'retry')
            await retryTask(id);
        load().catch(console.error);
    };
    return (_jsxs("section", { children: [_jsxs("div", { className: "panel-header", children: [_jsx("h2", { children: "Task Dashboard" }), _jsx("p", { children: "Orchestrate queued tasks, monitor live execution status, and review task history." })] }), _jsxs("div", { className: "panel-grid", children: [_jsxs("div", { className: "panel-card", children: [_jsx("h3", { children: "Create task" }), _jsx("label", { children: "Title" }), _jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Task title" }), _jsx("label", { children: "Description" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Task details" }), _jsx("label", { children: "Agent" }), _jsxs("select", { value: agentId, onChange: (e) => setAgentId(e.target.value), children: [_jsx("option", { value: "", children: "Select an agent" }), agents.map((agent) => (_jsx("option", { value: agent.id, children: agent.name }, agent.id)))] }), _jsx("label", { children: "Priority" }), _jsx("input", { type: "number", value: priority, onChange: (e) => setPriority(Number(e.target.value)), min: 1, max: 5 }), _jsx("label", { children: "Schedule" }), _jsx("input", { type: "datetime-local", value: scheduledAt, onChange: (e) => setScheduledAt(e.target.value) }), _jsx("button", { onClick: handleCreate, children: "Add task" })] }), _jsxs("div", { className: "panel-card full-width", children: [_jsx("h3", { children: "Global task queue" }), _jsx("div", { className: "list", children: tasks.length ? (tasks.map((task) => (_jsxs("div", { className: "list-item", children: [_jsxs("div", { children: [_jsx("strong", { children: task.title }), _jsx("p", { children: task.description || 'No description' }), _jsxs("small", { children: [task.agentId ? `Agent: ${task.agentId}` : 'Unassigned', " \u2022 Priority ", task.priority] })] }), _jsxs("div", { children: [_jsx("span", { children: task.status }), _jsx("button", { onClick: () => handleAction(task.id, 'pause'), children: "Pause" }), _jsx("button", { onClick: () => handleAction(task.id, 'resume'), children: "Resume" }), _jsx("button", { onClick: () => handleAction(task.id, 'retry'), children: "Retry" })] })] }, task.id)))) : (_jsx("p", { children: "No tasks available." })) })] })] })] }));
}
