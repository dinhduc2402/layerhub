#!/usr/bin/env bash
# ClaudeKit Session Metadata Capture Hook
# Captures detailed session metadata and syncs to dashboard

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="$HOME/.claudekit/logs"
SESSION_ID="${CLAUDEKIT_SESSION_ID:-$(date +%s)_$(uuidgen | cut -d'-' -f1)}"
LOG_FILE="$LOG_DIR/${SESSION_ID}.json"
DASHBOARD_API_URL="${CLAUDEKIT_DASHBOARD_URL:-http://localhost:8788}"

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}ℹ️  $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Extract session metadata from environment or generate defaults
extract_session_metadata() {
    local session_id="$1"
    local conversation_id="${CLAUDEKIT_CONVERSATION_ID:-conv_$(date +%s)_$(uuidgen | cut -d'-' -f1)}"
    local model="${CLAUDEKIT_MODEL:-claude-3-5-sonnet-20241022}"
    local started_at="${CLAUDEKIT_STARTED_AT:-$(date -u +"%Y-%m-%dT%H:%M:%SZ")}"
    local ended_at="${CLAUDEKIT_ENDED_AT:-$(date -u +"%Y-%m-%dT%H:%M:%SZ")}"
    
    # Extract tool usage from environment or session data
    local tools_used="${CLAUDEKIT_TOOLS_USED:-[]}"
    local messages="${CLAUDEKIT_MESSAGES:-[]}"
    local subagents="${CLAUDEKIT_SUBAGENTS:-[]}"
    local skills="${CLAUDEKIT_SKILLS:-[]}"
    
    # Calculate costs (rough estimation)
    local input_tokens="${CLAUDEKIT_INPUT_TOKENS:-0}"
    local output_tokens="${CLAUDEKIT_OUTPUT_TOKENS:-0}"
    local total_cost="${CLAUDEKIT_TOTAL_COST:-0.0000}"
    
    # Generate metadata JSON
    cat <<EOF
{
  "session_id": "$session_id",
  "conversation_id": "$conversation_id",
  "started_at": "$started_at",
  "ended_at": "$ended_at",
  "total_cost": $total_cost,
  "total_tokens": $((input_tokens + output_tokens)),
  "messages": $messages,
  "tool_calls": $tools_used,
  "subagents": $subagents,
  "skills": $skills
}
EOF
}

# Sync metadata to dashboard API
sync_to_dashboard() {
    local metadata_file="$1"
    local api_url="$2"
    
    log_info "Syncing session metadata to dashboard..."
    
    # Create the payload format expected by the sync endpoint
    local payload="{\"logs\":[$(cat "$metadata_file")]}"
    
    # Try to sync to dashboard
    if command -v curl >/dev/null 2>&1; then
        local response
        if response=$(curl -s -w "%{http_code}" -X POST "$api_url/api/sync" \
            -H "Content-Type: application/json" \
            -d "$payload" 2>/dev/null); then
            local http_code="${response: -3}"
            local response_body="${response%???}"
            
            if [[ "$http_code" -eq 200 ]]; then
                log_info "✅ Successfully synced to dashboard"
                echo "$response_body" | jq -r '.synced' 2>/dev/null || echo "1"
                return 0
            else
                log_warn "Dashboard sync failed (HTTP $http_code)"
                echo "$response_body" | jq -r '.error // "Unknown error"' 2>/dev/null || echo "API error"
                return 1
            fi
        else
            log_warn "Could not connect to dashboard at $api_url"
            return 1
        fi
    else
        log_warn "curl not available - skipping dashboard sync"
        return 1
    fi
}

# Main execution
main() {
    log_info "ClaudeKit Session Metadata Capture"
    log_info "Session ID: $SESSION_ID"
    log_info "Project: $(basename "$PROJECT_ROOT")"
    
    # Extract and save metadata
    local metadata
    metadata=$(extract_session_metadata "$SESSION_ID")
    echo "$metadata" > "$LOG_FILE"
    
    log_info "📝 Session metadata saved to $LOG_FILE"
    
    # Try to sync to dashboard
    local synced_count=0
    local sync_result
    if sync_result=$(sync_to_dashboard "$LOG_FILE" "$DASHBOARD_API_URL"); then
        synced_count=$(echo "$sync_result" | head -1)
        log_info "📊 Synced $synced_count session(s) to dashboard"
    else
        log_warn "Dashboard sync failed - data saved locally for manual sync"
        log_info "To sync manually: curl -X POST $DASHBOARD_API_URL/api/sync -d @\"$LOG_FILE\""
    fi
    
    # Summary
    echo ""
    log_info "📋 Session Summary:"
    echo "   Session ID: $SESSION_ID"
    echo "   Log File: $LOG_FILE"
    echo "   Dashboard API: $DASHBOARD_API_URL"
    if [[ $synced_count -gt 0 ]]; then
        echo "   Sync Status: ✅ Success"
    else
        echo "   Sync Status: ⚠️  Local only"
    fi
    
    # Cleanup old logs (keep last 100 sessions)
    if [[ -d "$LOG_DIR" ]]; then
        cd "$LOG_DIR"
        local log_count=$(ls *.json 2>/dev/null | wc -l)
        if [[ $log_count -gt 100 ]]; then
            log_info "🧹 Cleaning up old logs (keeping latest 100)..."
            ls -t *.json | tail -n +101 | xargs -r rm
            log_info "✅ Cleanup complete"
        fi
    fi
}

# Handle command line arguments
case "${1:-capture}" in
    "capture")
        main
        ;;
    "sync")
        if [[ -f "$LOG_FILE" ]]; then
            sync_to_dashboard "$LOG_FILE" "$DASHBOARD_API_URL"
        else
            log_error "No log file found at $LOG_FILE"
            exit 1
        fi
        ;;
    "help"|"-h"|"--help")
        cat <<EOF
ClaudeKit Session Metadata Capture Hook

USAGE:
    $0 [COMMAND]

COMMANDS:
    capture    (default) Capture session metadata and sync to dashboard
    sync       Sync existing log file to dashboard
    help       Show this help message

ENVIRONMENT VARIABLES:
    CLAUDEKIT_SESSION_ID        Session identifier (auto-generated if not set)
    CLAUDEKIT_CONVERSATION_ID  Conversation ID (auto-generated if not set)
    CLAUDEKIT_MODEL             Model used (default: claude-3-5-sonnet-20241022)
    CLAUDEKIT_STARTED_AT        Session start time (default: now)
    CLAUDEKIT_ENDED_AT          Session end time (default: now)
    CLAUDEKIT_TOOLS_USED        JSON array of tools used
    CLAUDEKIT_MESSAGES         JSON array of messages
    CLAUDEKIT_SUBAGENTS         JSON array of subagents
    CLAUDEKIT_SKILLS           JSON array of skills
    CLAUDEKIT_INPUT_TOKENS      Total input tokens
    CLAUDEKIT_OUTPUT_TOKENS     Total output tokens
    CLAUDEKIT_TOTAL_COST        Total cost in USD
    CLAUDEKIT_DASHBOARD_URL     Dashboard API URL (default: http://localhost:8788)

EXAMPLES:
    # Basic capture
    $0

    # With custom dashboard URL
    CLAUDEKIT_DASHBOARD_URL=https://my-dashboard.com $0

    # With custom session data
    CLAUDEKIT_MODEL=claude-3-opus-20240229 \\
    CLAUDEKIT_TOTAL_COST=0.1234 \\
    CLAUDEKIT_INPUT_TOKENS=1000 \\
    CLAUDEKIT_OUTPUT_TOKENS=500 \\
    $0

    # Sync existing log
    $0 sync
EOF
        ;;
    *)
        log_error "Unknown command: $1"
        log_info "Use '$0 help' for usage information"
        exit 1
        ;;
esac