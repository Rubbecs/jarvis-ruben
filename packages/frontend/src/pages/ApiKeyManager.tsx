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
  const [keys, setKeys] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [provider, setProvider] = useState('OpenAI');
  const [label, setLabel] = useState('');
  const [secret, setSecret] = useState('');
  const [assignedAgents, setAssignedAgents] = useState<string[]>([]);

  const load = async () => {
    setKeys(await fetchKeys());
    setAgents(await fetchAgents());
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const handleCreate = async () => {
    if (!secret.trim()) return;
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

  const toggleAgentAssignment = (id: string) => {
    setAssignedAgents((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  return (
    <section>
      <div className="panel-header">
        <h2>API Key Manager</h2>
        <p>Store provider keys locally, assign keys to agents, and keep credentials encrypted on device.</p>
      </div>
      <div className="panel-grid">
        <div className="panel-card">
          <h3>Add provider key</h3>
          <label>Provider</label>
          <select value={provider} onChange={(e) => setProvider(e.target.value)}>
            {providers.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <label>Label</label>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Key label" />
          <label>Secret</label>
          <textarea value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="API key secret" />
          <label>Assign to agents</label>
          <div className="list">
            {agents.map((agent) => (
              <div key={agent.id} className="list-item">
                <label>
                  <input
                    type="checkbox"
                    checked={assignedAgents.includes(agent.id)}
                    onChange={() => toggleAgentAssignment(agent.id)}
                  />{' '}
                  {agent.name}
                </label>
              </div>
            ))}
          </div>
          <button onClick={handleCreate}>Store API key</button>
        </div>

        <div className="panel-card full-width">
          <h3>Saved keys</h3>
          <div className="list">
            {keys.length ? (
              keys.map((key) => (
                <div key={key.id} className="list-item">
                  <div>
                    <strong>{key.label}</strong>
                    <p>{key.provider}</p>
                    <small>Assigned to {key.assignedAgents?.length || 0} agent(s)</small>
                  </div>
                </div>
              ))
            ) : (
              <p>No API keys configured.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
