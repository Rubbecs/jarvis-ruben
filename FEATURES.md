# Jarvis Ruben — Features Guide

Welcome to **Jarvis Ruben**, a local-first multi-agent orchestration dashboard inspired by OpenSwarm and OpenClaw. This guide covers all features and how to use them.

## 🚀 Quick Start

### Windows (PowerShell)
```powershell
git clone https://github.com/Rubbecs/jarvis-ruben.git
cd jarvis-ruben
npm run bootstrap
npm run start:prod
```

Open http://localhost:4000

### macOS/Linux
```bash
git clone https://github.com/Rubbecs/jarvis-ruben.git
cd jarvis-ruben
npm run bootstrap
npm run start:prod
```

## 🎯 Main Features

### 1. **🤖 Agents Dashboard**
Manage AI agents with full customization.

**What you can do:**
- **Create agents** with custom prompts, personality, and model selection
- **Assign tools** (Discord, Gmail, GitHub, etc.) for enhanced capabilities
- **Clone agents** to rapidly create variants
- **Export/Import** agents as JSON for backup or sharing
- **Manage permissions** and team assignments
- **Enable memory** for context retention across sessions

**Supported Models:**
- Local (default)
- GPT-4o, GPT-4 (OpenAI)
- Claude (Anthropic)
- Mistral
- Llama
- Groq

### 2. **✓ Tasks Dashboard**
Create and manage work tasks assigned to agents.

**Features:**
- **Create tasks** with priority (1-5), description, and scheduling
- **Assign to agents** for execution
- **Task control**: Pause, Resume, Retry
- **View status**: Pending, Running, Completed, Paused, Failed
- **Task history** with event timestamps
- **Scheduled execution** for delayed runs

### 3. **💬 Chat Panel**
Real-time conversation with your agents.

**How to use:**
1. Click the **"💬 Chat"** button in the header
2. Select an agent from the dropdown
3. Type a command or message
4. Send and see responses in real-time

The chat sends commands to your agent and displays results. Great for:
- Testing agent capabilities
- Running quick tasks
- Debugging agent behavior

### 4. **⚙️ Automation & Commands**
Execute commands on agents and track execution history.

**Features:**
- **Execute commands** on selected agent
- **View job status**: Queued, Running, Completed, Failed
- **See execution output** with timestamps
- **Auto-refresh** every 3 seconds for live updates
- **Filter by agent** for focused tracking

**Examples:**
- `list_files /home/user/documents`
- `send_email recipient@example.com "Subject" "Body"`
- `get_weather New York`

### 5. **⚡ Settings & Plugins**
Configure integrations and manage capabilities.

**Three tabs:**

#### **Tools Catalog**
Browse all 12 available tools:
- **Communication**: Discord, Slack
- **Email**: Gmail
- **Productivity**: Calendar, Notes
- **Development**: GitHub, File Editor, Terminal
- **Storage**: Drive & Files
- **Automation**: Browser, Screen Share
- **Utility**: Notifications

#### **API Key Integration**
1. Select a provider (Discord, Gmail, GitHub, OpenAI, etc.)
2. Paste your API key securely
3. Optionally label it (e.g., "My Discord Bot")
4. Assign to agents that need it
5. Keys are encrypted locally with AES-256

#### **Agent Tool Setup**
Assign tools to agents:
- ✅ Check tools an agent should have access to
- Tools enable agent capabilities
- Changes apply immediately
- One agent can have multiple tools

**Example workflow:**
1. Add Discord API key in "Integrations" tab
2. Create or select an agent
3. Check "Discord" in "Agent Tool Setup"
4. Now that agent can send Discord messages!

### 6. **🧠 Memory Vault**
Store contextual knowledge for your agents.

**Features:**
- **Create memory nodes** with title, body, tags
- **Organize with tags** for easy retrieval
- **Link nodes** to create knowledge graphs
- **Global or agent-specific** scope
- **Search and browse** your knowledge base

**Use cases:**
- Store API documentation
- Save conversation context
- Create knowledge bases
- Build decision trees

### 7. **🔑 API Keys Manager**
Securely manage all integration credentials.

**Security:**
- Keys stored locally with AES-256-GCM encryption
- Not sent to cloud
- Hidden in UI (only labeled names shown)
- Assigned to specific agents

**Supported providers:**
- OpenAI, Anthropic, Groq, Gemini, DeepSeek
- Discord, Slack, Gmail
- GitHub, Google Drive
- Custom providers

### 8. **🔔 Notifications**
Real-time system alerts and status updates.

**Features:**
- **Auto-refresh** every 5 seconds
- **Type-based styling**: Info, Warning, Success, Error
- **Timestamps** for all notifications
- **Read/Unread** status tracking
- Click the 🔔 icon to open/close

## 💡 Workflows & Examples

### Example 1: Create Your First Agent
```
1. Go to "🤖 Agents" tab
2. Click "Create Agent"
3. Name: "EmailBot"
4. Prompt: "You help manage emails. Be concise."
5. Model: "gpt-4o" (requires OpenAI key)
6. Tools: [Gmail]
7. Memory: ✓ Enabled
8. Create → You now have EmailBot!
```

### Example 2: Set Up Discord Integration
```
1. Go to ⚡ Settings → Integrations tab
2. Provider: Discord
3. Paste your Discord Bot token
4. Label: "My Discord Bot"
5. Select agents that should use it
6. Add Key → Success!
7. Go to Agent Tool Setup tab
8. Check "Discord" for your agents
9. Now they can send Discord messages!
```

### Example 3: Send a Command
```
1. Go to ⚙️ Automation tab
2. Select Agent: "EmailBot"
3. Command: "send_email john@example.com 'Hello' 'This is a test'"
4. Click Execute
5. Watch status change from "queued" → "running" → "completed"
6. View output in the history
```

### Example 4: Chat with an Agent
```
1. Click 💬 Chat button (top right)
2. Select agent from dropdown
3. Type: "What emails did I receive today?"
4. Agent responds with results
5. Continue conversation naturally
```

## 🔗 API Endpoints Reference

All endpoints available at `http://localhost:4000/api/`:

**Agents**
- GET `/agents` — List all agents
- POST `/agents` — Create agent
- PUT `/agents/:id` — Update agent
- DELETE `/agents/:id` — Delete agent
- POST `/agents/:id/clone` — Clone agent

**Tasks**
- GET `/tasks` — List all tasks
- POST `/tasks` — Create task
- PUT `/tasks/:id` — Update task
- POST `/tasks/:id/pause` — Pause task
- POST `/tasks/:id/resume` — Resume task
- POST `/tasks/:id/retry` — Retry task

**API Keys**
- GET `/keys` — List keys (encrypted)
- POST `/keys` — Create key

**Memory**
- GET `/memory` — List memory nodes
- POST `/memory` — Create node

**Automation**
- GET `/automation/logs` — View job history
- POST `/automation/commands` — Execute command

**Tools**
- GET `/tools` — List all available tools

**Notifications**
- GET `/notifications` — List notifications
- POST `/notifications` — Create notification

**Workflows**
- GET `/workflow/templates` — List templates
- POST `/workflow/templates` — Create template
- POST `/workflow/execute` — Execute workflow

## 🛠️ Configuration

### Change Port
```powershell
# Windows PowerShell
$env:PORT=5000
npm run start:prod
```

```bash
# Linux/macOS
export PORT=5000
npm run start:prod
```

### Data Storage
All data stored locally at:
```
packages/backend/data/store.json
packages/backend/data/secret.key (encryption key)
```

### Frontend Build
```bash
npm run dev         # Development with HMR
npm run build       # Production build
npm run preview     # Preview production build
```

### Backend Development
```bash
npm run dev --workspace backend  # Hot reload with nodemon
npm run build --workspace backend  # Build TypeScript
```

## 🚨 Troubleshooting

**Issue: "No agents appear"**
- Ensure backend is running (http://localhost:4000 responds)
- Check browser console for errors
- Try refreshing the page

**Issue: "Chat doesn't respond"**
- Verify agent exists and has tools assigned
- Check Automation tab for command errors
- Ensure backend is running

**Issue: "API key not working"**
- Keys must be valid and not expired
- Agent must be assigned the key
- Agent must have the tool enabled
- Check backend logs for encryption errors

**Issue: "Port 4000 already in use"**
- Use a different port: `$env:PORT=5001`
- Or kill process: `netstat -ano | findstr :4000 && taskkill /PID <PID>`

## 🌍 Integration Examples

### Discord Bot
```
1. Create agent with Discord tool
2. Add Discord Bot token in Settings
3. Use command: "send_discord_message #channel 'Hello World'"
```

### Gmail Assistant
```
1. Create agent with Gmail tool
2. Add Gmail API key
3. Use command: "list_emails inbox"
4. Or: "send_email recipient@example.com 'Subject' 'Body'"
```

### GitHub Companion
```
1. Create agent with GitHub tool
2. Add GitHub token
3. Use command: "list_repos owner/repo"
4. Or: "create_issue owner/repo 'Title' 'Description'"
```

## 📚 Advanced Usage

### Export Agents
```
Agents tab → Export all → Save JSON file
Share agents with team or backup
```

### Import Agents
```
Agents tab → Import → Select JSON file
Restore or share agent configurations
```

### Create Workflows
```
⚡ Settings → (future workflow builder)
Define agent sequences and conditionals
```

### Vector Search
```
Memory tab → Search
Find knowledge by semantic similarity
```

## 🔐 Security Notes

- **No Cloud**: All data stays on your machine
- **Local Encryption**: API keys encrypted with AES-256-GCM
- **No Auth**: Running on localhost is recommended (behind VPN if remote)
- **Export Before Backup**: Export agents regularly

## 🎓 Best Practices

1. **Name agents clearly** — Use descriptive names for easy identification
2. **Assign specific tools** — Don't assign tools agents don't need
3. **Use memory nodes** — Document agent context and knowledge
4. **Monitor jobs** — Check Automation tab for errors
5. **Rotate API keys** — Update keys periodically
6. **Test in chat** — Use Chat panel before automation
7. **Export regularly** — Backup agents weekly

## 📝 Tips

- Use emojis in agent names for quick visual identification
- Create a "Template Agent" with common tools, then clone it
- Name memory nodes with prefixes: `[DOCS]`, `[API]`, `[DECISION]`
- Keep task descriptions clear for history reference
- Use tags in memory for better organization

## 🚀 What's Next

- Multi-agent swarms and orchestration
- Visual workflow builder
- Voice interaction integration
- Marketplace for agent templates
- Team collaboration features
- Cloud sync (optional)

---

**Jarvis Ruben** — Your local AI cockpit. Happy automating! 🤖✨
