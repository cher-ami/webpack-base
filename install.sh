echo ""
echo "> Install dependencies..."
npm i
echo "Done."

echo "> Start setup..."
node config/tasks/commands.js setup

