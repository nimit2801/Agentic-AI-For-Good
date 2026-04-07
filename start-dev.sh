#!/bin/sh
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:$PATH"
export NODE="/opt/homebrew/bin/node"
cd /Users/nimitsavant/Desktop/nitmit-personal/Agentic-AI-For-Good-Website
exec /opt/homebrew/bin/node node_modules/.bin/next dev
