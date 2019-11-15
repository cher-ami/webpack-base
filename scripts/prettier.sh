#!/bin/bash
set -e

echo "> Prettier files..."

prettier --write './src/**/**/*.{tsx,ts,jsx,js,less,css,json}'

echo "> Done."
