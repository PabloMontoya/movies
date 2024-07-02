.PHONY: build run stop restart logs clean status

# Build the Docker images and start containers
build:
	@echo "🔨 Building Docker images..."
	@docker compose -p movies up --build -d
	@echo "✅ Docker images built and containers started."

# Run the Docker containers (without rebuilding)
run:
	@echo "🚀 Starting Docker containers..."
	@docker compose -p movies up -d
	@echo "✅ Docker containers started."

# Stop the Docker containers
stop:
	@echo "🛑 Stopping Docker containers..."
	@docker compose -p movies down
	@echo "✅ Docker containers stopped."

# Restart the Docker containers
restart: stop run
	@echo "🔄 Restarting Docker containers..."
	@echo "✅ Docker containers restarted."

# Show logs for all services
logs:
	@echo "📋 Showing logs for all services. Press Ctrl+C to exit."
	@docker compose -p movies logs -f

# Remove the Docker containers and associated resources
clean:
	@echo "🧹 Removing Docker containers and associated resources..."
	@docker compose -p movies down -v --rmi all
	@echo "✅ Docker containers and resources removed."

# Display the status of Docker containers
status:
	@echo "📊 Docker container status:"
	@docker compose -p movies ps
