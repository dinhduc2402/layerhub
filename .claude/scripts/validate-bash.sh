#!/bin/bash

# Read JSON input from stdin
INPUT=$(cat)

# Allow execution if jq is unavailable
if ! command -v jq >/dev/null 2>&1; then
  exit 0
fi

# Extract the command from JSON - correct path
COMMAND=""
if [ -n "$INPUT" ]; then
  COMMAND=$(jq -er '.tool_input // empty' <<<"$INPUT" 2>/dev/null) || COMMAND=""
fi

# If no command found, allow it
if [ -z "$COMMAND" ]; then
  exit 0
fi

# Define forbidden patterns
FORBIDDEN_PATTERNS=(
  "node_modules"
  "\.env"
  "build/"
  "public/"
  "dist/"
  "__pycache__"
  "\.git/"
  "venv/"
  "\.pyc$"
  "\.csv$"
  "\.log$"
)

# Check if command contains any forbidden patterns
for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qE "$pattern"; then
    echo "ERROR: Access to '$pattern' is blocked by security policy" >&2
    exit 2  # Exit code 2 = blocking error
  fi
done

# Command is clean, allow it
exit 0