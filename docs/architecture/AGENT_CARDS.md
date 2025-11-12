# Agent Card Specifications

## Overview

Agent Cards are the self-description mechanism used by all nodes in Thread Node. Each card advertises the node's capabilities, skills, configuration, and connection information following the A2A protocol standard.

## Base Schema

All Agent Cards share this common structure:

```typescript
interface AgentCard {
  // A2A Standard Fields
  protocol_version: string;        // "0.3"
  agent_id: string;                // Unique identifier
  name: string;                    // Human-readable name
  description: string;             // Purpose and capabilities
  version: string;                 // Node software version
  endpoint: string;                // A2A endpoint URL

  // Thread Node Specific
  node_type: "architect" | "broker" | "worker" | "validator";

  // Authentication
  authentication: {
    type: "bearer_token" | "mTLS" | "api_key";
    token_endpoint?: string;
    certificate?: string;
  };

  // Capabilities
  capabilities: {
    skills: string[];              // Task skills
    supported_tasks: string[];     // Task types
    model_info: ModelInfo;         // LLM configuration
    performance: PerformanceMetrics;
  };

  // System Info
  metadata: {
    created_at: string;
    last_updated: string;
    status: "available" | "busy" | "offline";
    load: number;                  // 0.0 - 1.0
    max_concurrent_tasks: number;
  };

  // Security
  security_card: {
    signature: string;
    signing_algorithm: string;
    issuer: string;
    issued_at: string;
    expires_at: string;
    public_key: string;
  };
}
```

## 1. Architect Node Agent Card

### Purpose
Architect nodes are responsible for strategic planning, task decomposition, and high-level orchestration.

### Complete Schema

```json
{
  "protocol_version": "0.3",
  "agent_id": "architect-node-001",
  "name": "Strategic Task Architect",
  "description": "Decomposes complex user requests into executable task plans and orchestrates broker delegation",
  "version": "1.0.0",
  "node_type": "architect",
  "endpoint": "https://architect-001.thread.local:8443/a2a",

  "authentication": {
    "type": "bearer_token",
    "token_endpoint": "https://architect-001.thread.local:8443/auth/token"
  },

  "capabilities": {
    "skills": [
      "task-decomposition",
      "strategic-planning",
      "broker-selection",
      "progress-aggregation",
      "result-synthesis",
      "conflict-resolution"
    ],
    "supported_tasks": [
      "user-request-processing",
      "task-planning",
      "broker-delegation",
      "progress-monitoring",
      "result-compilation"
    ],
    "model_info": {
      "provider": "ollama",
      "endpoint": "http://localhost:11434",
      "model": "llama3:70b",
      "context_window": 8192,
      "temperature": 0.3,
      "reasoning_capability": "high",
      "planning_optimized": true
    },
    "performance": {
      "avg_decomposition_time_ms": 2500,
      "max_subtasks_per_request": 50,
      "concurrent_orchestrations": 10,
      "success_rate": 0.94
    },
    "delegation_strategies": [
      "skill-based-matching",
      "load-balancing",
      "priority-weighted",
      "affinity-routing"
    ],
    "monitoring": {
      "real_time_tracking": true,
      "progress_aggregation": true,
      "failure_detection": true,
      "auto_recovery": true
    }
  },

  "metadata": {
    "created_at": "2025-01-15T08:00:00Z",
    "last_updated": "2025-01-15T10:30:00Z",
    "status": "available",
    "load": 0.35,
    "max_concurrent_tasks": 10,
    "current_active_tasks": 3,
    "total_tasks_processed": 1247,
    "uptime_seconds": 86400
  },

  "communication": {
    "inbound_from": ["frontend", "validator"],
    "outbound_to": ["broker"],
    "supported_patterns": ["request-response", "streaming", "async-notification"]
  },

  "security_card": {
    "signature": "MEUCIQD7...",
    "signing_algorithm": "RS256",
    "issuer": "thread-node-ca",
    "issued_at": "2025-01-15T00:00:00Z",
    "expires_at": "2026-01-15T00:00:00Z",
    "public_key": "-----BEGIN PUBLIC KEY-----\n..."
  }
}
```

### Key Capabilities

- **Task Decomposition**: Breaking complex requests into subtasks
- **Broker Selection**: Choosing appropriate brokers based on load and capabilities
- **Progress Monitoring**: Real-time tracking of all delegated tasks
- **Result Synthesis**: Combining outputs from multiple brokers
- **Adaptive Re-planning**: Adjusting strategy based on feedback

## 2. Broker Node Agent Card

### Purpose
Broker nodes manage worker pools, assign tasks, and handle resource allocation.

### Complete Schema

```json
{
  "protocol_version": "0.3",
  "agent_id": "broker-node-003",
  "name": "Worker Coordination Broker",
  "description": "Matches tasks to capable workers, manages resource allocation, and monitors execution",
  "version": "1.0.0",
  "node_type": "broker",
  "endpoint": "https://broker-003.thread.local:8443/a2a",

  "authentication": {
    "type": "bearer_token",
    "token_endpoint": "https://broker-003.thread.local:8443/auth/token"
  },

  "capabilities": {
    "skills": [
      "worker-discovery",
      "capability-matching",
      "task-assignment",
      "resource-allocation",
      "load-balancing",
      "performance-monitoring",
      "failure-recovery"
    ],
    "supported_tasks": [
      "worker-query",
      "task-dispatch",
      "resource-provisioning",
      "execution-monitoring",
      "result-collection"
    ],
    "model_info": {
      "provider": "ollama",
      "endpoint": "http://localhost:11434",
      "model": "mistral:7b",
      "context_window": 8192,
      "temperature": 0.2,
      "optimization_focus": "fast-decision-making"
    },
    "performance": {
      "avg_assignment_time_ms": 150,
      "worker_pool_size": 25,
      "max_concurrent_assignments": 50,
      "task_success_rate": 0.91,
      "avg_task_completion_time_seconds": 45
    },
    "resource_management": {
      "dynamic_scaling": true,
      "compute_sharing": true,
      "priority_queuing": true,
      "failure_retry": true,
      "max_retries": 3
    },
    "worker_selection_strategies": [
      "best-match",
      "least-loaded",
      "round-robin",
      "affinity-based",
      "performance-weighted"
    ]
  },

  "worker_pool": {
    "registered_workers": 25,
    "available_workers": 18,
    "busy_workers": 7,
    "offline_workers": 0,
    "avg_worker_load": 0.42,
    "total_worker_capacity": 100
  },

  "metadata": {
    "created_at": "2025-01-15T08:00:00Z",
    "last_updated": "2025-01-15T10:30:00Z",
    "status": "available",
    "load": 0.58,
    "max_concurrent_tasks": 50,
    "current_active_tasks": 29,
    "total_tasks_processed": 3891,
    "uptime_seconds": 86400
  },

  "communication": {
    "inbound_from": ["architect", "worker"],
    "outbound_to": ["worker", "validator", "architect"],
    "supported_patterns": ["request-response", "streaming", "async-notification"]
  },

  "security_card": {
    "signature": "MEUCIQD7...",
    "signing_algorithm": "RS256",
    "issuer": "thread-node-ca",
    "issued_at": "2025-01-15T00:00:00Z",
    "expires_at": "2026-01-15T00:00:00Z",
    "public_key": "-----BEGIN PUBLIC KEY-----\n..."
  }
}
```

### Key Capabilities

- **Worker Discovery**: Finding and registering capable workers
- **Capability Matching**: Aligning tasks with worker skills
- **Load Balancing**: Distributing work efficiently
- **Resource Provisioning**: Managing compute resource allocation
- **Performance Tracking**: Monitoring worker efficiency

## 3. Worker Node Agent Card

### Purpose
Worker nodes execute specific tasks using specialized skills and LLM models.

### Complete Schema

```json
{
  "protocol_version": "0.3",
  "agent_id": "worker-node-042",
  "name": "Code Analysis Specialist Worker",
  "description": "Specialized in code analysis, security auditing, and refactoring suggestions",
  "version": "1.0.0",
  "node_type": "worker",
  "endpoint": "https://worker-042.thread.local:8443/a2a",

  "authentication": {
    "type": "bearer_token",
    "token_endpoint": "https://worker-042.thread.local:8443/auth/token"
  },

  "capabilities": {
    "skills": [
      "code-analysis",
      "security-audit",
      "refactoring",
      "bug-detection",
      "code-review",
      "python",
      "javascript",
      "typescript",
      "go"
    ],
    "supported_tasks": [
      "static-analysis",
      "vulnerability-scanning",
      "code-quality-assessment",
      "refactoring-suggestions",
      "best-practices-review"
    ],
    "model_info": {
      "provider": "ollama",
      "endpoint": "http://localhost:11434",
      "model": "codellama:13b",
      "context_window": 16384,
      "temperature": 0.1,
      "specialization": "code-understanding",
      "code_optimized": true
    },
    "performance": {
      "avg_task_time_seconds": 35,
      "max_concurrent_tasks": 3,
      "success_rate": 0.96,
      "confidence_threshold": 0.85,
      "quality_score": 0.92
    },
    "specialization": {
      "domain": "software-engineering",
      "languages": ["python", "javascript", "typescript", "go", "rust"],
      "frameworks": ["react", "fastapi", "express", "gin"],
      "expertise_level": "advanced"
    },
    "collaboration": {
      "peer_assistance": true,
      "knowledge_sharing": true,
      "can_request_help": true,
      "can_provide_help": true,
      "compute_sharing": false
    }
  },

  "resources": {
    "cpu_cores": 4,
    "memory_gb": 16,
    "gpu": false,
    "disk_space_gb": 100,
    "network_bandwidth_mbps": 1000
  },

  "metadata": {
    "created_at": "2025-01-15T08:00:00Z",
    "last_updated": "2025-01-15T10:30:00Z",
    "status": "available",
    "load": 0.25,
    "max_concurrent_tasks": 3,
    "current_active_tasks": 1,
    "total_tasks_completed": 892,
    "avg_rating": 4.7,
    "uptime_seconds": 86400
  },

  "communication": {
    "inbound_from": ["broker", "worker"],
    "outbound_to": ["broker", "worker", "validator"],
    "supported_patterns": ["request-response", "streaming", "peer-to-peer"]
  },

  "security_card": {
    "signature": "MEUCIQD7...",
    "signing_algorithm": "RS256",
    "issuer": "thread-node-ca",
    "issued_at": "2025-01-15T00:00:00Z",
    "expires_at": "2026-01-15T00:00:00Z",
    "public_key": "-----BEGIN PUBLIC KEY-----\n..."
  }
}
```

### Key Capabilities

- **Specialized Execution**: Focused skills for specific task types
- **Peer Collaboration**: Can request/provide help from other workers
- **Quality Focus**: High confidence and quality thresholds
- **Resource Awareness**: Knows its computational limits
- **Multi-Language Support**: Handles various programming languages

## 4. Validator Node Agent Card

### Purpose
Validator nodes independently verify task outputs and ensure quality standards.

### Complete Schema

```json
{
  "protocol_version": "0.3",
  "agent_id": "validator-node-007",
  "name": "Output Quality Validator",
  "description": "Independent verification of worker outputs against requirements and quality standards",
  "version": "1.0.0",
  "node_type": "validator",
  "endpoint": "https://validator-007.thread.local:8443/a2a",

  "authentication": {
    "type": "bearer_token",
    "token_endpoint": "https://validator-007.thread.local:8443/auth/token"
  },

  "capabilities": {
    "skills": [
      "output-verification",
      "quality-assessment",
      "requirement-matching",
      "consistency-checking",
      "format-validation",
      "completeness-analysis",
      "accuracy-scoring"
    ],
    "supported_tasks": [
      "result-validation",
      "quality-audit",
      "requirement-compliance",
      "output-scoring",
      "issue-detection"
    ],
    "model_info": {
      "provider": "ollama",
      "endpoint": "http://localhost:11434",
      "model": "llama3:70b",
      "context_window": 8192,
      "temperature": 0.1,
      "validation_optimized": true,
      "reasoning_capability": "high"
    },
    "performance": {
      "avg_validation_time_seconds": 15,
      "max_concurrent_validations": 20,
      "false_positive_rate": 0.03,
      "false_negative_rate": 0.02,
      "accuracy": 0.97
    },
    "validation_types": [
      "format-validation",
      "content-validation",
      "requirement-validation",
      "consistency-validation",
      "quality-validation"
    ],
    "criteria": {
      "accuracy_threshold": 0.85,
      "completeness_threshold": 0.90,
      "consistency_threshold": 0.95,
      "format_compliance": true,
      "requirement_adherence": true
    },
    "client_interaction": {
      "can_request_clarification": true,
      "can_flag_issues": true,
      "can_escalate": true,
      "provides_feedback": true
    }
  },

  "validation_history": {
    "total_validations": 2847,
    "approved": 2654,
    "rejected": 193,
    "approval_rate": 0.93,
    "avg_score": 0.89
  },

  "metadata": {
    "created_at": "2025-01-15T08:00:00Z",
    "last_updated": "2025-01-15T10:30:00Z",
    "status": "available",
    "load": 0.40,
    "max_concurrent_tasks": 20,
    "current_active_tasks": 8,
    "uptime_seconds": 86400
  },

  "communication": {
    "inbound_from": ["broker"],
    "outbound_to": ["broker", "client", "architect"],
    "supported_patterns": ["request-response", "streaming", "client-notification"]
  },

  "security_card": {
    "signature": "MEUCIQD7...",
    "signing_algorithm": "RS256",
    "issuer": "thread-node-ca",
    "issued_at": "2025-01-15T00:00:00Z",
    "expires_at": "2026-01-15T00:00:00Z",
    "public_key": "-----BEGIN PUBLIC KEY-----\n..."
  }
}
```

### Key Capabilities

- **Independent Verification**: Unbiased quality assessment
- **Multi-Criteria Validation**: Checks multiple aspects of output
- **Client Communication**: Can request clarification when needed
- **Issue Flagging**: Can escalate architect performance problems
- **Detailed Feedback**: Provides actionable validation reports

## Model Info Schema

Detailed LLM configuration used across all node types:

```typescript
interface ModelInfo {
  provider: "ollama" | "openai" | "anthropic" | "custom";
  endpoint: string;
  model: string;
  context_window: number;
  temperature: number;
  top_p?: number;
  top_k?: number;
  repeat_penalty?: number;
  stop_sequences?: string[];

  // Thread Node specific
  optimization_focus?: string;
  specialization?: string;
  reasoning_capability?: "low" | "medium" | "high";
  code_optimized?: boolean;
  planning_optimized?: boolean;
  validation_optimized?: boolean;
}
```

## Performance Metrics Schema

```typescript
interface PerformanceMetrics {
  avg_task_time_seconds?: number;
  avg_assignment_time_ms?: number;
  avg_validation_time_seconds?: number;
  max_concurrent_tasks: number;
  success_rate: number;
  quality_score?: number;
  confidence_threshold?: number;

  // Historical data
  total_tasks_processed?: number;
  total_tasks_completed?: number;
  failure_rate?: number;
  avg_rating?: number;
}
```

## Agent Card Discovery

### Well-Known URI
Each node publishes its Agent Card at:
```
GET https://<node-endpoint>/.well-known/agent-card
```

### Registry Query
Query the central registry:
```json
{
  "jsonrpc": "2.0",
  "method": "registry.query",
  "params": {
    "node_type": "worker",
    "skills": ["code-analysis"],
    "min_availability": 0.5
  },
  "id": "query-1"
}
```

## Agent Card Updates

Nodes should update their Agent Cards when:
- Status changes (available → busy → offline)
- Load changes significantly (>10%)
- Capabilities are added/removed
- Performance metrics shift
- Model configuration changes

### Update Notification

```json
{
  "jsonrpc": "2.0",
  "method": "agent.card_updated",
  "params": {
    "agent_id": "worker-node-042",
    "card_url": "https://worker-042.thread.local/.well-known/agent-card",
    "updated_fields": ["status", "load", "current_active_tasks"],
    "timestamp": "2025-01-15T10:35:00Z"
  }
}
```

## Validation and Schema Enforcement

All Agent Cards must:
1. Conform to A2A v0.3 specification
2. Include valid security signatures
3. Provide accurate capability information
4. Update status in real-time
5. Be accessible via HTTPS
6. Include all required fields

## Example Use Cases

### 1. Finding a Code Review Worker

```python
# Broker searches for capable worker
response = a2a_client.query({
    "node_type": "worker",
    "skills": ["code-review", "python"],
    "min_success_rate": 0.90,
    "max_load": 0.7
})

# Returns Agent Cards of matching workers
for worker_card in response['agents']:
    print(f"Found: {worker_card['name']}")
    print(f"Skills: {worker_card['capabilities']['skills']}")
    print(f"Load: {worker_card['metadata']['load']}")
```

### 2. Architect Selecting Optimal Broker

```python
# Find brokers with available worker capacity
response = a2a_client.query({
    "node_type": "broker",
    "min_worker_capacity": 10,
    "max_load": 0.8
})

# Select broker with best performance
best_broker = max(
    response['agents'],
    key=lambda b: b['capabilities']['performance']['task_success_rate']
)
```

## Next Steps

1. Implement Agent Card generator for each node type
2. Create validation schemas (JSON Schema)
3. Build discovery service
4. Implement card update mechanisms
5. Create monitoring dashboard for card registry

## References

- [A2A Protocol Integration](./A2A_INTEGRATION.md)
- [System Architecture](./ARCHITECTURE.md)
- [OLLAMA Integration](./OLLAMA_INTEGRATION.md)
