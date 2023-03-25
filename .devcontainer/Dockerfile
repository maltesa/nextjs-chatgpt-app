# [Choice] Node.js version: 16, 14, 12
ARG VARIANT
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:${VARIANT}


# Install socat
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install --no-install-recommends socat tmux

# Activate PNPM
RUN corepack enable && corepack prepare pnpm@latest --activate

# USER root:root

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node packages
# RUN su node -c "npm install -g <your-package-list -here>"