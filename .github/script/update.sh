#!/bin/bash
set -e

BRANCH=main

ssh mountain-server <<SHELL

echo "${PASSWORD}" | sudo -S systemctl stop tdu21-discord-bot

cd /home/tdu21/bot/tdu21-discord-bot

git checkout "$BRANCH"
git fetch origin
git reset --hard origin/"$BRANCH"

yarn install

echo "ENV=${ENV}" >> .env
echo "DISCORD_BOT_TOKEN=${DISCORD_BOT_TOKEN}" >> .env
echo "MODERATOR_ROLE_ID=${MODERATOR_ROLE_ID}" >> .env
echo "LOGDNA_TOKEN=${LOGDNA_TOKEN}" >> .env
echo "LOGDNA_APP=${LOGDNA_APP}" >> .env
echo "SENDGRID_API_KEY=${SENDGRID_API_KEY}" >> .env
echo "SENDGRID_FROM_EMAIL=${SENDGRID_FROM_EMAIL}" >> .env
echo "SENDGRID_FROM_NAME=${SENDGRID_FROM_NAME}" >> .env
echo "DENDAI_EMAIL_DOMAIN=${DENDAI_EMAIL_DOMAIN}" >> .env
echo "DB_HOST=${DB_HOST}" >> .env
echo "DB_USERNAME=${DB_USERNAME}" >> .env
echo "DB_PASSWORD=${DB_PASSWORD}" >> .env
echo "DB_DATABASE=${DB_DATABASE}" >> .env
echo "STUDENT_ID_VERIFY_MAX=${STUDENT_ID_VERIFY_MAX}" >> .env

echo "${PASSWORD}" | sudo -S systemctl start tdu21-discord-bot

SHELL
