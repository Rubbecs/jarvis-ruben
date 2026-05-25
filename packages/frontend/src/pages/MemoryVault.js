import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { createMemoryNode, fetchMemory } from '../api';
export function MemoryVault() {
    const [nodes, setNodes] = useState([]);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [tags, setTags] = useState('');
    const [links, setLinks] = useState('');
    const load = async () => {
        setNodes(await fetchMemory());
    };
    useEffect(() => {
        load().catch(console.error);
    }, []);
    const handleCreate = async () => {
        await createMemoryNode({
            title,
            body,
            tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
            links: links.split(',').map((link) => link.trim()).filter(Boolean)
        });
        setTitle('');
        setBody('');
        setTags('');
        setLinks('');
        load().catch(console.error);
    };
    return (_jsxs("section", { children: [_jsxs("div", { className: "panel-header", children: [_jsx("h2", { children: "Memory Vault" }), _jsx("p", { children: "View local markdown-style memory nodes, tags, and backlink relationships." })] }), _jsxs("div", { className: "panel-grid", children: [_jsxs("div", { className: "panel-card", children: [_jsx("h3", { children: "Create memory note" }), _jsx("label", { children: "Title" }), _jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Note title" }), _jsx("label", { children: "Body" }), _jsx("textarea", { value: body, onChange: (e) => setBody(e.target.value), placeholder: "Note body" }), _jsx("label", { children: "Tags" }), _jsx("input", { value: tags, onChange: (e) => setTags(e.target.value), placeholder: "Comma-separated tags" }), _jsx("label", { children: "Links" }), _jsx("input", { value: links, onChange: (e) => setLinks(e.target.value), placeholder: "Comma-separated backlinks" }), _jsx("button", { onClick: handleCreate, children: "Save note" })] }), _jsxs("div", { className: "panel-card full-width", children: [_jsx("h3", { children: "Vault explorer" }), _jsx("div", { className: "list", children: nodes.length ? (nodes.map((node) => (_jsx("div", { className: "list-item", children: _jsxs("div", { children: [_jsx("strong", { children: node.title }), _jsxs("p", { children: [node.body.slice(0, 120), "..."] }), _jsx("small", { children: (node.tags || []).join(', ') || 'No tags' })] }) }, node.id)))) : (_jsx("p", { children: "No memory entries found." })) })] })] })] }));
}
