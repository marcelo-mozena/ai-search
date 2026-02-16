# VSCode Remote Development Setup

This project is fully configured for VSCode Remote Development, allowing you to work on the project from anywhere.

## Remote Development Options

### 1. Remote - SSH

Connect to a remote machine via SSH and develop directly on that machine.

**Setup:**
1. Install "Remote - SSH" extension in VSCode
2. Press F1 and select "Remote-SSH: Connect to Host"
3. Enter your SSH connection string (e.g., `user@hostname`)
4. Once connected, open this project folder
5. VSCode will automatically install recommended extensions

**Benefits:**
- Work on remote servers
- Leverage remote machine's resources
- Keep development environment isolated

### 2. Remote - Containers (✅ Configured)

Develop inside a Docker container with a consistent development environment.

**This project is now configured with a complete dev container setup!**

**Quick Start:**
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Install "Dev Containers" extension in VSCode (extension ID: `ms-vscode-remote.remote-containers`)
3. Open this project in VSCode
4. Click "Reopen in Container" when prompted, or:
   - Press F1
   - Select "Dev Containers: Reopen in Container"
5. Wait for the container to build (first time only)
6. Start developing!

**What's Included:**
- Node.js 20 with TypeScript support
- All recommended VSCode extensions pre-installed
- Electron development dependencies
- Automatic `npm install` on container creation
- Port forwarding for Vite dev server (port 5173)
- SSH key mounting for Git operations
- Git safe directory configuration

**Configuration Files:**
- `.devcontainer/devcontainer.json` - Main configuration
- `.devcontainer/Dockerfile` - Custom image with Electron support
- `.devcontainer/docker-compose.yml` - Advanced orchestration (optional)

**Benefits:**
- ✅ Consistent development environment across all machines
- ✅ Easy onboarding for new developers (zero local setup)
- ✅ Isolated from host system
- ✅ No "works on my machine" issues
- ✅ Pre-configured with all tools and extensions

### 3. Remote - WSL

Develop in Windows Subsystem for Linux while using VSCode on Windows.

**Setup:**
1. Install WSL2 on Windows
2. Install "Remote - WSL" extension in VSCode
3. Open WSL terminal
4. Clone project: `git clone <repo-url>`
5. Open in VSCode: `code .`

**Benefits:**
- Use Linux tools on Windows
- Better performance than native Windows for Node.js
- Native-like Linux experience

## Remote Desktop Integration

### Using VSCode Server

VSCode can run as a server, allowing browser-based access:

**Setup:**
1. Install VSCode on your remote machine
2. Run: `code tunnel`
3. Follow authentication prompts
4. Access via browser at provided URL

### Using code-server

Alternative browser-based VSCode:

**Setup:**
```bash
# Install code-server
curl -fsSL https://code-server.dev/install.sh | sh

# Run code-server
code-server --bind-addr 0.0.0.0:8080

# Access via browser at http://your-ip:8080
```

### Secure Remote Access

**SSH Tunneling:**
```bash
# Forward remote port to local machine
ssh -L 5173:localhost:5173 user@remote-host

# Now access at http://localhost:5173
```

**Reverse SSH Tunnel:**
```bash
# From remote machine
ssh -R 8080:localhost:5173 user@local-machine

# Access from local machine at localhost:8080
```

## Recommended Extensions for Remote Development

The project's `.vscode/extensions.json` includes:

1. **Remote - SSH**: SSH remote development
2. **Remote - Containers**: Docker container development
3. **Remote Explorer**: Manage remote connections
4. **ESLint**: JavaScript/TypeScript linting
5. **Prettier**: Code formatting
6. **Tailwind CSS IntelliSense**: Tailwind class autocomplete
7. **TypeScript**: Enhanced TypeScript support

## Remote Debugging

### Debug Remote Electron App

1. Connect to remote machine via SSH
2. Open project in VSCode
3. Press F5 to start debugging
4. Select appropriate debug configuration

### Forward Ports

VSCode automatically detects and forwards ports. Manually forward:

1. Press F1
2. Select "Forward a Port"
3. Enter port number (e.g., 5173)

### Debug Multiple Processes

Use the "Debug All" compound configuration to debug:
- Electron main process
- React renderer process
- Both simultaneously

## Settings Sync

Enable Settings Sync to maintain consistency across machines:

1. Press F1
2. Select "Settings Sync: Turn On"
3. Sign in with GitHub/Microsoft account
4. Select what to sync (settings, extensions, keybindings)

## Performance Tips

### Remote Development
- Use local Git operations when possible
- Enable file watching: `"remote.autoForwardPorts": true`
- Limit extension count on remote

### SSH Remote
- Use SSH keys instead of passwords
- Keep connection alive: Add to `~/.ssh/config`:
```
Host *
  ServerAliveInterval 60
  ServerAliveCountMax 10
```

### Container Development
- Use volume mounts for node_modules
- Allocate sufficient Docker resources
- Use multi-stage builds

## Troubleshooting

### Connection Issues

**SSH Connection Fails:**
```bash
# Test SSH connection
ssh -v user@hostname

# Check SSH agent
ssh-add -l

# Add SSH key if needed
ssh-add ~/.ssh/id_rsa
```

**Port Forwarding Fails:**
- Check firewall settings
- Verify port is available: `netstat -an | grep 5173`
- Try different port in vite.config.ts

### Extension Issues

**Extensions Not Installing:**
1. Check internet connection on remote
2. Manually install: `code --install-extension <extension-id>`
3. Check extension compatibility with remote platform

### Performance Issues

**Slow File Operations:**
- Check network latency
- Use local file operations when possible
- Exclude unnecessary folders from file watching

**High CPU Usage:**
- Disable unnecessary extensions
- Reduce TypeScript server workspace size
- Clear VSCode cache: `rm -rf ~/.vscode-server`

## Security Best Practices

1. **Use SSH Keys**: Never use password authentication
2. **Restrict Access**: Configure firewall rules
3. **Update Regularly**: Keep VSCode and extensions updated
4. **Use VPN**: For remote access over internet
5. **Audit Extensions**: Only install trusted extensions
6. **Enable 2FA**: On GitHub/Microsoft accounts
7. **Secure Tunnels**: Use authenticated tunnels only

## Workspace Settings

The project includes workspace settings in `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/dist-electron": true
  }
}
```

These settings apply automatically in remote workspaces.

## Collaborative Development

### Live Share

Install "Live Share" extension for real-time collaboration:

1. Install "Live Share" extension
2. Press F1 and select "Live Share: Start Collaboration Session"
3. Share the link with collaborators
4. Collaborate in real-time

**Features:**
- Shared editing
- Shared debugging
- Shared terminals
- Voice chat

### Git Integration

**Remote Git Operations:**
- All Git operations work normally in remote mode
- Use SSH for GitHub authentication
- Configure Git credentials on remote machine

**Setup Git on Remote:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global credential.helper store
```

## Cloud Development Environments

### GitHub Codespaces

Create `.devcontainer/devcontainer.json` (shown above), then:

1. Go to repository on GitHub
2. Click "Code" → "Codespaces" → "Create codespace"
3. Development environment ready in browser

### Gitpod

Add `.gitpod.yml`:
```yaml
tasks:
  - init: npm install
    command: npm run dev

ports:
  - port: 5173
    onOpen: open-preview

vscode:
  extensions:
    - dbaeumer.vscode-eslint
    - esbenp.prettier-vscode
    - bradlc.vscode-tailwindcss
```

Access: `gitpod.io/#<your-repo-url>`

## Mobile Development

### Using iPad/Tablet

1. Use code-server or VSCode Server
2. Access via Safari/Chrome
3. External keyboard recommended
4. Use Blink Shell or Working Copy for Git

### Using Phone

- Not recommended for primary development
- Useful for quick edits via GitHub mobile app
- Can review PRs and issues

## Network Configuration

### Firewall Rules

**Open Required Ports:**
```bash
# Allow Vite dev server
sudo ufw allow 5173/tcp

# Allow code-server
sudo ufw allow 8080/tcp

# Allow SSH
sudo ufw allow 22/tcp
```

### Reverse Proxy

Use nginx for HTTPS and better security:

```nginx
server {
    listen 443 ssl;
    server_name dev.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring and Logs

### VSCode Remote Logs

View logs for troubleshooting:
- Press F1
- Select "Remote: Show Log"
- Choose appropriate log source

### Application Logs

Monitor application in remote environment:
```bash
# Watch Vite logs
npm run dev 2>&1 | tee dev.log

# Watch Electron logs
npm run electron:dev 2>&1 | tee electron.log
```

## Backup and Sync

### Automatic Backup

Use Git for version control:
```bash
# Commit frequently
git add .
git commit -m "Work in progress"
git push origin branch-name
```

### Settings Backup

Enable Settings Sync in VSCode to backup:
- User settings
- Extensions
- Keybindings
- Snippets

## Resources

- [VSCode Remote Development](https://code.visualstudio.com/docs/remote/remote-overview)
- [Remote - SSH Guide](https://code.visualstudio.com/docs/remote/ssh)
- [Remote - Containers Guide](https://code.visualstudio.com/docs/remote/containers)
- [code-server Documentation](https://coder.com/docs/code-server)
- [GitHub Codespaces](https://github.com/features/codespaces)
