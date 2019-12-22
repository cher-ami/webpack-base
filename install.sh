echo "Remove .git..."
# rm -rf .git
echo "Done."
echo ""

echo "Install dependencies..."
npm i
echo "Done."
echo ""

echo "Start setup..."
node ./config/tasks/setup.js

# Remove install.sh...
# rm -rf install.sh

