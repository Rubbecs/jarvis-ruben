import { useEffect, useState } from 'react';
import { AgentDashboard } from './pages/AgentDashboard';
import { TaskDashboard } from './pages/TaskDashboard';
import { MemoryVault } from './pages/MemoryVault';
import { ApiKeyManager } from './pages/ApiKeyManager';
import { fetchAgents } from './api';
import './styles/global.css';

const tabs = [
  { id: 'agents', label: 'Agents' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'memory', label: 'Memory Vault' },
  { id: 'keys', label: 'API Keys' }
];

type TabId = 'agents' | 'tasks' | 'memory' | 'keys';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('agents');
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetchAgents().then(setAgents).catch(console.error);
  }, []);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Jarvis Ruben</h1>
          <p>Local-first multi-agent orchestration dashboard</p>
        </div>
        <nav className="app-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => setActiveTab(tab.id as TabId)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'agents' && <AgentDashboard agents={agents} refresh={() => fetchAgents().then(setAgents)} />}
        {activeTab === 'tasks' && <TaskDashboard />}
        {activeTab === 'memory' && <MemoryVault />}
        {activeTab === 'keys' && <ApiKeyManager />}
      </main>
    </div>
  );
}

export default App;
