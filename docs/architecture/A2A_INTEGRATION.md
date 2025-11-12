# A2A Protocol Integration

## Overview

Thread Node uses the **Agent2Agent (A2A) protocol** as its primary communication mechanism between all nodes in the system. This document details how A2A is integrated and utilized.

## Why A2A?

- **Standardized Communication**: Industry-standard protocol backed by 150+ organizations
- **Built for Multi-Agent Systems**: Designed specifically for agent collaboration
- **Task Lifecycle Management**: Native support for long-running, complex tasks
- **Agent Discovery**: Built-in capability advertisement via Agent Cards
- **Interoperability**: Nodes can interact with external A2A-compatible agents
- **Security**: Signed Agent Cards and authenticated connections

## Protocol Specifications

### Version
- **A2A Protocol**: v0.3+ (with gRPC support)
- **JSON-RPC**: 2.0
- **Transport**: HTTP(S) with TLS 1.3+

### Communication Patterns

#### 1. Synchronous Request/Response
Used for: Immediate queries, capability checks, quick tasks

```json
{
  "jsonrpc": "2.0",
  "method": "agent.query_capabilities",
  "params": {
    "required_skills": ["code-review", "refactoring"]
  },
  "id": "req-123"
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "agents": [
      {
        "agent_id": "worker-node-5",
        "skills": ["code-review", "refactoring", "testing"],
        "availability": "available",
        "load": 0.3
      }
    ]
  },
  "id": "req-123"
}
```

#### 2. Streaming (Server-Sent Events)
Used for: Long-running tasks, real-time progress updates

```json
{
  "jsonrpc": "2.0",
  "method": "task.execute_stream",
  "params": {
    "task_id": "task-456",
    "type": "code_analysis",
    "stream": true
  },
  "id": "req-124"
}
```

**Stream Events**:
```
data: {"status": "started", "progress": 0.0}

data: {"status": "processing", "progress": 0.3, "message": "Analyzing file 1/3"}

data: {"status": "processing", "progress": 0.6, "message": "Analyzing file 2/3"}

data: {"status": "completed", "progress": 1.0, "result": {...}}
```

#### 3. Asynchronous Push Notifications
Used for: Event notifications, status changes, alerts

```json
{
  "jsonrpc": "2.0",
  "method": "event.notify",
  "params": {
    "event_type": "worker.help_needed",
    "source_agent": "worker-node-3",
    "data": {
      "task_id": "task-789",
      "issue": "requires_specialized_knowledge",
      "required_skills": ["database-optimization"]
    }
  }
}
```

## Agent Card Schema

Every node in Thread Node publishes an Agent Card describing its capabilities.

### Base Agent Card Structure

```json
{
  "protocol_version": "0.3",
  "agent_id": "unique-node-id",
  "name": "Human-readable node name",
  "description": "Node purpose and capabilities",
  "version": "1.0.0",
  "node_type": "architect|broker|worker|validator",
  "endpoint": "https://node.thread.local/a2a",
  "authentication": {
    "type": "bearer_token",
    "token_endpoint": "https://node.thread.local/auth"
  },
  "capabilities": {
    "skills": [],
    "supported_tasks": [],
    "model_info": {}
  },
  "metadata": {},
  "security_card": {
    "signature": "...",
    "issuer": "thread-node-ca",
    "issued_at": "2025-01-15T10:00:00Z",
    "expires_at": "2026-01-15T10:00:00Z"
  }
}
```

## Task Object Schema

A2A tasks are the primary unit of work delegation in Thread Node.

### Task Structure

```json
{
  "task_id": "task-uuid-here",
  "created_at": "2025-01-15T10:30:00Z",
  "created_by": "architect-node-1",
  "assigned_to": "worker-node-5",
  "task_type": "code_analysis",
  "priority": "high",
  "status": "in_progress",
  "input": {
    "description": "Analyze this code for security vulnerabilities",
    "data": {
      "source_code": "...",
      "language": "python",
      "context": {}
    }
  },
  "requirements": {
    "skills_needed": ["security-analysis", "python"],
    "max_execution_time": 300,
    "quality_threshold": 0.85
  },
  "context": {
    "parent_task_id": "task-parent-uuid",
    "user_intent": "Security audit of payment module",
    "conversation_history": []
  },
  "output": null,
  "validation": null,
  "timeline": {
    "created": "2025-01-15T10:30:00Z",
    "started": "2025-01-15T10:30:15Z",
    "completed": null,
    "duration_seconds": null
  }
}
```

### Task Lifecycle States

1. **created** - Task object initialized
2. **queued** - Waiting for agent assignment
3. **assigned** - Agent selected, not yet started
4. **in_progress** - Agent actively working
5. **pending_validation** - Work complete, awaiting validation
6. **validation_failed** - Validator rejected output
7. **needs_clarification** - Requires client input
8. **completed** - Successfully finished
9. **failed** - Task could not be completed
10. **cancelled** - User or system cancelled

## Message Types

### 1. Task Delegation (Architect → Broker)

```json
{
  "jsonrpc": "2.0",
  "method": "task.delegate",
  "params": {
    "task": {
      "task_id": "task-001",
      "task_type": "data_processing",
      "input": {...},
      "requirements": {...}
    },
    "delegation_strategy": "best_match",
    "deadline": "2025-01-15T11:00:00Z"
  },
  "id": "msg-001"
}
```

### 2. Worker Query (Broker → Workers)

```json
{
  "jsonrpc": "2.0",
  "method": "agent.match_capabilities",
  "params": {
    "required_skills": ["data-processing", "json-parsing"],
    "preferred_model": "llama3",
    "min_availability": 0.5
  },
  "id": "msg-002"
}
```

### 3. Task Assignment (Broker → Worker)

```json
{
  "jsonrpc": "2.0",
  "method": "task.assign",
  "params": {
    "task": {...},
    "broker_id": "broker-node-1",
    "deadline": "2025-01-15T11:00:00Z"
  },
  "id": "msg-003"
}
```

### 4. Peer Assistance Request (Worker → Worker)

```json
{
  "jsonrpc": "2.0",
  "method": "peer.request_help",
  "params": {
    "requesting_agent": "worker-node-2",
    "task_id": "task-001",
    "help_type": "knowledge_sharing",
    "required_skill": "database-optimization",
    "context": {...}
  },
  "id": "msg-004"
}
```

### 5. Result Submission (Worker → Broker)

```json
{
  "jsonrpc": "2.0",
  "method": "task.submit_result",
  "params": {
    "task_id": "task-001",
    "worker_id": "worker-node-2",
    "status": "completed",
    "output": {...},
    "metadata": {
      "execution_time": 45.2,
      "model_used": "llama3:7b",
      "confidence": 0.92
    }
  },
  "id": "msg-005"
}
```

### 6. Validation Request (Broker → Validator)

```json
{
  "jsonrpc": "2.0",
  "method": "validation.request",
  "params": {
    "task_id": "task-001",
    "output": {...},
    "requirements": {...},
    "validation_criteria": {
      "accuracy_threshold": 0.85,
      "completeness_check": true,
      "format_validation": true
    }
  },
  "id": "msg-006"
}
```

### 7. Re-Architecting Trigger (Workers → Broker)

```json
{
  "jsonrpc": "2.0",
  "method": "system.request_rearchitect",
  "params": {
    "task_id": "task-001",
    "reason": "approach_not_viable",
    "participating_workers": ["worker-node-2", "worker-node-3"],
    "proposed_strategy": "collaborative_solution",
    "architect_consulted": true
  },
  "id": "msg-007"
}
```

## Discovery Mechanism

### Agent Card Publication

Each node publishes its Agent Card at a well-known endpoint:

```
GET https://node.thread.local/.well-known/agent-card
```

### Agent Registry

Thread Node maintains a central registry for quick discovery:

```json
{
  "jsonrpc": "2.0",
  "method": "registry.query",
  "params": {
    "node_type": "worker",
    "skills": ["code-analysis"],
    "status": "available"
  },
  "id": "registry-query-1"
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "agents": [
      {
        "agent_id": "worker-node-1",
        "card_url": "https://worker1.thread.local/.well-known/agent-card",
        "last_seen": "2025-01-15T10:35:00Z",
        "load": 0.2
      }
    ],
    "count": 1
  },
  "id": "registry-query-1"
}
```

## Security Implementation

### 1. TLS Encryption
- All A2A communication uses HTTPS with TLS 1.3
- Certificate-based authentication for nodes
- Mutual TLS (mTLS) for sensitive operations

### 2. Agent Card Signatures
```json
{
  "security_card": {
    "signature": "base64-encoded-signature",
    "signing_algorithm": "RS256",
    "issuer": "thread-node-certificate-authority",
    "issued_at": "2025-01-15T00:00:00Z",
    "expires_at": "2026-01-15T00:00:00Z",
    "public_key": "..."
  }
}
```

### 3. Authentication Flow
1. Client connects to node endpoint
2. Node presents signed Agent Card
3. Client verifies signature against CA
4. JWT token issued for session
5. Token included in all subsequent requests

## Error Handling

### Standard A2A Error Codes

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32001,
    "message": "Agent unavailable",
    "data": {
      "agent_id": "worker-node-5",
      "reason": "overloaded",
      "retry_after": 30
    }
  },
  "id": "msg-008"
}
```

**Thread Node Error Codes**:
- `-32001`: Agent unavailable
- `-32002`: Insufficient capabilities
- `-32003`: Task timeout
- `-32004`: Validation failed
- `-32005`: Re-architecting required
- `-32006`: Resource allocation failed

## Performance Considerations

### Message Batching
For efficiency, multiple task queries can be batched:

```json
{
  "jsonrpc": "2.0",
  "method": "batch.process",
  "params": {
    "operations": [
      {"method": "task.assign", "params": {...}},
      {"method": "task.assign", "params": {...}},
      {"method": "task.assign", "params": {...}}
    ]
  },
  "id": "batch-001"
}
```

### Connection Pooling
- Maintain persistent connections between frequently communicating nodes
- HTTP/2 connection reuse
- WebSocket upgrade for long-lived sessions

### Caching
- Cache Agent Cards with TTL
- Cache capability queries for 60 seconds
- Invalidate on agent status change

## Monitoring and Observability

### A2A Metrics to Track
- Message roundtrip time
- Task completion rate
- Agent availability
- Error rates by node type
- Task queue depth
- Re-architecting frequency

### Logging
All A2A messages should be logged with:
- Timestamp
- Source and destination agents
- Method name
- Task ID (if applicable)
- Response time
- Status code

## SDK Usage

### Python Example (Broker assigning task to Worker)

```python
from a2a_sdk import A2AClient, Task

# Initialize A2A client
client = A2AClient(
    agent_id="broker-node-1",
    endpoint="https://broker1.thread.local/a2a"
)

# Create task
task = Task(
    task_type="code_review",
    input={
        "code": "...",
        "language": "python"
    },
    requirements={
        "skills_needed": ["code-review", "python"],
        "max_execution_time": 120
    }
)

# Find capable worker
workers = client.query_capabilities(
    skills=["code-review", "python"],
    min_availability=0.5
)

# Assign to best worker
result = client.assign_task(
    task=task,
    target_agent=workers[0].agent_id
)

# Monitor progress
for update in client.stream_progress(task.task_id):
    print(f"Progress: {update.progress * 100}%")
```

## Next Steps

1. Implement A2A gateway service
2. Create Agent Card generator for each node type
3. Build task lifecycle manager
4. Implement discovery service
5. Set up monitoring and logging
6. Create SDK wrappers for Thread-specific operations

## References

- [A2A Protocol Specification](https://a2a-protocol.org/latest/specification/)
- [A2A GitHub Repository](https://github.com/a2aproject/A2A)
- [Agent Card Specifications](./AGENT_CARDS.md)
- [Message Flow Diagrams](./MESSAGE_FLOWS.md)
