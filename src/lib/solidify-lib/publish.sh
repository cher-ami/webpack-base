#!/usr/bin/env bash

# Checking parameters
if [ $# -ne 1 ]; then
	echo "Invalid parameters";
	echo "Usage : ./publish.sh %commit-message%";
	exit;
fi

# Reading parameters
message="$1"

# Reading version from package.json with node
version=$(node --eval "console.log(require('./package.json').version)")

echo "> Version: $version";
echo "> Message: $message";
echo "";

echo "> Adding files..."
git add --all
git status
echo "> Done";
echo ""

echo "> Commiting ${message}..."
git commit -m "${message}"
echo "> Done";
echo ""

echo "> Creating tag ${version}..."
git tag -a "v${version}" -m "${message}"
echo "> Done";
echo ""

echo "> Pushing to github..."
git push origin master
git push --tags
echo "> Done !"

echo "> Publishing to NPM..."
npm publish
echo "> Done !"

