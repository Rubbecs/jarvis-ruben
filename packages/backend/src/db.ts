import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Agent, ApiKey, MemoryNode, Task, WorkflowTemplate, Notification, AutomationJob, VectorEntry } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../data');
const storePath = join(dataDir, 'store.json');

type Store = {
  agents: Agent[];
  tasks: Task[];
  apiKeys: ApiKey[];
  memoryNodes: MemoryNode[];
  workflowTemplates: WorkflowTemplate[];
  notifications: Notification[];
  automationJobs: AutomationJob[];
  vectorEntries: VectorEntry[];
};

const initialStore: Store = {
  agents: [],
  tasks: [],
  apiKeys: [],
  memoryNodes: [],
  workflowTemplates: [],
  notifications: [],
  automationJobs: [],
  vectorEntries: []
};

const ensureStore = () => {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  if (!existsSync(storePath)) {
    writeFileSync(storePath, JSON.stringify(initialStore, null, 2), 'utf8');
  }
};

const readStore = (): Store => {
  ensureStore();
  try {
    const raw = readFileSync(storePath, 'utf8');
    return JSON.parse(raw) as Store;
  } catch {
    writeFileSync(storePath, JSON.stringify(initialStore, null, 2), 'utf8');
    return { ...initialStore };
  }
};

const writeStore = (store: Store) => {
  writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
};

ensureStore();

export const getAllAgents = (): Agent[] => {
  return readStore().agents;
};

export const getAgentById = (id: string): Agent | null => {
  const store = readStore();
  return store.agents.find((agent) => agent.id === id) ?? null;
};

export const createAgent = (agent: Agent) => {
  const store = readStore();
  store.agents.push(agent);
  writeStore(store);
};

export const updateAgent = (agent: Agent) => {
  const store = readStore();
  store.agents = store.agents.map((existing) => (existing.id === agent.id ? agent : existing));
  writeStore(store);
};

export const deleteAgent = (id: string) => {
  const store = readStore();
  store.agents = store.agents.filter((agent) => agent.id !== id);
  writeStore(store);
};

export const getAllTasks = (): Task[] => {
  return readStore().tasks;
};

export const createTask = (task: Task) => {
  const store = readStore();
  store.tasks.push(task);
  writeStore(store);
};

export const updateTask = (task: Task) => {
  const store = readStore();
  store.tasks = store.tasks.map((existing) => (existing.id === task.id ? task : existing));
  writeStore(store);
};

export const getTasksByAgentId = (agentId: string): Task[] => {
  return readStore().tasks.filter((task) => task.agentId === agentId);
};

export const getAllApiKeys = (): ApiKey[] => {
  return readStore().apiKeys;
};

export const createApiKey = (apiKey: ApiKey) => {
  const store = readStore();
  store.apiKeys.push(apiKey);
  writeStore(store);
};

export const updateApiKey = (apiKey: ApiKey) => {
  const store = readStore();
  store.apiKeys = store.apiKeys.map((existing) => (existing.id === apiKey.id ? apiKey : existing));
  writeStore(store);
};

export const getMemoryNodes = (): MemoryNode[] => {
  return readStore().memoryNodes;
};

export const createMemoryNode = (node: MemoryNode) => {
  const store = readStore();
  store.memoryNodes.push(node);
  writeStore(store);
};

export const getWorkflowTemplates = (): WorkflowTemplate[] => {
  return readStore().workflowTemplates;
};

export const getWorkflowTemplateById = (id: string): WorkflowTemplate | null => {
  const store = readStore();
  return store.workflowTemplates.find((template) => template.id === id) ?? null;
};

export const createWorkflowTemplate = (template: WorkflowTemplate) => {
  const store = readStore();
  store.workflowTemplates.push(template);
  writeStore(store);
};

export const updateWorkflowTemplate = (template: WorkflowTemplate) => {
  const store = readStore();
  store.workflowTemplates = store.workflowTemplates.map((existing) =>
    existing.id === template.id ? template : existing
  );
  writeStore(store);
};

export const deleteWorkflowTemplate = (id: string) => {
  const store = readStore();
  store.workflowTemplates = store.workflowTemplates.filter((template) => template.id !== id);
  writeStore(store);
};

export const getNotifications = (): Notification[] => {
  return readStore().notifications.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const createNotification = (notification: Notification) => {
  const store = readStore();
  store.notifications.push(notification);
  writeStore(store);
};

export const markNotificationRead = (id: string) => {
  const store = readStore();
  store.notifications = store.notifications.map((notification) =>
    notification.id === id ? { ...notification, read: true } : notification
  );
  writeStore(store);
};

export const getAutomationJobs = (): AutomationJob[] => {
  return readStore().automationJobs.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const createAutomationJob = (job: AutomationJob) => {
  const store = readStore();
  store.automationJobs.push(job);
  writeStore(store);
};

export const getAllVectorEntries = (): VectorEntry[] => {
  return readStore().vectorEntries.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const createVectorEntry = (entry: VectorEntry) => {
  const store = readStore();
  store.vectorEntries.push(entry);
  writeStore(store);
};

export const searchVectorEntries = (query: string): VectorEntry[] => {
  const normalized = query.trim().toLowerCase();
  return getAllVectorEntries().filter((entry) => {
    const text = `${entry.content} ${entry.tags.join(' ')}`.toLowerCase();
    return normalized.length === 0 || text.includes(normalized);
  });
};
