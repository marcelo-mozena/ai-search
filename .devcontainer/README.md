# Dev Container Configuration

This directory contains the configuration for developing this project in a Docker container using VSCode Dev Containers.

## Files

- **devcontainer.json** - Main configuration file that defines:
  - Base image (Node.js 20 with TypeScript)
  - VSCode extensions to install
  - Port forwarding configuration
  - Post-creation commands
  - User settings

- **Dockerfile** - Custom Docker image with:
  - Electron development dependencies
  - GTK and display libraries for GUI testing
  - Proper user permissions setup

- **docker-compose.yml** - Advanced orchestration (optional):
  - Custom volume mounts
  - Network configuration
  - Multi-service setup capability

## Quick Start

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Install the "Dev Containers" extension in VSCode
3. Open this project
4. Click "Reopen in Container" or run command: "Dev Containers: Reopen in Container"

## Customization

### Add Extensions

Edit `devcontainer.json`:
```json
"customizations": {
  "vscode": {
    "extensions": [
      "your.extension.id"
    ]
  }
}
```

### Add System Packages

Edit `Dockerfile`:
```dockerfile
RUN apt-get update && apt-get install -y package-name
```

### Environment Variables

Create `.devcontainer/.env`:
```env
MY_VAR=value
```

Then reference in `devcontainer.json`:
```json
"containerEnv": {
  "MY_VAR": "${localEnv:MY_VAR}"
}
```

## Troubleshooting

### Container won't start
- Check Docker Desktop is running
- Try "Dev Containers: Rebuild Container"
- Check Docker logs for errors

### Extensions not loading
- Rebuild container
- Check extension compatibility with remote development

### Port not accessible
- Check `forwardPorts` in devcontainer.json
- Ensure no local service is using the port

## Features

✅ Node.js 20 with npm  
✅ TypeScript support  
✅ Electron development ready  
✅ All project extensions pre-installed  
✅ Auto port forwarding (5173)  
✅ SSH key mounting for Git  
✅ Consistent environment across machines  

## Learn More

- [VSCode Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)
- [Dev Container Specification](https://containers.dev/)
- [Available Features](https://containers.dev/features)
