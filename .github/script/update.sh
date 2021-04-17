#!/bin/bash
set -e

BRANCH=main

echo $LOGDNA_APP

ssh mountain-server <<SHELL

echo "$1" | sudo -S systemctl stop tdu21-discord-bot

cd /home/tdu21/bot/tdu21-discord-bot

git checkout "$BRANCH"
git fetch origin
git reset --hard origin/"$BRANCH"

echo $LOGDNA_APP

yarn install

echo "$1" | sudo -S systemctl start tdu21-discord-bot

SHELL
