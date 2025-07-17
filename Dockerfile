# Use official Node.js image for building
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy the rest of the application
COPY . .

# Build the Angular app
RUN npm run build -- --configuration production

# Use official Nginx image for serving
FROM nginx:alpine

# Copy built files to Nginx html directory
COPY --from=build /app/dist/angular-sample /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
