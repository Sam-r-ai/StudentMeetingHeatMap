FROM node:20-slim

# Enable pnpm
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy in dependency manifests
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of the app
COPY . .

# Expose dev server port
EXPOSE 3000

# Start dev server
CMD ["pnpm", "dev"]
