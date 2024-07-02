# Stage 1: Build the React frontend
FROM node:14 AS build

# Set the working directory
WORKDIR /app/frontend

# Copy the frontend code
COPY ./frontend .

# Install dependencies and build the React app
RUN npm install && npm run build

# Stage 2: Set up Nginx and copy the build output
FROM nginx:alpine AS frontend

# Copy the build output to the Nginx HTML directory
COPY --from=build /app/frontend/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose the port Nginx will serve on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

# Stage 3: Set up the Express API
FROM node:14 AS api

# Set the working directory
WORKDIR /app/api

# Copy the API code
COPY ./api .

# Install dependencies
RUN npm install

# Expose the port the API runs on
EXPOSE 5000

# Command to run the API
CMD ["npm", "start"]
