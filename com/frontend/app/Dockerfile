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
RUN npm run build

# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production
# Copy built assets from `builder` image
COPY --from=builder /app/build /usr/share/nginx/staticfiles
# Add your nginx.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]