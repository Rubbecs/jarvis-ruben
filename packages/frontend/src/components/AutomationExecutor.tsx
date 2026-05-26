import React, { useState, useEffect } from 'react';
import { Agent, AutomationJob } from '../types';
import { fetchAutomationJobs, createAutomationJob } from '../api';

interface AutomationExecutorProps {
  agents: Agent[];
}

export const AutomationExecutor: React.FC<AutomationExecutorProps> = ({ agents }) => {
  const [jobs, setJobs] = useState<AutomationJob[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>(agents[0]?.id || '');
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadJobs = async () => {
    try {
      const data = await fetchAutomationJobs();
      setJobs(data.sort((a: AutomationJob, b: AutomationJob) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (err) {
      console.error('Failed to load automation jobs:', err);
    }
  };

  const handleExecuteCommand = async () => {
    if (!command.trim() || !selectedAgent) {
      setError('Please select an agent and enter a command');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createAutomationJob({
        agentId: selectedAgent,
        command
      });
      setCommand('');
      await loadJobs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute command');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-900 text-green-100';
      case 'running': return 'bg-blue-900 text-blue-100';
      case 'failed': return 'bg-red-900 text-red-100';
      default: return 'bg-yellow-900 text-yellow-100';
    }
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-lg border border-blue-500">
      <h2 className="text-2xl font-bold mb-6">Automation & Commands</h2>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Command Executor */}
      <div className="bg-slate-800 p-4 rounded border border-blue-500 mb-6">
        <h3 className="font-semibold mb-4">Execute Command</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Agent</label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full bg-slate-700 border border-blue-500 rounded px-3 py-2 text-white focus:outline-none"
            >
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Command</label>
            <textarea
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Enter command or action for the agent..."
              rows={3}
              className="w-full bg-slate-700 border border-blue-500 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-400 font-mono text-sm"
            />
          </div>
          <button
            onClick={handleExecuteCommand}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 rounded transition"
          >
            {loading ? 'Executing...' : 'Execute'}
          </button>
        </div>
      </div>

      {/* Job History */}
      <h3 className="font-semibold mb-4">Execution History</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {jobs.length === 0 ? (
          <p className="text-gray-400">No commands executed yet</p>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="bg-slate-800 p-4 rounded border border-blue-500">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="font-medium text-white">{job.command}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {agents.find(a => a.id === job.agentId)?.name || 'Unknown Agent'}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
              </div>
              {job.result && (
                <div className="bg-slate-700 p-2 rounded mt-2 text-xs text-gray-300 font-mono max-h-24 overflow-y-auto">
                  {job.result}
                </div>
              )}
              <time className="text-xs text-gray-500 block mt-2">
                {new Date(job.createdAt).toLocaleString()}
              </time>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
