# 🚀 Quick Start Guide

Get Jarvis Ruben running in 3 minutes.

## Windows — Fastest Way (Double-Click)

1. **Download** the repo:
   - Go to https://github.com/Rubbecs/jarvis-ruben
   - Click **Code** → **Download ZIP**
   - Extract the ZIP file

2. **Run it**:
   - Double-click **`start-local.bat`**
   - Wait for the browser to open automatically
   - That's it! 🎉

Or if that doesn't work:

```powershell
# Open PowerShell in the jarvis-ruben folder
npm run bootstrap
npm run start:prod
```

Then open http://localhost:4000

---

## macOS/Linux

```bash
git clone https://github.com/Rubbecs/jarvis-ruben.git
cd jarvis-ruben
npm run bootstrap
npm run start:prod
```

Open http://localhost:4000

---

## After Startup

The dashboard opens with these main tabs:

| Tab | Purpose |
|-----|---------|
| 🤖 Agents | Create AI agents with tools |
| ✓ Tasks | Manage work tasks |
| 🧠 Memory | Store knowledge |
| ⚙️ Automation | Execute commands |
| ⚡ Settings | Add API keys & integrations |
| 🔑 Keys | Manage credentials |

---

## First Steps

### 1. Create Your First Agent
```
Click 🤖 Agents
→ Click "Create Agent"
→ Name: "MyBot"
→ Leave other fields as default
→ Create
```

### 2. Chat with It
```
Click 💬 Chat button (top right)
→ Type: "Hello!"
→ Send
```

### 3. Try Discord (Optional)
```
Click ⚡ Settings
→ Go to "Integrations" tab
→ Paste your Discord bot token
→ Add Key
→ Go to "Agent Tool Setup"
→ Check "Discord" for MyBot
→ Done!
```

---

## Available Tools

Add these integrations in Settings:

- **Discord** — Send Discord messages
- **Gmail** — Read/send emails
- **GitHub** — Manage repos & issues
- **Slack** — Post to Slack
- **Calendar** — Schedule events
- **OpenAI** — Use GPT-4o
- **Claude** — Use Claude API
- **Groq** — Fast inference
- **Terminal** — Run shell commands
- **File Editor** — Read/write files
- **Browser** — Automate web
- **Notes** — Store memory

---

## Common Commands

```bash
# Start the app
npm run start:prod

# Change port
$env:PORT=5001
npm run start:prod

# Development (with hot reload)
npm run dev

# Frontend only
npm run build

# Backend only  
npm run build --prefix packages/backend
```

---

## Troubleshooting

**"Port 4000 already in use"**
```powershell
$env:PORT=5001
npm run start:prod
```

**"Node.js not found"**
- Install Node.js: https://nodejs.org/
- Restart your terminal after installing

**"Build failed"**
```bash
rm -r node_modules packages/*/node_modules
npm run bootstrap
npm run start:prod
```

**Chat doesn't respond**
- Make sure agent has tools assigned
- Check Automation tab for errors

---

## Next Steps

- Read [FEATURES.md](FEATURES.md) for detailed guide
- Check [README.md](README.md) for architecture
- Visit [README-WINDOWS.md](README-WINDOWS.md) for Windows tips

---

**You're all set!** Start building your AI agents. 🤖✨
