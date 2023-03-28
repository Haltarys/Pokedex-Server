#!/usr/bin/env bash

# Copy this script over to the private server and run it to deploy the app.
# Copy: scp deploy.sh root@<server_ip>:/app/deploy.sh
# Run: ssh root@<server_ip> "/app/deploy.sh"

# Configuration
# shellcheck disable=SC2034
gitlab_url="git@gitlab.com:calvetalex/fs3-pokedex-back.git"
github_url="https://Haltarys/Pokedex-Server.git"
root_directory="/app"
app_directory="Pokemon-Server"
branch_name=main
image_name=$app_directory
container_name=$app_directory

echo "Deploying..."

# Ensure we start in the right directory
# cd $root_directory

# Determine repository URL
repository_url="${1:-gitlab}_url"
repository_url="${!repository_url}"

[ -z "$repository_url" ] && echo "Repository URL not found." && exit 1

# Remove and clone repository
rm -rf $app_directory
git clone $repository_url $app_directory --depth 1 --branch $branch_name

commit_hash=$(git --git-dir="$app_directory/.git" rev-parse --short HEAD)

# Build Docker image
cp production.env "$app_directory/.env"
rm -rf $app_directory/ssl
cp -Lr ssl $app_directory
echo "Building image..."
docker build -t $image_name $app_directory

# Stop previous container
echo "Stopping previous container..."
docker stop $container_name
docker rm $container_name && echo "Container stopped and deleted." || echo "No container named $container_name."

# Run image
echo "Starting app server..."
docker run -d --name=$container_name -p 443:443 "$image_name:latest" && echo "Server started."

# Log
echo "Deployed commit $commit_hash."
echo "$(date +"%Y-%m-%d %H:%M:%S"): Deployed commit $commit_hash." >>deploy.log

echo "Done."
