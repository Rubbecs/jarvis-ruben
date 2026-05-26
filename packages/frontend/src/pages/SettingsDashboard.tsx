import React, { useState, useEffect } from 'react';
import { Tool, Agent, ApiKey } from '../types';
import { fetchTools, fetchKeys, createApiKey, fetchAgents, updateAgent } from '../api';

interface SettingsProps {
  agents: Agent[];
  onRefresh: () => void;
}

export const SettingsDashboard: React.FC<SettingsProps> = ({ agents, onRefresh }) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [activeTab, setActiveTab] = useState<'tools' | 'integrations' | 'agent-setup'>('tools');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Integration form states
  const [newKeyProvider, setNewKeyProvider] = useState('discord');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add API key');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToolToAgent = async (agentId: string, toolId: string) => {
    try {
      const agent = agents.find(a => a.id === agentId);
      if (!agent) return;

      const updatedTools = agent.tools.includes(toolId)
        ? agent.tools.filter(t => t !== toolId)
        : [...agent.tools, toolId];

      await updateAgent(agentId, { tools: updatedTools });
      onRefresh();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update agent');
    }
  };

  const getToolsByCategory = (category: string) => {
    return tools.filter(t => t.category === category);
  };

  const categories = ['communication', 'email', 'productivity', 'automation', 'development', 'storage', 'collaboration', 'utility'];

  return (
    <div className="bg-slate-900 text-white p-6 rounded-lg border border-blue-500">
      <h2 className="text-2xl font-bold mb-6">Settings & Plugins</h2>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-blue-500">
        {['tools', 'integrations', 'agent-setup'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 capitalize font-medium transition ${
              activeTab === tab
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Tools Tab */}
      {activeTab === 'tools' && (
        <div>
          <p className="text-gray-400 mb-6">Available tools and integrations ({tools.length} total)</p>
          {categories.map(category => {
            const categoryTools = getToolsByCategory(category);
            if (categoryTools.length === 0) return null;

            return (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-semibold text-blue-400 capitalize mb-3">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categoryTools.map(tool => (
                    <div key={tool.id} className="bg-slate-800 p-3 rounded border border-blue-500 hover:border-blue-400 transition">
                      <div className="font-medium text-white">{tool.name}</div>
                      <div className="text-sm text-gray-400">{tool.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div>
          <div className="bg-slate-800 p-6 rounded border border-blue-500 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add API Key</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Provider</label>
                <select
                  value={newKeyProvider}
                  onChange={(e) => setNewKeyProvider(e.target.value)}
                  className="w-full bg-slate-700 border border-blue-500 rounded px-3 py-2 text-white"
                >
                  <option value="discord">Discord</option>
                  <option value="gmail">Gmail</option>
                  <option value="slack">Slack</option>
                  <option value="github">GitHub</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="groq">Groq</option>
                  <option value="gemini">Gemini</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">API Key</label>
                <input
                  type="password"
                  value={newKeyValue}
                  onChange={(e) => setNewKeyValue(e.target.value)}
                  placeholder="Paste your API key..."
                  className="w-full bg-slate-700 border border-blue-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Label (optional)</label>
                <input
                  type="text"
                  value={newKeyLabel}
                  onChange={(e) => setNewKeyLabel(e.target.value)}
                  placeholder="e.g., 'My Discord Bot'"
                  className="w-full bg-slate-700 border border-blue-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Assign to Agents</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {agents.map(agent => (
                    <label key={agent.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAgents.includes(agent.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAgents([...selectedAgents, agent.id]);
                          } else {
                            setSelectedAgents(selectedAgents.filter(id => id !== agent.id));
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{agent.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                onClick={handleAddKey}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 rounded transition"
              >
                {loading ? 'Adding...' : 'Add Key'}
              </button>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Active Keys</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {keys.length === 0 ? (
              <p className="text-gray-400">No API keys configured yet</p>
            ) : (
              keys.map(key => (
                <div key={key.id} className="bg-slate-800 p-3 rounded border border-blue-500 flex items-center justify-between">
                  <div>
                    <div className="font-medium capitalize">{key.provider}</div>
                    <div className="text-sm text-gray-400">{key.label}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {key.assignedAgents?.length || 0} agent(s)
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Agent Setup Tab */}
      {activeTab === 'agent-setup' && (
        <div>
          <p className="text-gray-400 mb-6">Assign tools to agents for enhanced capabilities</p>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {agents.map(agent => (
              <div key={agent.id} className="bg-slate-800 p-4 rounded border border-blue-500">
                <h4 className="font-semibold mb-3">{agent.name}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {tools.map(tool => (
                    <label
                      key={tool.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-slate-700 p-2 rounded transition"
                    >
                      <input
                        type="checkbox"
                        checked={agent.tools.includes(tool.id)}
                        onChange={() => handleAssignToolToAgent(agent.id, tool.id)}
                        disabled={loading}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{tool.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
