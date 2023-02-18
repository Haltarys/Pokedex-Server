#!/usr/bin/env bash

# Copy this script over to the private server and run it to deploy the app.
# Copy: scp deploy.sh root@<server_ip>:/app/deploy.sh
# Run: ssh root@<server_ip> "/app/deploy.sh"

# Configuration
root_directory="/app"
app_directory="fs3-pokedex-back"
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

commit_hash=$(git --git-dir="$app_directory/.git" rev-parse --short HEAD)

# Build Docker image
cp production.env "$app_directory/.env"
cp -r ssl $app_directory
echo "Building image..."
docker build -t $image_name $app_directory

# Stop previous container
echo "Stopping previous container..."
docker stop $container_name && docker rm $container_name && echo "Container stopped and deleted." || echo "No running container named $container_name."

# Run image
echo "Starting app server..."
docker run -d --name=$container_name -p 443:443 "$image_name:latest" && echo "Server started."

# Log
echo "Deployed commit $commit_hash."
echo "$(date +"%Y-%m-%d %H:%M:%S"): Deployed commit $commit_hash." >> deploy.log

echo "Done."
