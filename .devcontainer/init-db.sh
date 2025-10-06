#!/bin/bash
set -e

# Start PostgreSQL in the background
docker-entrypoint.sh postgres &

# Wait for PostgreSQL to be ready
until pg_isready -U postgres; do
  echo "Waiting for PostgreSQL to start..."
  sleep 1
done

# Function to create database if it doesn't exist and grant privileges
createDBIfNotExists() {
    local dbname=$1
    echo "Checking if database '$dbname' exists..."
    
    if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw "$dbname"; then
        echo "Database '$dbname' already exists"
    else
        echo "Creating database '$dbname'..."
        psql -U postgres -c "CREATE DATABASE $dbname;"
    fi
    
    echo "Granting privileges on database '$dbname' to postgres user..."
    psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $dbname TO postgres;"
}

# Create databases if they don't exist
createDBIfNotExists "guppy"
createDBIfNotExists "umami"

# Wait for the background process
wait