#!/bin/bash
set -e

ssh mountain-server <<SHELL

echo "$1" | sudo -S systemctl stop tdu21-discord-bot
# echo "$1" | sudo -S systemctl start tdu21-discord-bot

SHELL
