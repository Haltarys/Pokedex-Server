#!/usr/bin/env bash

baseUrl="http://localhost:3001"

function curlDevNull {
  curl -Ss "$@"
}

function unquote() {
  sed 's/^"\(.*\)"$/\1/'
}

function createAdmin() {
  # Create a new user
  body='{"email": "admin@example.com", "name": "Admin", "password": "password"}'
  curl -XPOST $baseUrl/user -H "Content-Type: application/json" -d "$body"

  # Set admin role directly in the database
  body="db.getCollection('users').findOneAndUpdate({email: 'admin@example.com'}, {\\\$set: {role: 'admin'}}, {new: true})"
  cmd="mongosh -u root -p password --authenticationDatabase admin fs3-pokedex --file /tmp/createAdmin.js"
  sudo docker compose exec mongo bash -c "echo \"$body\" >/tmp/createAdmin.js && $cmd && rm /tmp/createAdmin.js"
}

function logIn() {
  body='{"email":"bruce.wayne@wayne-enterprises.com", "password":"password"}'
  curlDevNull -XPOST $baseUrl/auth/login -H "Content-Type: application/json" -d "$body"
}

function createDefaultChatrooms() {
  # Get JWT
  jwt=$(logIn | jq .jwt | unquote)

  # Get user ID
  userId=$(curlDevNull $baseUrl/auth/profile -H "Authorization: Bearer $jwt" | jq .id | unquote)

  # Create default chatrooms
  body="{\"name\": \"general\", \"members\": [\"$userId\"]}"
  curl -X POST "$baseUrl/chatroom" -H "Content-Type: application/json" -H "Authorization: Bearer $jwt" -d "$body" >/dev/null

  body="{\"name\": \"private\", \"members\": [\"$userId\"]}"
  curl -X POST "$baseUrl/chatroom" -H "Content-Type: application/json" -H "Authorization: Bearer $jwt" -d "$body" >/dev/null
}

command -v jq >/dev/null 2>&1 || {
  echo >&2 "jq is required but not installed. Aborting."
  echo "Install jq with: sudo apt install jq"
  exit 1
}
createAdmin
createDefaultChatrooms
