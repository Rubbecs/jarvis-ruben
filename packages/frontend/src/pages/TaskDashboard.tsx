import { useEffect, useState } from 'react';
import { createTask, fetchAgents, fetchTasks, pauseTask, retryTask, resumeTask } from '../api';

export function TaskDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
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

  const handleAction = async (id: string, action: 'pause' | 'resume' | 'retry') => {
    if (action === 'pause') await pauseTask(id);
    if (action === 'resume') await resumeTask(id);
    if (action === 'retry') await retryTask(id);
    load().catch(console.error);
  };

  return (
    <section>
      <div className="panel-header">
        <h2>Task Dashboard</h2>
        <p>Orchestrate queued tasks, monitor live execution status, and review task history.</p>
      </div>
      <div className="panel-grid">
        <div className="panel-card">
          <h3>Create task</h3>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Task details" />
          <label>Agent</label>
          <select value={agentId} onChange={(e) => setAgentId(e.target.value)}>
            <option value="">Select an agent</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>
          <label>Priority</label>
          <input type="number" value={priority} onChange={(e) => setPriority(Number(e.target.value))} min={1} max={5} />
          <label>Schedule</label>
          <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
          <button onClick={handleCreate}>Add task</button>
        </div>

        <div className="panel-card full-width">
          <h3>Global task queue</h3>
          <div className="list">
            {tasks.length ? (
              tasks.map((task) => (
                <div key={task.id} className="list-item">
                  <div>
                    <strong>{task.title}</strong>
                    <p>{task.description || 'No description'}</p>
                    <small>{task.agentId ? `Agent: ${task.agentId}` : 'Unassigned'} • Priority {task.priority}</small>
                  </div>
                  <div>
                    <span>{task.status}</span>
                    <button onClick={() => handleAction(task.id, 'pause')}>Pause</button>
                    <button onClick={() => handleAction(task.id, 'resume')}>Resume</button>
                    <button onClick={() => handleAction(task.id, 'retry')}>Retry</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No tasks available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
