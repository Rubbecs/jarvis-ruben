import { useEffect, useState } from 'react';
import { AgentDashboard } from './pages/AgentDashboard';
import { TaskDashboard } from './pages/TaskDashboard';
import { MemoryVault } from './pages/MemoryVault';
import { ApiKeyManager } from './pages/ApiKeyManager';
import { SettingsDashboard } from './pages/SettingsDashboard';
import { AutomationExecutor } from './components/AutomationExecutor';
import { ChatPanel } from './components/ChatPanel';
import { NotificationCenter } from './components/NotificationCenter';
import { fetchAgents, type Agent } from './api';
import './styles/global.css';

const tabs = [
  { id: 'agents', label: '🤖 Agents' },
  { id: 'tasks', label: '✓ Tasks' },
  { id: 'memory', label: '🧠 Memory' },
  { id: 'automation', label: '⚙️ Automation' },
  { id: 'settings', label: '⚡ Settings' },
  { id: 'keys', label: '🔑 Keys' }
];

type TabId = 'agents' | 'tasks' | 'memory' | 'automation' | 'settings' | 'keys';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('agents');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const data = await fetchAgents();
      setAgents(data);
      if (data.length > 0 && !selectedAgent) {
        setSelectedAgent(data[0]);
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🤖</div>
          <div>
            <h1>Jarvis Ruben</h1>
            <p>Local-first multi-agent orchestration — OpenSwarm for localhost</p>
          </div>
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
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative px-3 py-2 hover:bg-blue-600 rounded transition"
            title="Notifications"
          >
            🔔
          </button>
          {agents.length > 0 && (
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded transition font-medium"
            >
              💬 Chat
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'agents' && <AgentDashboard agents={agents} refresh={loadAgents} />}
        {activeTab === 'tasks' && <TaskDashboard />}
        {activeTab === 'memory' && <MemoryVault />}
        {activeTab === 'keys' && <ApiKeyManager />}
        {activeTab === 'automation' && <AutomationExecutor agents={agents} />}
        {activeTab === 'settings' && <SettingsDashboard agents={agents} onRefresh={loadAgents} />}
      </main>

      {/* Floating Chat Panel */}
      {chatOpen && (
        <ChatPanel
          agent={selectedAgent}
          agents={agents}
          onClose={() => setChatOpen(false)}
        />
      )}

      {/* Notification Center */}
      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
}

export default App;
