# Thread Node - System Architecture

## Overview

Thread Node is a dynamic, self-organizing multi-agent AI system built on nodal architecture principles. The system enables collaborative task processing through specialized agent nodes that can dynamically reorganize themselves to solve complex problems.

## Core Principles

1. **Nodal Agent Architecture**: Distinct agent types with specific responsibilities
2. **Dynamic Task Delegation**: Hierarchical task processing with adaptive reorganization
3. **Self-Organization**: Agents can assume different roles based on task requirements
4. **Visual Canvas Interface**: Intuitive drag-and-drop node configuration and linking
5. **Protocol-Based Communication**: A2A (Agent2Agent) protocol for interoperability
6. **Local-First**: OLLAMA for local LLM inference with multi-model support

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Natural Language Interface (NLI)           │   │
│  │              React-based Canvas UI                    │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/WSS
┌────────────────────────┴────────────────────────────────────┐
│                    Frontend Services                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Canvas     │  │    Node      │  │   Visual     │      │
│  │   Manager    │  │  Configuration│  │   Builder    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │ A2A Protocol (JSON-RPC 2.0)
┌────────────────────────┴────────────────────────────────────┐
│                      Backend Services                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              A2A Protocol Gateway                     │   │
│  │        (Task Routing, Discovery, Security)            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │               Agent Node Network                      │   │
│  │                                                        │   │
│  │   ┌──────────┐                                        │   │
│  │   │Architect │                                        │   │
│  │   │  Node    │                                        │   │
│  │   └────┬─────┘                                        │   │
│  │        │ (Delegates)                                  │   │
│  │        ↓                                               │   │
│  │   ┌──────────┐     ┌──────────┐     ┌──────────┐    │   │
│  │   │ Broker   │────→│ Broker   │────→│ Broker   │    │   │
│  │   │  Node    │     │  Node    │     │  Node    │    │   │
│  │   └────┬─────┘     └────┬─────┘     └────┬─────┘    │   │
│  │        │                │                │            │   │
│  │        ↓                ↓                ↓            │   │
│  │   ┌────────┐      ┌────────┐      ┌────────┐        │   │
│  │   │Worker  │←────→│Worker  │←────→│Worker  │        │   │
│  │   │ Node   │      │ Node   │      │ Node   │        │   │
│  │   └───┬────┘      └───┬────┘      └───┬────┘        │   │
│  │       │               │               │              │   │
│  │       └───────────────┴───────────────┘              │   │
│  │                       ↓                               │   │
│  │                 ┌──────────┐                         │   │
│  │                 │Validator │                         │   │
│  │                 │  Node    │                         │   │
│  │                 └──────────┘                         │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                   Infrastructure Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   OLLAMA     │  │   Message    │  │   State      │      │
│  │   Server     │  │   Queue      │  │   Store      │      │
│  │  (Local LLM) │  │  (Redis)     │  │  (PostgreSQL)│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Node Types

### 1. Architect Node
**Role**: Strategic task decomposition and high-level orchestration

**Responsibilities**:
- Receive and analyze user requests
- Decompose complex tasks into manageable subtasks
- Select appropriate Broker nodes for delegation
- Monitor overall task progress
- Synthesize final results

**A2A Capabilities**:
- Task decomposition and planning
- Broker selection and assignment
- Progress monitoring and aggregation

### 2. Broker Node
**Role**: Resource management and task assignment

**Responsibilities**:
- Receive task assignments from Architects
- Query Worker capabilities via Agent Cards
- Match tasks to appropriate Workers
- Manage resource allocation
- Monitor Worker performance
- Report completion status to Architect

**A2A Capabilities**:
- Worker discovery and capability matching
- Task assignment and tracking
- Resource pool management
- Performance monitoring

### 3. Worker Node
**Role**: Task execution and collaboration

**Responsibilities**:
- Execute assigned tasks using configured LLM
- Request assistance from peer Workers when needed
- Report results to Broker
- Can initiate re-architecting when problems arise

**A2A Capabilities**:
- Task execution with specific skills
- Peer-to-peer collaboration
- Dynamic capability advertisement
- Result validation support

### 4. Validator Node
**Role**: Quality assurance and verification

**Responsibilities**:
- Independently verify Worker outputs
- Validate against task requirements
- Request client clarification when needed
- Flag Architect performance issues
- Ensure result quality

**A2A Capabilities**:
- Output validation and verification
- Client communication for clarification
- Quality metrics reporting
- Issue escalation

## Canvas Interface & Model Selection

### Visual Configuration

Thread Node features an intuitive canvas interface where users can:
- **Drag and drop** nodes onto the canvas
- **Select models** via dropdown on each node card
- **Configure node settings** through interactive cards
- **Monitor task execution** in real-time
- **Create connections** by dragging between nodes

### Dynamic Model Assignment

Each node card includes a **model dropdown** that:
- **Auto-detects** locally available OLLAMA models
- **Shows recommendations** based on node type (✓ marked)
- **Displays model metadata** (size, RAM requirements)
- **Allows live switching** between models
- **Updates immediately** upon selection

Example model dropdown on a Worker node:
```
Model: [codellama:13b       ▼]
       [llama3:8b            ]
       [mistral:7b           ]
       ✓ codellama:13b       ← Recommended for code tasks
       [deepseek-coder:6.7b  ]
```

See [UI_DESIGN.md](./UI_DESIGN.md) for complete interface specifications.

## Communication Protocol

### A2A Protocol Integration

Thread Node uses the **Agent2Agent (A2A) protocol** for all inter-node communication:

- **Transport**: JSON-RPC 2.0 over HTTP(S)
- **Streaming**: Server-Sent Events (SSE) for real-time updates
- **Discovery**: Agent Cards for capability advertisement
- **Security**: TLS + signed Agent Cards
- **Task Lifecycle**: A2A task objects for tracking

See [A2A_INTEGRATION.md](./A2A_INTEGRATION.md) for detailed protocol integration.

## LLM Provider

### OLLAMA Local Inference

- **Primary Provider**: OLLAMA running locally
- **Models**: Configurable per node (Llama, Mistral, CodeLlama, etc.)
- **Benefits**: Privacy, cost efficiency, no rate limits
- **Fallback**: Optional cloud provider support

See [OLLAMA_INTEGRATION.md](./OLLAMA_INTEGRATION.md) for configuration details.

## Dynamic Behavior

### Self-Organization
When Workers encounter unsolvable problems:
1. Workers report issues to Broker
2. Broker escalates to Architect
3. If Architect cannot resolve, Workers form "mini-architect" group
4. Workers collaboratively re-architect the approach
5. Original Architect transitions to reporter role
6. System continues with new organization

### Dynamic Linking
Nodes can establish connections beyond predefined hierarchy:
- Workers can request help from peer Workers
- Temporary compute resource sharing
- Collaborative problem-solving
- Auto-discovery via Agent Cards

## Technology Stack

### Frontend
- React 18+ with TypeScript
- Canvas API for node visualization
- Drag-and-drop interface
- Real-time updates via WebSocket

### Backend
- Node.js / Python (FastAPI)
- A2A SDK for protocol implementation
- Redis for message queuing
- PostgreSQL for state persistence

### Infrastructure
- OLLAMA for local LLM inference
- Docker containers for node isolation
- Optional Kubernetes for scaling

## Scalability

- Horizontal scaling of node instances
- Load balancing across Broker nodes
- Worker pool management
- Stateless node design for easy replication

## Security

- TLS encryption for all A2A communication
- Signed Agent Cards for authentication
- Role-based access control
- Audit logging for all agent interactions

## Next Steps

1. Implement core A2A protocol gateway
2. Design and implement Agent Card schemas
3. Build basic Architect/Broker/Worker nodes
4. Integrate OLLAMA inference engine
5. Develop canvas UI for node management
6. Create proof-of-concept with simple task flow

## References

- [Agent Card Specifications](./AGENT_CARDS.md)
- [A2A Protocol Integration](./A2A_INTEGRATION.md)
- [Message Flow Diagrams](./MESSAGE_FLOWS.md)
- [OLLAMA Integration](./OLLAMA_INTEGRATION.md)
- [UI Design & Canvas Interface](./UI_DESIGN.md)
- [Docker Deployment Guide](./DOCKER_DEPLOYMENT.md)
