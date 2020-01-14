#!/bin/bash
set -e

echo "> Reset..."
sh ./scripts/clean.sh

echo "> Remove node_modules folder..."
rm -rf node_modules
#
echo "> Install dependencies..."
npm i

echo "> Done."
