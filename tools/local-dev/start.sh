#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Start Docker Compose services
start_services() {
    log_info "Starting Docker Compose services..."
    cd "$SCRIPT_DIR"
    docker compose up -d
    log_success "Docker Compose services started"
}

# Wait for services to be healthy
wait_for_services() {
    log_info "Waiting for services to be healthy..."
    
    # Wait for Redpanda
    log_info "Waiting for Redpanda..."
    timeout 60 bash -c 'until docker exec vt-redpanda rpk cluster health 2>/dev/null | grep -q "Healthy:.*true"; do sleep 2; done' || {
        log_error "Redpanda failed to start within 60 seconds"
        exit 1
    }
    log_success "Redpanda is healthy"
    
    # Wait for PostgreSQL
    log_info "Waiting for PostgreSQL..."
    timeout 30 bash -c 'until docker exec vt-postgres pg_isready -U transcoder -d video_transcoder 2>/dev/null; do sleep 2; done' || {
        log_error "PostgreSQL failed to start within 30 seconds"
        exit 1
    }
    log_success "PostgreSQL is healthy"
    
    # Wait for Redis
    log_info "Waiting for Redis..."
    timeout 30 bash -c 'until docker exec vt-redis redis-cli ping 2>/dev/null | grep -q PONG; do sleep 2; done' || {
        log_error "Redis failed to start within 30 seconds"
        exit 1
    }
    log_success "Redis is healthy"
    
    # Wait for MinIO
    log_info "Waiting for MinIO..."
    timeout 30 bash -c 'until curl -sf http://localhost:9000/minio/health/live 2>/dev/null; do sleep 2; done' || {
        log_error "MinIO failed to start within 30 seconds"
        exit 1
    }
    log_success "MinIO is healthy"
}

# Create Kafka topics
create_kafka_topics() {
    log_info "Creating Kafka topics..."
    
    TOPICS=(
        "uploads:3:1"
        "transcode-jobs:6:1"
        "transcode-results:3:1"
        "transcode-dlq:1:1"
        "notifications:3:1"
    )
    
    for topic_config in "${TOPICS[@]}"; do
        IFS=':' read -r topic partitions replicas <<< "$topic_config"
        log_info "Creating topic: $topic (partitions: $partitions, replicas: $replicas)"
        docker exec vt-redpanda rpk topic create "$topic" \
            --partitions "$partitions" \
            --replicas "$replicas" \
            2>/dev/null || log_warn "Topic $topic may already exist"
    done
    
    log_success "Kafka topics created"
}

# Run database migrations (if Prisma is set up)
run_migrations() {
    log_info "Checking for database migrations..."
    cd "$PROJECT_ROOT"
    
    if [ -f "packages/database/prisma/schema.prisma" ]; then
        if command -v pnpm &> /dev/null; then
            log_info "Running Prisma migrations..."
            pnpm db:migrate || log_warn "Migrations may have already been applied"
            log_success "Database migrations completed"
        else
            log_warn "pnpm not found, skipping migrations"
        fi
    else
        log_info "No Prisma schema found, skipping migrations"
    fi
}

# Print service URLs
print_urls() {
    echo ""
    log_success "=== Local Development Environment Ready ==="
    echo ""
    echo -e "${BLUE}Service URLs:${NC}"
    echo "  Kafka (internal):    redpanda:9092"
    echo "  Kafka (external):    localhost:19092"
    echo "  Kafka Console:       http://localhost:8080"
    echo "  PostgreSQL:          postgresql://transcoder:transcoder_secret@localhost:5432/video_transcoder"
    echo "  Redis:               redis://localhost:6379"
    echo "  MinIO S3 API:        http://localhost:9000"
    echo "  MinIO Console:       http://localhost:9001 (minioadmin / minioadmin123)"
    echo ""
    echo -e "${BLUE}S3 Buckets:${NC}"
    echo "  videos               - Source video uploads"
    echo "  transcoded           - Transcoded outputs (publicly readable)"
    echo ""
    echo -e "${BLUE}Kafka Topics:${NC}"
    echo "  uploads              - Upload completion events"
    echo "  transcode-jobs       - Transcode job requests"
    echo "  transcode-results    - Transcode completion/failure events"
    echo "  transcode-dlq        - Dead letter queue for failed jobs"
    echo "  notifications        - Real-time notifications"
    echo ""
    echo -e "${GREEN}Run 'pnpm dev' to start all services${NC}"
}

# Main
main() {
    echo ""
    echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║       Video Transcoder - Local Dev Environment        ║${NC}"
    echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    check_prerequisites
    start_services
    wait_for_services
    create_kafka_topics
    run_migrations
    print_urls
}

main "$@"
