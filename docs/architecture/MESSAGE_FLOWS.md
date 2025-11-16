# Message Flow Diagrams

## Overview

This document provides detailed message flow diagrams for all major operations in Thread Node using the A2A protocol. Each flow shows the sequence of A2A messages exchanged between nodes.

## Flow 1: Standard Task Execution

The most common flow: User request → Architect → Broker → Worker → Validator → Result

```
┌──────┐      ┌──────────┐      ┌────────┐      ┌────────┐      ┌──────────┐
│Client│      │Architect │      │ Broker │      │ Worker │      │Validator │
└──┬───┘      └────┬─────┘      └───┬────┘      └───┬────┘      └────┬─────┘
   │               │                 │               │                │
   │ 1. User       │                 │               │                │
   │ Request       │                 │               │                │
   ├──────────────>│                 │               │                │
   │               │                 │               │                │
   │               │ 2. task.delegate                │                │
   │               ├────────────────>│               │                │
   │               │                 │               │                │
   │               │                 │ 3. agent.match_capabilities    │
   │               │                 ├──────────────>│                │
   │               │                 │               │                │
   │               │                 │ 4. capabilities_response       │
   │               │                 │<──────────────┤                │
   │               │                 │               │                │
   │               │                 │ 5. task.assign                 │
   │               │                 ├──────────────>│                │
   │               │                 │               │                │
   │               │                 │               │ 6. OLLAMA      │
   │               │                 │               │ Inference      │
   │               │                 │               │ (local)        │
   │               │                 │               │                │
   │               │                 │ 7. task.submit_result          │
   │               │                 │<──────────────┤                │
   │               │                 │               │                │
   │               │                 │ 8. validation.request          │
   │               │                 ├───────────────────────────────>│
   │               │                 │               │                │
   │               │                 │               │                │ 9. Validate
   │               │                 │               │                │ Output
   │               │                 │               │                │
   │               │                 │ 10. validation.response        │
   │               │                 │<───────────────────────────────┤
   │               │                 │               │                │
   │               │ 11. task.complete               │                │
   │               │<────────────────┤               │                │
   │               │                 │               │                │
   │ 12. Result    │                 │               │                │
   │<──────────────┤                 │               │                │
   │               │                 │               │                │
```

### Message Details

**1. User Request (Client → Architect)**
```json
{
  "jsonrpc": "2.0",
  "method": "user.submit_request",
  "params": {
    "request_id": "req-001",
    "user_id": "user-123",
    "input": {
      "type": "natural_language",
      "content": "Analyze this Python code for security vulnerabilities"
    },
    "context": {...}
  },
  "id": "msg-001"
}
```

**2. Task Delegation (Architect → Broker)**
```json
{
  "jsonrpc": "2.0",
  "method": "task.delegate",
  "params": {
    "task": {
      "task_id": "task-001",
      "type": "code_analysis",
      "requirements": {
        "skills": ["security-audit", "python"],
        "deadline": "2025-01-15T11:00:00Z"
      }
    }
  },
  "id": "msg-002"
}
```

**5. Task Assignment (Broker → Worker)**
```json
{
  "jsonrpc": "2.0",
  "method": "task.assign",
  "params": {
    "task_id": "task-001",
    "assigned_worker": "worker-node-042",
    "deadline": "2025-01-15T11:00:00Z"
  },
  "id": "msg-003"
}
```

## Flow 2: Worker-to-Worker Collaboration

When a Worker needs help from another Worker

```
┌────────┐         ┌────────┐         ┌────────┐         ┌────────┐
│ Broker │         │Worker A│         │Worker B│         │Worker C│
└───┬────┘         └───┬────┘         └───┬────┘         └───┬────┘
    │                  │                  │                  │
    │ 1. task.assign   │                  │                  │
    ├─────────────────>│                  │                  │
    │                  │                  │                  │
    │                  │ 2. Start work    │                  │
    │                  │ (encounters      │                  │
    │                  │  problem)        │                  │
    │                  │                  │                  │
    │                  │ 3. peer.request_help                │
    │                  ├─────────────────>│                  │
    │                  │                  │                  │
    │                  │ 4. peer.help_unavailable           │
    │                  │<─────────────────┤                  │
    │                  │                  │                  │
    │                  │ 5. peer.request_help                │
    │                  ├────────────────────────────────────>│
    │                  │                  │                  │
    │                  │                  │                  │ 6. Process
    │                  │                  │                  │ Request
    │                  │                  │                  │
    │                  │ 7. peer.help_response               │
    │                  │<────────────────────────────────────┤
    │                  │                  │                  │
    │                  │ 8. Complete task │                  │
    │                  │ with help        │                  │
    │                  │                  │                  │
    │ 9. task.submit   │                  │                  │
    │<─────────────────┤                  │                  │
    │                  │                  │                  │
    │ 10. peer.credit  │                  │                  │
    ├────────────────────────────────────────────────────────>│
    │                  │                  │                  │
```

### Message Details

**3. Peer Help Request (Worker A → Worker B)**
```json
{
  "jsonrpc": "2.0",
  "method": "peer.request_help",
  "params": {
    "requesting_agent": "worker-node-042",
    "task_id": "task-001",
    "help_type": "knowledge_sharing",
    "required_skill": "database-optimization",
    "context": {
      "current_progress": "Analyzed 80% but stuck on SQL query optimization",
      "specific_question": "How to optimize this complex JOIN query?"
    }
  },
  "id": "msg-004"
}
```

**7. Peer Help Response (Worker C → Worker A)**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "help_provided": true,
    "solution": {
      "type": "optimization_suggestion",
      "content": "Use indexed views and query hints...",
      "confidence": 0.92
    },
    "assisting_agent": "worker-node-088"
  },
  "id": "msg-004"
}
```

## Flow 3: Re-Architecting (Self-Organization)

When Workers need to reorganize after Architect's plan fails

```
┌──────────┐    ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
│Architect │    │ Broker │    │Worker 1│    │Worker 2│    │Worker 3│
└────┬─────┘    └───┬────┘    └───┬────┘    └───┬────┘    └───┬────┘
     │              │              │              │              │
     │ 1. Delegate  │              │              │              │
     │ complex task │              │              │              │
     ├─────────────>│              │              │              │
     │              │              │              │              │
     │              │ 2. Assign    │              │              │
     │              ├─────────────>│              │              │
     │              │ 3. Assign    │              │              │
     │              ├──────────────────────────────>              │
     │              │ 4. Assign    │              │              │
     │              ├────────────────────────────────────────────>│
     │              │              │              │              │
     │              │              │ 5. task.failed              │
     │              │<─────────────┤              │              │
     │              │              │ 6. task.failed              │
     │              │<──────────────────────────────              │
     │              │              │              │ 7. task.failed
     │              │<────────────────────────────────────────────┤
     │              │              │              │              │
     │              │ 8. escalate_to_architect    │              │
     │              ├─────────────>│              │              │
     │              │              │              │              │
     │ 9. Unable to │              │              │              │
     │ resolve      │              │              │              │
     │<─────────────┤              │              │              │
     │              │              │              │              │
     │              │ 10. system.request_rearchitect             │
     │              │<─────────────┤              │              │
     │              │<──────────────────────────────              │
     │              │<────────────────────────────────────────────┤
     │              │              │              │              │
     │              │ 11. rearchitect.approve     │              │
     │              ├─────────────>│              │              │
     │              ├──────────────────────────────>              │
     │              ├────────────────────────────────────────────>│
     │              │              │              │              │
     │              │              │ 12. Workers collaborate      │
     │              │              │ as "mini-architects"         │
     │              │              │<────────────>│              │
     │              │              │<──────────────────────────>│
     │              │              │              │<────────────>│
     │              │              │              │              │
     │              │              │ 13. New task plan created   │
     │              │              │              │              │
     │              │              │ 14. Execute new plan        │
     │              │              │              │              │
     │              │ 15. task.complete (from worker group)      │
     │              │<─────────────┤              │              │
     │              │              │              │              │
     │ 16. Report   │              │              │              │
     │ completion   │              │              │              │
     │<─────────────┤              │              │              │
     │              │              │              │              │
```

### Message Details

**10. Re-Architecting Request (Workers → Broker)**
```json
{
  "jsonrpc": "2.0",
  "method": "system.request_rearchitect",
  "params": {
    "task_id": "task-001",
    "reason": "original_approach_not_viable",
    "failed_attempts": 3,
    "participating_workers": [
      "worker-node-042",
      "worker-node-055",
      "worker-node-088"
    ],
    "architect_consulted": true,
    "proposed_strategy": {
      "type": "collaborative_decomposition",
      "description": "Workers will break task into micro-tasks and collaborate"
    }
  },
  "id": "msg-010"
}
```

## Flow 4: Validation with Client Clarification

When Validator needs user input to verify output

```
┌────────┐    ┌────────┐    ┌──────────┐    ┌──────┐
│ Broker │    │ Worker │    │Validator │    │Client│
└───┬────┘    └───┬────┘    └────┬─────┘    └──┬───┘
    │             │              │              │
    │ 1. assign   │              │              │
    ├────────────>│              │              │
    │             │              │              │
    │             │ 2. Execute   │              │
    │             │              │              │
    │ 3. submit   │              │              │
    │<────────────┤              │              │
    │             │              │              │
    │ 4. validation.request      │              │
    ├────────────────────────────>│              │
    │             │              │              │
    │             │              │ 5. Validate  │
    │             │              │ (ambiguous   │
    │             │              │  result)     │
    │             │              │              │
    │             │              │ 6. client.request_clarification
    │             │              ├─────────────>│
    │             │              │              │
    │             │              │              │ 7. User
    │             │              │              │ Reviews
    │             │              │              │
    │             │              │ 8. clarification_response
    │             │              │<─────────────┤
    │             │              │              │
    │             │              │ 9. Re-validate
    │             │              │ with context │
    │             │              │              │
    │ 10. validation.response    │              │
    │<────────────────────────────┤              │
    │             │              │              │
    │ 11. Forward │              │              │
    │ to Architect│              │              │
    │             │              │              │
```

### Message Details

**6. Client Clarification Request (Validator → Client)**
```json
{
  "jsonrpc": "2.0",
  "method": "client.request_clarification",
  "params": {
    "task_id": "task-001",
    "validation_id": "val-001",
    "reason": "ambiguous_requirement",
    "question": {
      "type": "multiple_choice",
      "content": "The output includes two possible solutions. Which approach do you prefer?",
      "options": [
        {
          "id": "opt-a",
          "description": "Fast performance, moderate accuracy (85%)"
        },
        {
          "id": "opt-b",
          "description": "Slower performance, high accuracy (95%)"
        }
      ]
    },
    "context": {
      "original_request": "...",
      "worker_output": "..."
    }
  },
  "id": "msg-006"
}
```

## Flow 5: Dynamic Resource Allocation

Worker requests compute resources from peer

```
┌────────┐    ┌────────┐    ┌────────┐    ┌──────────┐
│ Broker │    │Worker A│    │Worker B│    │Architect │
└───┬────┘    └───┬────┘    └───┬────┘    └────┬─────┘
    │             │              │              │
    │ 1. assign   │              │              │
    │ (large task)│              │              │
    ├────────────>│              │              │
    │             │              │              │
    │             │ 2. Assess    │              │
    │             │ resource needs              │
    │             │              │              │
    │             │ 3. peer.request_compute     │
    │             ├─────────────>│              │
    │             │              │              │
    │             │              │ 4. Check     │
    │             │              │ availability │
    │             │              │              │
    │             │ 5. compute_unavailable      │
    │             │<─────────────┤              │
    │             │              │              │
    │             │ 6. resource.request_allocation
    │             ├─────────────>│              │
    │             │              │              │
    │             │              │ 7. broker.request_resources
    │             │              ├─────────────>│
    │             │              │              │
    │             │              │              │ 8. Evaluate
    │             │              │              │ & Approve
    │             │              │              │
    │             │              │ 9. resource.provision
    │             │              │<─────────────┤
    │             │              │              │
    │             │ 10. resource.allocated      │
    │             │<─────────────┤              │
    │             │              │              │
    │             │ 11. Execute with additional │
    │             │ compute resources           │
    │             │              │              │
    │ 12. complete│              │              │
    │<────────────┤              │              │
    │             │              │              │
```

## Flow 6: Architect Performance Flagging

Validator reports systematic Architect issues

```
┌────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Broker │    │Validator │    │Architect │    │Monitoring│
└───┬────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
    │              │              │              │
    │ 1. validation.request       │              │
    ├─────────────>│              │              │
    │              │              │              │
    │              │ 2. Validate  │              │
    │              │ (detect      │              │
    │              │  pattern)    │              │
    │              │              │              │
    │              │ 3. system.flag_architect    │
    │              ├─────────────────────────────>│
    │              │              │              │
    │              │              │              │ 4. Analyze
    │              │              │              │ Pattern
    │              │              │              │
    │              │              │ 5. monitoring.alert
    │              │              │<─────────────┤
    │              │              │              │
    │              │              │ 6. Review &  │
    │              │              │ Adjust       │
    │              │              │              │
    │              │ 7. validation.response      │
    │<─────────────┤              │              │
    │              │              │              │
```

### Message Details

**3. Architect Flagging (Validator → Monitoring)**
```json
{
  "jsonrpc": "2.0",
  "method": "system.flag_architect",
  "params": {
    "architect_id": "architect-node-001",
    "issue_type": "poor_task_decomposition",
    "evidence": [
      {
        "task_id": "task-001",
        "issue": "Subtasks had circular dependencies"
      },
      {
        "task_id": "task-015",
        "issue": "Assigned wrong skills to broker"
      },
      {
        "task_id": "task-029",
        "issue": "Decomposition too granular, overhead exceeded benefit"
      }
    ],
    "severity": "medium",
    "frequency": "3 incidents in 24 hours",
    "recommendation": "Review decomposition algorithm"
  },
  "id": "msg-flag-001"
}
```

## Flow 7: Streaming Progress Updates

Real-time task progress via SSE

```
┌──────┐         ┌────────┐         ┌────────┐
│Client│         │Architect│        │ Worker │
└──┬───┘         └───┬────┘         └───┬────┘
   │                 │                  │
   │ 1. Submit       │                  │
   │ (streaming=true)│                  │
   ├────────────────>│                  │
   │                 │                  │
   │ 2. SSE Stream   │                  │
   │ Opened          │                  │
   │<════════════════│                  │
   │                 │                  │
   │                 │ 3. Delegate      │
   │                 ├─────────────────>│
   │                 │                  │
   │                 │ 4. stream.update │
   │                 │<─────────────────┤
   │ 5. Progress: 10%                   │
   │<════════════════│                  │
   │                 │                  │
   │                 │ 6. stream.update │
   │                 │<─────────────────┤
   │ 7. Progress: 40%                   │
   │<════════════════│                  │
   │                 │                  │
   │                 │ 8. stream.update │
   │                 │<─────────────────┤
   │ 9. Progress: 75%                   │
   │<════════════════│                  │
   │                 │                  │
   │                 │ 10. Complete     │
   │                 │<─────────────────┤
   │ 11. Progress: 100%                 │
   │ + Final Result  │                  │
   │<════════════════│                  │
   │                 │                  │
```

### SSE Stream Format

```
data: {"status": "started", "progress": 0.0, "message": "Task initiated"}

data: {"status": "processing", "progress": 0.1, "message": "Analyzing input..."}

data: {"status": "processing", "progress": 0.4, "message": "Worker executing task..."}

data: {"status": "processing", "progress": 0.75, "message": "Validating output..."}

data: {"status": "completed", "progress": 1.0, "result": {...}}
```

## Flow 8: Multi-Broker Task Distribution

Architect delegates to multiple Brokers

```
┌──────────┐    ┌─────────┐  ┌─────────┐  ┌─────────┐
│Architect │    │Broker 1 │  │Broker 2 │  │Broker 3 │
└────┬─────┘    └────┬────┘  └────┬────┘  └────┬────┘
     │               │            │            │
     │ 1. Complex    │            │            │
     │ Task Received │            │            │
     │               │            │            │
     │ 2. Decompose  │            │            │
     │ into 3        │            │            │
     │ subtasks      │            │            │
     │               │            │            │
     │ 3. delegate   │            │            │
     │ subtask_1     │            │            │
     ├──────────────>│            │            │
     │               │            │            │
     │ 4. delegate   │            │            │
     │ subtask_2     │            │            │
     ├───────────────────────────>│            │
     │               │            │            │
     │ 5. delegate   │            │            │
     │ subtask_3     │            │            │
     ├────────────────────────────────────────>│
     │               │            │            │
     │               │ 6. Process │ 7. Process │ 8. Process
     │               │ subtask_1  │ subtask_2  │ subtask_3
     │               │            │            │
     │ 9. complete_1 │            │            │
     │<──────────────┤            │            │
     │               │            │            │
     │               │ 10. complete_2          │
     │<───────────────────────────┤            │
     │               │            │            │
     │               │            │ 11. complete_3
     │<────────────────────────────────────────┤
     │               │            │            │
     │ 12. Aggregate │            │            │
     │ results       │            │            │
     │               │            │            │
     │ 13. Return    │            │            │
     │ final result  │            │            │
     │               │            │            │
```

## Summary of Message Types

| Message Type | Direction | Purpose |
|--------------|-----------|---------|
| `user.submit_request` | Client → Architect | Initial user request |
| `task.delegate` | Architect → Broker | Delegate task to broker |
| `agent.match_capabilities` | Broker → Worker | Query worker capabilities |
| `task.assign` | Broker → Worker | Assign task to worker |
| `task.submit_result` | Worker → Broker | Submit completed task |
| `validation.request` | Broker → Validator | Request output validation |
| `validation.response` | Validator → Broker | Validation results |
| `task.complete` | Broker → Architect | Task completion report |
| `peer.request_help` | Worker → Worker | Request peer assistance |
| `peer.help_response` | Worker → Worker | Provide assistance |
| `system.request_rearchitect` | Workers → Broker | Request task reorganization |
| `client.request_clarification` | Validator → Client | Ask user for clarification |
| `resource.request_allocation` | Worker → Broker | Request compute resources |
| `system.flag_architect` | Validator → Monitoring | Report architect issues |
| `stream.update` | Any → Any | Real-time progress update |

## Error Handling Flows

### Timeout Handling

```
Worker timeout → Broker detects → Reassign to different Worker → Notify Architect
```

### Validation Failure

```
Validator rejects → Broker notifies Worker → Worker fixes → Resubmit → Re-validate
```

### Complete Failure

```
All Workers fail → Broker escalates → Architect re-architects → New delegation
```

## Performance Considerations

- **Parallel Execution**: Multiple brokers process subtasks simultaneously
- **Async Notifications**: Non-blocking updates via SSE
- **Batching**: Group similar queries to reduce message overhead
- **Caching**: Cache Agent Cards to avoid repeated lookups

## Next Steps

1. Implement A2A message handlers for each node type
2. Create message validation schemas
3. Build streaming infrastructure (SSE)
4. Implement error handling and retry logic
5. Add message logging and tracing

## References

- [A2A Protocol Integration](./A2A_INTEGRATION.md)
- [Agent Card Specifications](./AGENT_CARDS.md)
- [System Architecture](./ARCHITECTURE.md)
