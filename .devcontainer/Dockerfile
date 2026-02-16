FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

# Install additional dependencies for Electron development
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    libgtk-3-0 \
    libnotify4 \
    libnss3 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    libatspi2.0-0 \
    libdrm2 \
    libgbm1 \
    libxcb-dri3-0 \
    libasound2 \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Set up user permissions
ARG USERNAME=node
RUN if [ "$USERNAME" != "root" ]; then \
    mkdir -p /home/$USERNAME/.vscode-server /home/$USERNAME/.vscode-server-insiders && \
    chown -R $USERNAME:$USERNAME /home/$USERNAME/.vscode-server* ; \
    fi

# Install global npm packages
RUN su node -c "npm install -g npm@latest"

USER node
