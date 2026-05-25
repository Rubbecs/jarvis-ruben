import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'express-async-errors';
import { json } from 'express';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import {
  createAgent,
  deleteAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  getAllTasks,
  createTask,
  updateTask,
  getTasksByAgentId,
  getAllApiKeys,
  createApiKey,
  updateApiKey,
  getMemoryNodes,
  createMemoryNode,
  getWorkflowTemplates,
  getWorkflowTemplateById,
  createWorkflowTemplate,
  updateWorkflowTemplate,
  deleteWorkflowTemplate,
  getNotifications,
  createNotification,
  markNotificationRead,
  getAutomationJobs,
  createAutomationJob,
  searchVectorEntries,
  createVectorEntry
} from './db.js';
import { encryptApiKey } from './utils/crypto.js';
import { Agent, ApiKey, MemoryNode, Task, WorkflowTemplate, Notification } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 4000);
const staticPath = join(__dirname, '../frontend/dist');

app.use(cors());
app.use(json());
app.use(morgan('dev'));
app.use(express.static(staticPath));

const api = Router();
const voiceEvents: any[] = [];

api.get('/agents', (_req, res) => {
  res.json(getAllAgents());
});

api.get('/agents/:id', (req, res) => {
  const agent = getAgentById(req.params.id);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.json(agent);
});

api.post('/agents', (req, res) => {
  const now = new Date().toISOString();
  const agent: Agent = {
    id: randomUUID(),
    name: req.body.name,
    prompt: req.body.prompt || '',
    personality: req.body.personality || '',
    model: req.body.model || 'local',
    tools: req.body.tools || [],
    memoryEnabled: !!req.body.memoryEnabled,
    permissions: req.body.permissions || [],
    team: req.body.team || '',
    status: 'idle',
    createdAt: now,
    updatedAt: now
  };
  createAgent(agent);
  res.status(201).json(agent);
});

api.post('/agents/:id/clone', (req, res) => {
  const source = getAgentById(req.params.id);
  if (!source) return res.status(404).json({ error: 'Agent not found' });
  const now = new Date().toISOString();
  const clone: Agent = {
    ...source,
    id: randomUUID(),
    name: `${source.name} (copy)`,
    status: 'idle',
    createdAt: now,
    updatedAt: now
  };
  createAgent(clone);
  res.status(201).json(clone);
});

api.get('/agents/export', (_req, res) => {
  res.json(getAllAgents());
});

api.post('/agents/import', (req, res) => {
  const imported = Array.isArray(req.body.agents) ? req.body.agents : [];
  const created: Agent[] = [];
  const now = new Date().toISOString();
  for (const raw of imported) {
    const agent: Agent = {
      id: raw.id || randomUUID(),
      name: raw.name || 'Imported agent',
      prompt: raw.prompt || '',
      personality: raw.personality || '',
      model: raw.model || 'local',
      tools: raw.tools || [],
      memoryEnabled: !!raw.memoryEnabled,
      permissions: raw.permissions || [],
      team: raw.team || '',
      status: raw.status || 'idle',
      createdAt: raw.createdAt || now,
      updatedAt: now
    };
    createAgent(agent);
    created.push(agent);
  }
  res.status(201).json(created);
});

api.put('/agents/:id', (req, res) => {
  const agent = getAgentById(req.params.id);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  const updated: Agent = {
    ...agent,
    ...req.body,
    tools: req.body.tools ?? agent.tools,
    permissions: req.body.permissions ?? agent.permissions,
    memoryEnabled: req.body.memoryEnabled ?? agent.memoryEnabled,
    updatedAt: new Date().toISOString()
  };
  updateAgent(updated);
  res.json(updated);
});

api.delete('/agents/:id', (req, res) => {
  deleteAgent(req.params.id);
  res.status(204).end();
});

api.get('/tasks', (_req, res) => {
  res.json(getAllTasks());
});

api.post('/tasks', (req, res) => {
  const now = new Date().toISOString();
  const task: Task = {
    id: randomUUID(),
    agentId: req.body.agentId,
    title: req.body.title,
    description: req.body.description || '',
    status: req.body.status || 'pending',
    priority: req.body.priority ?? 3,
    workflow: req.body.workflow || [],
    history: req.body.history || [],
    scheduledAt: req.body.scheduledAt || undefined,
    createdAt: now,
    updatedAt: now
  };
  createTask(task);
  res.status(201).json(task);
});

api.put('/tasks/:id', (req, res) => {
  const tasks = getAllTasks();
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const updated: Task = {
    ...task,
    ...req.body,
    workflow: req.body.workflow ?? task.workflow,
    history: req.body.history ?? task.history,
    scheduledAt: req.body.scheduledAt ?? task.scheduledAt,
    updatedAt: new Date().toISOString()
  };
  updateTask(updated);
  res.json(updated);
});

const updateTaskStatus = (task: Task, status: string, event: string) => {
  const history = Array.isArray(task.history) ? [...task.history] : [];
  history.push({ event, timestamp: new Date().toISOString() });
  const updated: Task = {
    ...task,
    status,
    history,
    updatedAt: new Date().toISOString()
  };
  updateTask(updated);
  return updated;
};

api.post('/tasks/:id/retry', (req, res) => {
  const task = getAllTasks().find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const updated = updateTaskStatus(task, 'pending', 'retry');
  res.json(updated);
});

api.post('/tasks/:id/pause', (req, res) => {
  const task = getAllTasks().find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const updated = updateTaskStatus(task, 'paused', 'pause');
  res.json(updated);
});

api.post('/tasks/:id/resume', (req, res) => {
  const task = getAllTasks().find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const updated = updateTaskStatus(task, task.status === 'completed' ? 'completed' : 'pending', 'resume');
  res.json(updated);
});

api.get('/tasks/agent/:agentId', (req, res) => {
  res.json(getTasksByAgentId(req.params.agentId));
});

api.get('/keys', (_req, res) => {
  res.json(getAllApiKeys());
});

api.post('/keys', (req, res) => {
  const now = new Date().toISOString();
  const encryptedKey = encryptApiKey(req.body.key);
  const key: ApiKey = {
    id: randomUUID(),
    provider: req.body.provider,
    encryptedKey,
    label: req.body.label || req.body.provider,
    assignedAgents: req.body.assignedAgents || [],
    createdAt: now
  };
  createApiKey(key);
  res.status(201).json({ ...key, encryptedKey: undefined });
});

api.put('/keys/:id', (req, res) => {
  const all = getAllApiKeys();
  const existing = all.find((k) => k.id === req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'API key not found' });
  }
  const updated: ApiKey = {
    ...existing,
    provider: req.body.provider ?? existing.provider,
    encryptedKey: req.body.key ? encryptApiKey(req.body.key) : existing.encryptedKey,
    label: req.body.label ?? existing.label,
    assignedAgents: req.body.assignedAgents ?? existing.assignedAgents,
    createdAt: existing.createdAt
  };
  updateApiKey(updated);
  res.json({ ...updated, encryptedKey: undefined });
});

api.get('/memory', (_req, res) => {
  res.json(getMemoryNodes());
});

api.post('/memory', (req, res) => {
  const now = new Date().toISOString();
  const node: MemoryNode = {
    id: randomUUID(),
    agentId: req.body.agentId || 'global',
    title: req.body.title,
    body: req.body.body || '',
    tags: req.body.tags || [],
    links: req.body.links || [],
    createdAt: now,
    updatedAt: now
  };
  createMemoryNode(node);
  res.status(201).json(node);
});

api.get('/workflow/templates', (_req, res) => {
  res.json(getWorkflowTemplates());
});

api.post('/workflow/templates', (req, res) => {
  const now = new Date().toISOString();
  const template: WorkflowTemplate = {
    id: randomUUID(),
    name: req.body.name,
    description: req.body.description || '',
    steps: req.body.steps || [],
    assignedAgents: req.body.assignedAgents || [],
    createdAt: now,
    updatedAt: now
  };
  createWorkflowTemplate(template);
  res.status(201).json(template);
});

api.put('/workflow/templates/:id', (req, res) => {
  const existing = getWorkflowTemplateById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Workflow template not found' });
  const updated: WorkflowTemplate = {
    ...existing,
    ...req.body,
    steps: req.body.steps ?? existing.steps,
    assignedAgents: req.body.assignedAgents ?? existing.assignedAgents,
    updatedAt: new Date().toISOString()
  };
  updateWorkflowTemplate(updated);
  res.json(updated);
});

api.delete('/workflow/templates/:id', (req, res) => {
  deleteWorkflowTemplate(req.params.id);
  res.status(204).end();
});

api.post('/workflow/execute', (req, res) => {
  const templateId = req.body.templateId;
  const agentIds = Array.isArray(req.body.agentIds) ? req.body.agentIds : [];

  if (templateId) {
    const template = getWorkflowTemplateById(templateId);
    if (!template) {
      return res.status(404).json({ error: 'Workflow template not found' });
    }
    const tasks: Task[] = [];
    const now = new Date().toISOString();
    agentIds.forEach((agentId: string) => {
      const task: Task = {
        id: randomUUID(),
        agentId,
        title: `Workflow: ${template.name}`,
        description: template.description,
        status: 'pending',
        priority: req.body.priority ?? 3,
        workflow: template.steps,
        history: [{ event: 'created', timestamp: now }],
        createdAt: now,
        updatedAt: now
      };
      createTask(task);
      tasks.push(task);
    });
    return res.json({ tasks });
  }

  const customTask: Task = {
    id: randomUUID(),
    agentId: req.body.agentId,
    title: req.body.title || 'Orchestrated task',
    description: req.body.description || '',
    status: 'pending',
    priority: req.body.priority ?? 3,
    workflow: req.body.workflow || [],
    history: [{ event: 'created', timestamp: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  createTask(customTask);
  res.status(201).json(customTask);
});

api.get('/search/vectors', (req, res) => {
  const query = String(req.query.q || '');
  res.json(searchVectorEntries(query));
});

api.post('/vectors', (req, res) => {
  const now = new Date().toISOString();
  const entry = {
    id: randomUUID(),
    sourceId: req.body.sourceId || 'memory',
    content: req.body.content || '',
    tags: req.body.tags || [],
    vector: req.body.vector || [],
    createdAt: now,
    updatedAt: now
  };
  createVectorEntry(entry);
  res.status(201).json(entry);
});

api.get('/notifications', (_req, res) => {
  res.json(getNotifications());
});

api.post('/notifications', (req, res) => {
  const now = new Date().toISOString();
  const notification: Notification = {
    id: randomUUID(),
    type: req.body.type || 'info',
    message: req.body.message || '',
    read: false,
    createdAt: now
  };
  createNotification(notification);
  res.status(201).json(notification);
});

api.post('/notifications/:id/read', (req, res) => {
  markNotificationRead(req.params.id);
  res.status(204).end();
});

api.get('/automation/logs', (_req, res) => {
  res.json(getAutomationJobs());
});

api.post('/automation/commands', (req, res) => {
  const now = new Date().toISOString();
  const job = {
    id: randomUUID(),
    agentId: req.body.agentId || '',
    command: req.body.command || '',
    status: 'queued',
    result: 'Pending execution',
    createdAt: now,
    updatedAt: now
  };
  createAutomationJob(job);
  res.status(201).json(job);
});

api.post('/voice/start', (req, res) => {
  voiceEvents.push({
    id: randomUUID(),
    type: 'start',
    createdAt: new Date().toISOString(),
    meta: req.body
  });
  res.json({ status: 'listening' });
});

api.post('/voice/stop', (req, res) => {
  voiceEvents.push({
    id: randomUUID(),
    type: 'stop',
    createdAt: new Date().toISOString(),
    meta: req.body
  });
  res.json({ status: 'stopped' });
});

api.get('/voice/logs', (_req, res) => {
  res.json(voiceEvents);
});

app.use('/api', api);

app.get('*', (_req, res) => {
  res.sendFile(join(staticPath, 'index.html'));
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
