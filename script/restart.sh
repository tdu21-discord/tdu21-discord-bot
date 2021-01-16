#!/bin/bash
set -e

ssh mountain-server <<SHELL

echo "$1" | sudo -S systemctl restart tdu21-discord-bot

SHELL
