#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Stopping local development environment..."
cd "$SCRIPT_DIR"

docker compose down -v

echo "Local development environment stopped and volumes removed."
