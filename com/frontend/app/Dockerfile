FROM node:16-alpine as builder
# Set the working directory to /app inside the container
WORKDIR /app
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
COPY ./package.json ./
COPY ./package-lock.json ./
# RUN npm ci --silent
RUN npm install
# Copy app files
COPY . .
# Build the app
RUN npm run build --no-cache

ENV NODE_ENV production

# Expose port
EXPOSE 3000
# Start nginx
ENTRYPOINT [ "npm", "start"]
