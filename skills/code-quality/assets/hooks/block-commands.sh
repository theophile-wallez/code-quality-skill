#!/bin/bash
# A Claude Code PreToolUse hook that refuses heavy or dangerous shell commands,
# with a reason the agent reads. Register it in .claude/settings.json:
#
#   "hooks": { "PreToolUse": [{ "matcher": "Bash", "hooks": [
#     { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-commands.sh" }
#   ] }] }
#
# When the user asks for one of these commands, the agent prefixes it with
# ALLOW_COMMAND=1. Needs jq.

command=$(jq -r '.tool_input.command // ""')

if printf '%s' "$command" | grep -q 'ALLOW_COMMAND=1'; then
  exit 0
fi

# Each line: a pattern (extended regex), a tab, the reason. Adapt to the project.
rules=$(cat <<'RULES'
(pnpm|npm|yarn|bun)( run)? test:e2e	The end-to-end suite opens many browsers at once and leaves the machine swapping: CI runs it.
git push .*(--force|-f( |$))	Never force-push: rebase and push again, or ask the user.
git reset --hard	It throws away uncommitted work: stash it, or ask the user.
rm -rf (/|~|\$HOME)/?( |$)	It deletes the whole disk or home folder.
RULES
)

while IFS=$'\t' read -r pattern reason; do
  if printf '%s' "$command" | grep -Eq -- "$pattern"; then
    jq -n --arg reason "Blocked: $reason If the user asked for this exact command, run it again prefixed with ALLOW_COMMAND=1." '{
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: $reason
      }
    }'
    exit 0
  fi
done <<< "$rules"

exit 0
