# jarvis-ruben

**Local-first multi-agent orchestration dashboard** — Like OpenSwarm or OpenClaw, but for your localhost.

## 🎯 What is it?

Jarvis Ruben is a **fully functional AI agent dashboard** where you can:

- ✅ **Create & manage AI agents** with custom prompts, personalities, and tools
- ✅ **Chat with agents** in real-time via a floating chat panel  
- ✅ **Execute commands** and track automation jobs with live status
- ✅ **Connect integrations** — Discord, Gmail, GitHub, Slack, Calendar, and more
- ✅ **Store knowledge** in a memory vault with semantic search
- ✅ **Manage API keys** securely (encrypted locally with AES-256)
- ✅ **Schedule tasks** and assign them to agents
- ✅ **Export/import agents** for backup and sharing

**Everything runs locally. No cloud. No subscriptions. Just you and your agents.**

## 🚀 Quick Start

### Windows
```powershell
git clone https://github.com/Rubbecs/jarvis-ruben.git
cd jarvis-ruben
npm run bootstrap
npm run start:prod
```

Then open **http://localhost:4000** in your browser.

### macOS/Linux
```bash
git clone https://github.com/Rubbecs/jarvis-ruben.git
cd jarvis-ruben
npm run bootstrap
npm run start:prod
```

### Double-click to run (Windows)
Just extract the repo and double-click `start-local.bat`

---

## 🎮 Features at a Glance

### 🤖 Agents Dashboard
Create AI agents with:
- Custom system prompts & personality
- Model selection (GPT-4o, Claude, Mistral, Llama, local)
- Tool assignments (Discord, Gmail, GitHub, etc.)
- Memory system for context retention
- Team & permission management
- Clone, export, import agents

### 💬 Chat Panel
- Real-time chat with your agents
- Floating widget (bottom right)
- Select any agent to talk to
- See responses in real-time
- Perfect for testing

### ⚙️ Automation & Commands
- Execute commands on agents
- Track job status (queued → running → completed)
- View execution output
- Auto-refresh job history
- Cancel or retry failed jobs

### ⚡ Settings & Plugins
Three-tab dashboard:

**Tools Catalog** — View all 12 available tools
- Communication: Discord, Slack
- Email: Gmail  
- Productivity: Calendar, Notes
- Development: GitHub, File Editor, Terminal
- Automation: Browser, Screen Share
- Storage: Drive & Files

**API Integration** — Add your keys
- Paste provider keys (Discord, Gmail, GitHub, OpenAI, etc.)
- Assign to agents that need them
- Keys encrypted locally

**Agent Tool Setup** — Assign tools to agents
- Check which tools each agent can use
- Changes apply immediately
- One agent = multiple tools possible

### 🧠 Memory Vault
- Create memory nodes with tags
- Store API docs, context, knowledge
- Link nodes to create knowledge graphs
- Global or agent-specific scope

### ✓ Tasks Dashboard
- Create tasks with priority & description
- Assign to agents
- Pause/resume/retry tasks
- View task history & status

### 🔑 API Keys Manager
- Store provider credentials securely
- Local AES-256-GCM encryption
- No cloud sync
- Assign keys to specific agents

---

## 🎓 Example: Discord Bot Setup

1. **Create an agent**
   - Go to 🤖 Agents
   - Name: "DiscordBot"
   - Prompt: "You help manage our Discord"
   - Tools: [Discord]

2. **Add your Discord token**
   - Go to ⚡ Settings → Integrations
   - Provider: Discord
   - Paste your bot token
   - Assign to DiscordBot

3. **Chat with it**
   - Click 💬 Chat button
   - Select DiscordBot
   - Type: "Send a message to #general saying hello"
   - Watch it execute!

---

## 📚 Full Documentation

For complete feature walkthrough, see **[FEATURES.md](FEATURES.md)** which includes:
- Detailed workflow examples
- API endpoint reference
- Integration guides
- Troubleshooting
- Best practices
- Advanced usage

Windows users should also see **[README-WINDOWS.md](README-WINDOWS.md)** for Windows-specific setup.

---

## 🏗️ Architecture

**Single-machine, zero-setup stack:**

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + Node.js + TypeScript
- **Data**: Local JSON persistence (no database)
- **Security**: AES-256-GCM for sensitive data
- **Port**: `http://localhost:4000` (configurable)

**Data storage:**
```
packages/backend/data/
├── store.json       (all agent, task, memory data)
└── secret.key       (encryption key for API credentials)
```

---

## 🛠️ Development

### Development mode (with hot reload)
```bash
npm run bootstrap          # Install all deps
npm run dev               # Frontend dev server on :5173 (proxies to :4000)
npm run start --prefix packages/backend  # Backend dev with nodemon
```

### Production build & run
```bash
npm run build:all         # Build frontend + backend
npm run start:prod        # Serve on localhost:4000
```

### Change port
```powershell
$env:PORT=5001
npm run start:prod
```

---

## 💻 Commands Reference

### Root scripts
```bash
npm run bootstrap        # Install all dependencies
npm run dev             # Start frontend dev server
npm run build           # Build frontend only
npm run build:all       # Build frontend + backend
npm run start:prod      # Build everything & start server
npm run lint            # Lint frontend
```

### Frontend (from packages/frontend/)
```bash
npm run dev             # Start Vite dev server
npm run build           # Build for production
npm run preview         # Preview production build
```

### Backend (from packages/backend/)
```bash
npm run dev             # Start with nodemon (watch mode)
npm run start           # Run compiled server
npm run build           # Compile TypeScript
```

---

## 🔐 Security

✅ **Local-first** — All data stays on your machine  
✅ **Encrypted** — API keys encrypted with AES-256-GCM  
✅ **No cloud** — No internet calls required  
✅ **Open source** — Audit the code yourself  
✅ **Portable** — Run on any machine with Node.js  

**Recommendation:** Run behind a VPN if accessing remotely.

---

## 🎨 UI Features

- **Dark theme** optimized for focus
- **Responsive design** with Tailwind CSS
- **Floating chat panel** for easy access
- **Notification center** with auto-refresh
- **Real-time status** updates
- **Emoji icons** for quick navigation
- **Keyboard shortcuts** (Enter to send)

---

## 🚨 Troubleshooting

**Port already in use?**
```powershell
$env:PORT=5000
npm run start:prod
```

**Backend won't start?**
- Ensure Node.js 18+ is installed
- Try: `npm run bootstrap` then `npm run build:all`
- Check port 4000 is available

**Chat doesn't respond?**
- Verify agent has tools assigned
- Check Automation tab for errors
- Ensure API keys are valid

**Can't find agents?**
- Reload the page
- Check browser console for errors
- Verify backend is running at http://localhost:4000

See [FEATURES.md](FEATURES.md) for more troubleshooting.

---

## 🗺️ Roadmap

- [x] Agent management ✓
- [x] Task orchestration ✓
- [x] Chat interface ✓
- [x] API key management ✓
- [x] Automation executor ✓
- [x] Memory vault ✓
- [x] Settings dashboard ✓
- [ ] Visual workflow builder
- [ ] Multi-agent swarms
- [ ] Voice interaction
- [ ] Agent marketplace
- [ ] Team collaboration
- [ ] Cloud sync (optional)

---

## 📖 Learn More

- **[FEATURES.md](FEATURES.md)** — Complete feature guide with examples
- **[README-WINDOWS.md](README-WINDOWS.md)** — Windows-specific setup
- **Backend API** — See `packages/backend/src/server.ts` for endpoints
- **Frontend UI** — See `packages/frontend/src/pages/` for components

---

## 🤝 Contributing

Found a bug? Have ideas? Open an issue or submit a PR.

---

## 📄 License

MIT

---

**Jarvis Ruben** — Your personal AI cockpit. Everything local. Everything yours.

Made with ❤️ for AI enthusiasts who want full control.
