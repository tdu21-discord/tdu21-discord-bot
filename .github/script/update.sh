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

echo "DISCORD_BOT_TOKEN=$2" >> .env
echo "MODERATOR_ROLE_ID=$3" >> .env
echo "LOGDNA_TOKEN=$4" >> .env
echo "LOGDNA_APP=$5" >> .env
echo "SENDGRID_API_KEY=$6" >> .env
echo "SENDGRID_FROM_EMAIL=$7" >> .env
echo "DENDAI_EMAIL_DOMAIN=$8" >> .env

echo "$1" | sudo -S systemctl start tdu21-discord-bot

SHELL
