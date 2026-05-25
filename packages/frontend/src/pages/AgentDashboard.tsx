import { useMemo, useState } from 'react';
import { createAgent, cloneAgent, exportAgents, importAgents, updateAgent } from '../api';

const models = ['local', 'gpt-4o', 'gpt-4', 'mistral', 'claude', 'llama'];

export function AgentDashboard({ agents, refresh }: { agents: any[]; refresh: () => void }) {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [personality, setPersonality] = useState('');
  const [model, setModel] = useState('local');
  const [tools, setTools] = useState('');
  const [permissions, setPermissions] = useState('');
  const [team, setTeam] = useState('');
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [importJson, setImportJson] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [editingAgent, setEditingAgent] = useState<any>(null);

  const selectedAgent = useMemo(
    () => agents.find((agent: any) => agent.id === selectedAgentId),
    [agents, selectedAgentId]
  );

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

  const startEditing = (agent: any) => {
    setSelectedAgentId(agent.id);
    setEditingAgent({ ...agent });
  };

  const handleSave = async () => {
    if (!editingAgent) return;
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

  const handleClone = async (id: string) => {
    await cloneAgent(id);
    refresh();
  };

  const handleExport = async () => {
    const data = await exportAgents();
    const text = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(text).catch(() => {});
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
    } catch (error) {
      console.error('Invalid JSON import', error);
    }
  };

  return (
    <section>
      <div className="panel-header">
        <h2>Agent Creator</h2>
        <p>Create, clone, import/export, and manage custom agent personalities and models.</p>
      </div>
      <div className="panel-grid">
        <div className="panel-card">
          <h3>New agent</h3>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Agent name" />
          <label>Prompt</label>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Agent instructions" />
          <label>Personality</label>
          <textarea value={personality} onChange={(e) => setPersonality(e.target.value)} placeholder="Character traits" />
          <label>Model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            {models.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <label>Tools</label>
          <input value={tools} onChange={(e) => setTools(e.target.value)} placeholder="Comma-separated tools" />
          <label>Permissions</label>
          <input value={permissions} onChange={(e) => setPermissions(e.target.value)} placeholder="Comma-separated permissions" />
          <label>Team</label>
          <input value={team} onChange={(e) => setTeam(e.target.value)} placeholder="Team or workflow group" />
          <label>
            <input type="checkbox" checked={memoryEnabled} onChange={(e) => setMemoryEnabled(e.target.checked)} /> Enable memory
          </label>
          <button onClick={handleCreate}>Create agent</button>
        </div>

        <div className="panel-card full-width">
          <h3>Active agents</h3>
          <div className="list">
            {agents.length ? (
              agents.map((agent: any) => (
                <div key={agent.id} className="list-item">
                  <div>
                    <strong>{agent.name}</strong>
                    <p>{agent.prompt || 'No prompt set'}</p>
                    <small>{agent.model} • {agent.team || 'No team'} • {agent.status || 'idle'}</small>
                  </div>
                  <div>
                    <button onClick={() => startEditing(agent)}>Edit</button>
                    <button onClick={() => handleClone(agent.id)}>Clone</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No agents yet.</p>
            )}
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleExport}>Export agents</button>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label>Import agent JSON</label>
            <textarea value={importJson} onChange={(e) => setImportJson(e.target.value)} placeholder='[{"name":"Agent X", "prompt":"..."}]' />
            <button onClick={handleImport}>Import</button>
          </div>
        </div>
      </div>

      {editingAgent && (
        <div className="panel-card full-width">
          <h3>Edit Agent</h3>
          <label>Name</label>
          <input value={editingAgent.name} onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })} />
          <label>Prompt</label>
          <textarea value={editingAgent.prompt} onChange={(e) => setEditingAgent({ ...editingAgent, prompt: e.target.value })} />
          <label>Personality</label>
          <textarea value={editingAgent.personality} onChange={(e) => setEditingAgent({ ...editingAgent, personality: e.target.value })} />
          <label>Model</label>
          <select value={editingAgent.model} onChange={(e) => setEditingAgent({ ...editingAgent, model: e.target.value })}>
            {models.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <label>Tools</label>
          <input value={(editingAgent.tools || []).join(', ')} onChange={(e) => setEditingAgent({ ...editingAgent, tools: e.target.value.split(',').map((item: string) => item.trim()) })} />
          <label>Permissions</label>
          <input value={(editingAgent.permissions || []).join(', ')} onChange={(e) => setEditingAgent({ ...editingAgent, permissions: e.target.value.split(',').map((item: string) => item.trim()) })} />
          <label>Team</label>
          <input value={editingAgent.team || ''} onChange={(e) => setEditingAgent({ ...editingAgent, team: e.target.value })} />
          <label>
            <input type="checkbox" checked={editingAgent.memoryEnabled} onChange={(e) => setEditingAgent({ ...editingAgent, memoryEnabled: e.target.checked })} /> Enable memory
          </label>
          <button onClick={handleSave}>Save changes</button>
        </div>
      )}
    </section>
  );
}
