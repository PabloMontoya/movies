.PHONY: build build-prod run run-prod stop stop-prod restart restart-prod logs logs-prod clean clean-prod status status-prod

# Development targets
# Build the Docker images and start containers
build:
	@echo "🔨 Building Docker images for development..."
	@docker compose -p movies up --build -d
	@echo "✅ Docker images built and containers started for development."

# Run the Docker containers (without rebuilding)
run:
	@echo "🚀 Starting Docker containers for development..."
	@docker compose -p movies up -d
	@echo "✅ Docker containers started for development."

# Stop the Docker containers
stop:
	@echo "🛑 Stopping Docker containers for development..."
	@docker compose -p movies down
	@echo "✅ Docker containers stopped for development."

# Restart the Docker containers
restart: stop run
	@echo "🔄 Restarting Docker containers for development..."
	@echo "✅ Docker containers restarted for development."

# Show logs for all services
logs:
	@echo "📋 Showing logs for all services in development. Press Ctrl+C to exit."
	@docker compose -p movies logs -f

# Remove the Docker containers and associated resources
clean:
	@echo "🧹 Removing Docker containers and associated resources for development..."
	@docker compose -p movies down -v --rmi all
	@echo "✅ Docker containers and resources removed for development."

# Display the status of Docker containers
status:
	@echo "📊 Docker container status for development:"
	@docker compose -p movies ps

# Production targets
# Build the Docker images and start containers
build-prod:
	@echo "🔨 Building Docker images for production..."
	@docker compose -f docker-compose.prod.yml -p movies-prod up --build -d
	@echo "✅ Docker images built and containers started for production."

# Run the Docker containers (without rebuilding)
run-prod:
	@echo "🚀 Starting Docker containers for production..."
	@docker compose -f docker-compose.prod.yml -p movies-prod up -d
	@echo "✅ Docker containers started for production."

# Stop the Docker containers
stop-prod:
	@echo "🛑 Stopping Docker containers for production..."
	@docker compose -f docker-compose.prod.yml -p movies-prod down
	@echo "✅ Docker containers stopped for production."

# Restart the Docker containers
restart-prod: stop-prod run-prod
	@echo "🔄 Restarting Docker containers for production..."
	@echo "✅ Docker containers restarted for production."

# Show logs for all services
logs-prod:
	@echo "📋 Showing logs for all services in production. Press Ctrl+C to exit."
	@docker compose -f docker-compose.prod.yml -p movies-prod logs -f

# Remove the Docker containers and associated resources
clean-prod:
	@echo "🧹 Removing Docker containers and associated resources for production..."
	@docker compose -f docker-compose.prod.yml -p movies-prod down -v --rmi all
	@echo "✅ Docker containers and resources removed for production."

# Display the status of Docker containers
status-prod:
	@echo "📊 Docker container status for production:"
	@docker compose -f docker-compose.prod.yml -p movies-prod ps
