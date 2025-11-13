# ClaudeKit Session Capture Hook

## Overview

The session capture hook automatically captures detailed metadata from Claude Code sessions and syncs it to the ClaudeKit Dashboard for visualization and analysis.

## Features

- **Automatic Capture**: Runs at session end and subagent completion
- **Rich Metadata**: Captures conversations, messages, tool calls, subagents, and skills
- **Dashboard Sync**: Automatically syncs data to dashboard API
- **Local Fallback**: Saves data locally if dashboard is unavailable
- **JSON Validation**: Ensures data integrity with proper JSON structure
- **Log Management**: Automatically cleans up old logs (keeps latest 100)

## Installation

### 1. Hook Setup

The hook is already configured in `.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/session-capture.sh"
          }
        ]
      }
    ],
    "SubagentStop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/session-capture.sh"
          }
        ]
      }
    ]
  }
}
```

### 2. Dashboard Configuration

Set the dashboard URL in your environment:

```bash
# Add to .claude/.env or your shell profile
export CLAUDEKIT_DASHBOARD_URL="http://localhost:8788"

# For production dashboard
export CLAUDEKIT_DASHBOARD_URL="https://your-dashboard.com"
```

### 3. Dependencies

Ensure you have the required tools:

```bash
# Required for JSON processing
sudo apt-get install jq  # Linux
brew install jq           # macOS

# Required for API communication
curl --version           # Should be pre-installed
```

## Usage

### Automatic Capture

The hook runs automatically when:
- A Claude Code session ends (`Stop` event)
- A subagent completes its task (`SubagentStop` event)

### Manual Capture

You can also trigger capture manually:

```bash
# Capture current session
./.claude/hooks/session-capture.sh capture

# Sync existing log to dashboard
./.claude/hooks/session-capture.sh sync

# Show help
./.claude/hooks/session-capture.sh help
```

## Data Captured

### Session Metadata
- `session_id`: Unique session identifier
- `conversation_id`: Internal conversation identifier
- `started_at`: Session start timestamp (ISO 8601)
- `ended_at`: Session end timestamp (ISO 8601)
- `total_cost`: Total API cost in USD
- `total_tokens`: Total tokens used (input + output)

### Messages
- `role`: user/assistant/system
- `timestamp`: Message timestamp
- `input_tokens`: Input token count
- `output_tokens`: Output token count
- `cache_read_tokens`: Cache read tokens
- `cache_write_tokens`: Cache write tokens

### Tool Calls
- `tool_name`: Name of tool used
- `timestamp`: Tool execution timestamp
- `success`: Whether tool execution succeeded
- `execution_time_ms`: Execution duration in milliseconds

### Subagents
- `agent_type`: Type/name of subagent
- `invoked_at`: When subagent was called
- `completed_at`: When subagent finished
- `status`: running/completed/failed

### Skills
- `skill_name`: Name of activated skill
- `activated_at`: When skill was activated

## Environment Variables

### Required
- `CLAUDEKIT_DASHBOARD_URL`: Dashboard API endpoint (default: http://localhost:8788)

### Optional (Auto-generated if not set)
- `CLAUDEKIT_SESSION_ID`: Session identifier
- `CLAUDEKIT_CONVERSATION_ID`: Conversation identifier
- `CLAUDEKIT_MODEL`: Model used (default: claude-3-5-sonnet-20241022)
- `CLAUDEKIT_STARTED_AT`: Session start time
- `CLAUDEKIT_ENDED_AT`: Session end time
- `CLAUDEKIT_TOOLS_USED`: JSON array of tools used
- `CLAUDEKIT_MESSAGES`: JSON array of messages
- `CLAUDEKIT_SUBAGENTS`: JSON array of subagents
- `CLAUDEKIT_SKILLS`: JSON array of skills
- `CLAUDEKIT_INPUT_TOKENS`: Total input tokens
- `CLAUDEKIT_OUTPUT_TOKENS`: Total output tokens
- `CLAUDEKIT_TOTAL_COST`: Total cost in USD

## File Structure

### Log Files
- **Location**: `~/.claudekit/logs/`
- **Format**: `{session_id}.json`
- **Retention**: Latest 100 files (auto-cleanup)

### Example Log File
```json
{
  "session_id": "1731001234_abc123def",
  "conversation_id": "conv_1731001234_abc123def",
  "started_at": "2025-11-07T10:00:00Z",
  "ended_at": "2025-11-07T10:15:00Z",
  "total_cost": 0.0245,
  "total_tokens": 20300,
  "messages": [
    {
      "role": "user",
      "timestamp": "2025-11-07T10:00:00Z",
      "input_tokens": 1250,
      "output_tokens": 0
    }
  ],
  "tool_calls": [
    {
      "tool_name": "read",
      "timestamp": "2025-11-07T10:01:00Z",
      "success": true
    }
  ],
  "subagents": [
    {
      "agent_type": "researcher",
      "invoked_at": "2025-11-07T10:05:00Z",
      "completed_at": "2025-11-07T10:10:00Z",
      "status": "completed"
    }
  ],
  "skills": [
    {
      "skill_name": "web-frameworks",
      "activated_at": "2025-11-07T10:02:00Z"
    }
  ]
}
```

## Testing

### Run Test Suite
```bash
# Run comprehensive tests
./.claude/hooks/test-session-capture.sh

# Test specific functionality
CLAUDEKIT_SESSION_ID="test-123" ./.claude/hooks/session-capture.sh capture
```

### Test Cases
The test suite validates:
- ✅ Hook script exists and is executable
- ✅ Help command works
- ✅ Basic capture functionality
- ✅ JSON structure validation
- ✅ Dashboard sync (if API running)
- ✅ Error handling

## Troubleshooting

### Common Issues

**"Dashboard sync failed"**
- Check if dashboard is running: `curl http://localhost:8788/api/conversations`
- Verify `CLAUDEKIT_DASHBOARD_URL` is correct
- Check network connectivity

**"Permission denied"**
- Ensure hook is executable: `chmod +x .claude/hooks/session-capture.sh`
- Check `.claude/settings.json` permissions

**"jq: command not found"**
- Install jq: `sudo apt-get install jq` (Linux) or `brew install jq` (macOS)

**"Log file not created"**
- Check `~/.claudekit/logs/` directory permissions
- Ensure disk space is available

### Debug Mode

Enable verbose logging:
```bash
export CLAUDEKIT_DEBUG=1
./.claude/hooks/session-capture.sh capture
```

### Manual Sync

If automatic sync fails, sync manually:
```bash
# Sync specific log file
./.claude/hooks/session-capture.sh sync

# Or use curl directly
curl -X POST $CLAUDEKIT_DASHBOARD_URL/api/sync \
  -H "Content-Type: application/json" \
  -d @~/.claudekit/logs/{session_id}.json
```

## Integration with Dashboard

### Real-time Updates
When the hook is properly configured:
1. Claude Code session ends
2. Hook captures metadata automatically
3. Data syncs to dashboard API
4. Dashboard updates immediately
5. Refresh dashboard to see new data

### Data Flow
```
Claude Code → Session Hook → Local Log → Dashboard API → Database → UI
```

## Security

### Data Privacy
- Only metadata is captured (no message content)
- Tokens and costs are aggregated counts
- No code or sensitive content stored

### Environment Variables
- Never commit `.env` files with credentials
- Use environment-specific configurations
- Rotate dashboard URLs/tokens regularly

## Advanced Usage

### Custom Dashboard Integration
For custom dashboard deployments:

1. Set custom URL: `export CLAUDEKIT_DASHBOARD_URL="https://custom.example.com"`
2. Ensure API endpoint matches expected format: `/api/sync`
3. Implement proper authentication if needed

### Batch Processing
Process multiple log files:
```bash
for log_file in ~/.claudekit/logs/*.json; do
  curl -X POST $CLAUDEKIT_DASHBOARD_URL/api/sync \
    -H "Content-Type: application/json" \
    -d "{\"logs\":[$(cat "$log_file")]}"
done
```

## Support

- **Issues**: Check test suite output first
- **Logs**: Review `~/.claudekit/logs/` for captured data
- **Dashboard**: Verify API endpoints are accessible
- **Documentation**: See main project README for additional help

---

**Last Updated**: 2025-11-07  
**Version**: 1.0.0