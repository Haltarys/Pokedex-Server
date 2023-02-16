#!/usr/bin/env bash

# Copy this script over to the private server and run it to deploy the app.
# Copy: scp deploy.sh root@<server_ip>:/app/deploy.sh
# Run: ssh root@<server_ip> "/app/deploy.sh"

# Configuration
root_directory="/app"
app_directory="fs3-pokemon-back"
image_name=$app_directory
container_name=$app_directory

echo "Deploying..."

# Ensure we start in the right directory
cd $root_directory

# Clone repository or pull latest changes
if [ -d $app_directory ]; then
  echo "Pulling latest changes..."
  cd $app_directory
  git checkout main && git pull
  cd $root_directory
else
  echo "Cloning into $app_directory..."
  git clone git@gitlab.com:calvetalex/fs3-pokedex-back.git $app_directory --depth 1
fi

# Build Docker image
cp production.env "$app_directory/.env"
echo "Building image..."
docker build -t $image_name $app_directory

# Stop previous container
echo "Stopping previous container..."
docker stop $container_name && docker rm $container_name && echo "Container stopped and deleted." || echo "No running container named $container_name."

# Run image
echo "Starting app server..."
docker run -d --name=$container_name -p 80:3001 "$image_name:latest" && echo "Server started."

echo "Done."
