#!/bin/bash
set -e

echo "> Reset..."

echo "> Remove dist folder..."
rm -rf dist

echo "> Remove node_modules folder..."
rm -rf node_modules

echo "> Install dependencies..."
npm i

echo "> Done."
