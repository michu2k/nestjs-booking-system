FROM node:24.13-alpine as base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

FROM base as builder
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install the dependencies
RUN npm install -g pnpm@^10
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy the source code
COPY . .

# Build the NestJS application
RUN pnpm run build

FROM base as runner
WORKDIR /app

# Set the environments
ENV NODE_ENV=production

USER node

EXPOSE 3000

# # Copy only the necessary files to run the application
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

CMD ["node", "dist/src/main.js"]
