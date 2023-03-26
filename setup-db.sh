#!/usr/bin/env bash

baseUrl="http://localhost:3001"

function curlSilent {
  curl -s "$@"
}

function unquote() {
  sed 's/^"\(.*\)"$/\1/'
}

function createAdmin() {
  # Create a new user
  body='{"email": "admin@example.com", "name": "Admin", "password": "password"}'
  curlSilent -XPOST $baseUrl/users -H "Content-Type: application/json" -d "$body"

  # Set admin role directly in the database
  body="db.getCollection('users').findOneAndUpdate({email: 'admin@example.com'}, {\\\$set: {role: 'admin'}})"
  cmd="mongosh -u root -p password --authenticationDatabase admin fs3-pokedex --file /tmp/createAdmin.js"
  sudo docker compose exec mongo bash -c "echo \"$body\" >/tmp/createAdmin.js && $cmd && rm /tmp/createAdmin.js" >/dev/null
}

function logIn() {
  body='{"email":"admin@example.com", "password":"password"}'
  curlSilent -XPOST $baseUrl/auth/login -H "Content-Type: application/json" -d "$body"
}

function createDefaultChatrooms() {
  # Get JWT
  jwt=$(logIn | jq .jwt | unquote)

  # Get user ID
  userId=$(curlSilent $baseUrl/users/@me -H "Authorization: Bearer $jwt" | jq .id | unquote)

  # Create default chatrooms
  body="{\"name\": \"general\", \"members\": [\"$userId\"]}"
  curlSilent -X POST "$baseUrl/chatrooms" -H "Content-Type: application/json" -H "Authorization: Bearer $jwt" -d "$body"

  body="{\"name\": \"private\", \"members\": [\"$userId\"]}"
  curlSilent -X POST "$baseUrl/chatrooms" -H "Content-Type: application/json" -H "Authorization: Bearer $jwt" -d "$body"
}

command -v jq >/dev/null 2>&1 || {
  echo >&2 "jq is required but not installed. Aborting."
  echo "Install jq with: sudo apt install jq"
  exit 1
}
createAdmin
createDefaultChatrooms
