#!/bin/bash
set -e

ssh mountain-server <<SHELL

echo "$1" | sudo -S systemctl stop tdu21-discord-bot

systemctl status tdu21-discord-bot

SHELL
