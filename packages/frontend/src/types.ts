// API Types
export interface Agent {
  id: string;
  name: string;
  prompt: string;
  personality: string;
  model: string;
  tools: string[];
  memoryEnabled: boolean;
  permissions: string[];
  team?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  agentId: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  workflow?: unknown[];
  history?: Array<{ event: string; timestamp: string }>;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiKey {
  id: string;
  provider: string;
  encryptedKey?: string;
  label: string;
  assignedAgents?: string[];
  createdAt: string;
}

export interface MemoryNode {
  id: string;
  agentId: string;
  title: string;
  body: string;
  tags?: string[];
  links?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AutomationJob {
  id: string;
  agentId?: string;
  command: string;
  status: string;
  result?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  agentId: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: unknown[];
  assignedAgents: string[];
  createdAt: string;
  updatedAt: string;
}
