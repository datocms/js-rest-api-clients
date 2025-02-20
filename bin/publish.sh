#!/bin/sh

# Run an npm command
./node_modules/.bin/lerna publish "$@"

# Check the exit code of the previous command
if [ $? -ne 0 ]; then

# If the exit code is not 0, an error occurred
echo "An error occurred while running the npm command. Running error script..."

# Execute the error script

# Check if the system is macOS
if [ "$(uname)" != "Darwin" ]; then
  echo "This script is only compatible with macOS."
  exit 1
fi

# Check if jq is installed and available in the PATH
if ! command -v jq >/dev/null 2>&1; then
  echo "jq is not installed or not in the PATH. Please install jq first."
  exit 1
fi

# Define variables
JSON_FILE="./lerna.json"
KEY="version"

# Extract the value of the specified key from the JSON file and save it as a variable
VALUE=v$(cat "$JSON_FILE" | jq -r ".$KEY")

# Print the value of the variable
echo "$VALUE"

# Remove the last commit and tag in the local repo
git reset --hard HEAD^
git tag -d "$VALUE"

# Remove the last commit and tag in the remote (Github) repository
git push origin +HEAD
git push --delete origin "$VALUE"

fi