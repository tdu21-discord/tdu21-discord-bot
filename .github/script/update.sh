#!/bin/bash
set -e

BRANCH=main

ssh mountain-server <<SHELL

echo "$1" | sudo -S systemctl stop tdu21-discord-bot

cd /home/tdu21/bot/tdu21-discord-bot

git checkout "$BRANCH"
git fetch origin
git reset --hard origin/"$BRANCH"

yarn install

rm -rf .env

echo "ENV="$2 >> .env
echo "DISCORD_BOT_TOKEN="$3 >> .env
echo "MODERATOR_ROLE_ID="$4 >> .env
echo "LOGDNA_TOKEN="$5 >> .env
echo "LOGDNA_APP="$6 >> .env
echo "SENDGRID_API_KEY="$7 >> .env
echo "SENDGRID_FROM_EMAIL="$8 >> .env
echo "SENDGRID_FROM_NAME="$9 >> .env
echo "DENDAI_EMAIL_DOMAIN="{$10} >> .env
echo "DB_HOST="${11} >> .env
echo "DB_USERNAME="${12} >> .env
echo "DB_PASSWORD="${13} >> .env
echo "DB_DATABASE="${14} >> .env
echo "STUDENT_ID_VERIFY_MAX="${15} >> .env

echo "$1" | sudo -S systemctl start tdu21-discord-bot

SHELL
