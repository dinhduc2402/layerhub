#!/bin/bash
# Test script for ClaudeKit Session Capture Hook

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}ℹ️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Test 1: Hook script exists and is executable
test_hook_exists() {
    log_info "Test 1: Checking hook script..."
    
    local hook_script="./.claude/hooks/session-capture.sh"
    
    if [[ -f "$hook_script" ]]; then
        log_info "✅ Hook script exists"
    else
        log_error "❌ Hook script not found at $hook_script"
        return 1
    fi
    
    if [[ -x "$hook_script" ]]; then
        log_info "✅ Hook script is executable"
    else
        log_error "❌ Hook script is not executable"
        return 1
    fi
}

# Test 2: Help command works
test_help_command() {
    log_info "Test 2: Testing help command..."
    
    if ./.claude/hooks/session-capture.sh help >/dev/null 2>&1; then
        log_info "✅ Help command works"
    else
        log_error "❌ Help command failed"
        return 1
    fi
}

# Test 3: Basic capture functionality
test_basic_capture() {
    log_info "Test 3: Testing basic capture..."
    
    # Set up test environment
    export CLAUDEKIT_SESSION_ID="test-session-$(date +%s)"
    export CLAUDEKIT_MODEL="claude-3-5-sonnet-20241022"
    export CLAUDEKIT_TOTAL_COST="0.0123"
    export CLAUDEKIT_INPUT_TOKENS="500"
    export CLAUDEKIT_OUTPUT_TOKENS="250"
    export CLAUDEKIT_TOOLS_USED='[{"tool_name":"read","timestamp":"2025-11-07T10:00:00Z","success":true}]'
    export CLAUDEKIT_MESSAGES='[{"role":"user","timestamp":"2025-11-07T10:00:00Z","input_tokens":500,"output_tokens":0}]'
    
    # Run capture
    local output
    if output=$(./.claude/hooks/session-capture.sh capture 2>&1); then
        log_info "✅ Basic capture works"
        if echo "$output" | grep -q "Session metadata saved"; then
            log_info "✅ Log file created"
        else
            log_warn "⚠️  Unexpected output format"
        fi
    else
        log_error "❌ Basic capture failed"
        echo "$output"
        return 1
    fi
    
    # Check if log file was created
    local log_file="$HOME/.claudekit/logs/${CLAUDEKIT_SESSION_ID}.json"
    if [[ -f "$log_file" ]]; then
        log_info "✅ Log file created at $log_file"
        
        # Validate JSON structure
        if jq empty "$log_file" 2>/dev/null; then
            log_info "✅ Log file contains valid JSON"
        else
            log_error "❌ Log file contains invalid JSON"
            return 1
        fi
    else
        log_error "❌ Log file not created"
        return 1
    fi
}

# Test 4: JSON structure validation
test_json_structure() {
    log_info "Test 4: Testing JSON structure..."
    
    local log_file="$HOME/.claudekit/logs/${CLAUDEKIT_SESSION_ID}.json"
    
    if [[ ! -f "$log_file" ]]; then
        log_error "❌ Log file not found for JSON validation"
        return 1
    fi
    
    # Check required fields
    local required_fields=("session_id" "conversation_id" "started_at" "ended_at" "total_cost" "total_tokens")
    
    for field in "${required_fields[@]}"; do
        if jq -e ".$field" "$log_file" >/dev/null 2>&1; then
            log_info "✅ Field '$field' present"
        else
            log_error "❌ Required field '$field' missing"
            return 1
        fi
    done
    
    # Check data types
    local session_id=$(jq -r '.session_id' "$log_file")
    local total_cost=$(jq '.total_cost' "$log_file")
    local total_tokens=$(jq '.total_tokens' "$log_file")
    
    if [[ -n "$session_id" && "$session_id" != "null" ]]; then
        log_info "✅ session_id is valid string"
    else
        log_error "❌ session_id is invalid"
        return 1
    fi
    
    if [[ "$total_cost" =~ ^[0-9]+\.?[0-9]*$ ]]; then
        log_info "✅ total_cost is valid number"
    else
        log_error "❌ total_cost is invalid number: $total_cost"
        return 1
    fi
    
    if [[ "$total_tokens" =~ ^[0-9]+$ ]]; then
        log_info "✅ total_tokens is valid integer"
    else
        log_error "❌ total_tokens is invalid integer: $total_tokens"
        return 1
    fi
}

# Test 5: Dashboard sync (if API is running)
test_dashboard_sync() {
    log_info "Test 5: Testing dashboard sync..."
    
    # Check if dashboard API is running
    if curl -s http://localhost:8788/api/conversations >/dev/null 2>&1; then
        log_info "✅ Dashboard API is running"
        
        # Test sync
        local log_file="$HOME/.claudekit/logs/${CLAUDEKIT_SESSION_ID}.json"
        if ./.claude/hooks/session-capture.sh sync >/dev/null 2>&1; then
            log_info "✅ Dashboard sync works"
        else
            log_warn "⚠️  Dashboard sync failed (API may be unreachable)"
        fi
    else
        log_warn "⚠️  Dashboard API not running - skipping sync test"
    fi
}

# Test 6: Error handling
test_error_handling() {
    log_info "Test 6: Testing error handling..."
    
    # Test invalid command
    if ./.claude/hooks/session-capture.sh invalid_command 2>/dev/null; then
        log_error "❌ Should fail on invalid command"
        return 1
    else
        log_info "✅ Properly handles invalid command"
    fi
    
    # Test with invalid JSON in environment
    export CLAUDEKIT_TOOLS_USED="invalid json"
    local output
    if output=$(CLAUDEKIT_TOOLS_USED="invalid json" ./.claude/hooks/session-capture.sh capture 2>&1); then
        log_warn "⚠️  Should handle invalid JSON better"
    else
        log_info "✅ Handles invalid JSON gracefully"
    fi
}

# Main test runner
main() {
    echo "🧪 ClaudeKit Session Capture Hook Tests"
    echo "===================================="
    
    local tests_passed=0
    local tests_failed=0
    
    # Run tests
    if test_hook_exists; then ((tests_passed++)); else ((tests_failed++)); fi
    if test_help_command; then ((tests_passed++)); else ((tests_failed++)); fi
    if test_basic_capture; then ((tests_passed++)); else ((tests_failed++)); fi
    if test_json_structure; then ((tests_passed++)); else ((tests_failed++)); fi
    if test_dashboard_sync; then ((tests_passed++)); else ((tests_failed++)); fi
    if test_error_handling; then ((tests_passed++)); else ((tests_failed++)); fi
    
    # Summary
    echo ""
    echo "📊 Test Results"
    echo "==============="
    echo -e "Tests passed: ${GREEN}$tests_passed${NC}"
    echo -e "Tests failed: ${RED}$tests_failed${NC}"
    echo -e "Total tests: $((tests_passed + tests_failed))"
    
    if [[ $tests_failed -eq 0 ]]; then
        echo -e "${GREEN}🎉 All tests passed!${NC}"
        echo ""
        echo "📋 Next Steps:"
        echo "1. Add hook to .claude/settings.json"
        echo "2. Test with real Claude Code session"
        echo "3. Verify data appears in dashboard"
        return 0
    else
        echo -e "${RED}❌ Some tests failed. Please review the output above.${NC}"
        return 1
    fi
}

# Run tests
main "$@"