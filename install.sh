echo "Install dependencies..."
npm i
echo "Done."
echo ""

echo "Start setup..."
node ./config/tasks/setup.js

# Remove .git...
rm -rf .git

# Remove install.sh...
# rm -rf install.sh

