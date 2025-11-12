# Thread Node Architecture Documentation

## Overview

This directory contains the complete architecture documentation for **Thread Node**, a dynamic multi-agent AI system built on the A2A (Agent2Agent) protocol with OLLAMA for local LLM inference.

## Documents

### [ARCHITECTURE.md](./ARCHITECTURE.md)
**Main system architecture document**

Provides a comprehensive overview of Thread Node including:
- System architecture diagrams
- Node type definitions (Architect, Broker, Worker, Validator)
- Core principles and design philosophy
- Technology stack recommendations
- Scalability and security considerations

**Start here** to understand the overall system design.

### [A2A_INTEGRATION.md](./A2A_INTEGRATION.md)
**A2A Protocol integration specifications**

Detailed documentation on how Thread Node uses the Agent2Agent protocol:
- Protocol specifications and communication patterns
- Message types and schemas
- Task lifecycle management
- Agent discovery mechanisms
- Security implementation
- SDK usage examples

Essential for understanding inter-node communication.

### [AGENT_CARDS.md](./AGENT_CARDS.md)
**Agent Card specifications for all node types**

Complete schemas for each node type's capabilities:
- Architect Node Agent Cards
- Broker Node Agent Cards
- Worker Node Agent Cards
- Validator Node Agent Cards
- Model configuration schemas
- Performance metrics definitions

Reference this when implementing node capabilities.

### [OLLAMA_INTEGRATION.md](./OLLAMA_INTEGRATION.md)
**OLLAMA local LLM integration guide**

Comprehensive guide for integrating OLLAMA:
- Model recommendations by node type
- API client implementation (Python & Node.js)
- Configuration examples
- Performance optimization strategies
- Resource requirements
- Health monitoring

Critical for implementing the LLM inference layer.

### [MESSAGE_FLOWS.md](./MESSAGE_FLOWS.md)
**Detailed message flow diagrams**

Visual representation of all major operations:
- Standard task execution flow
- Worker-to-worker collaboration
- Re-architecting (self-organization)
- Validation with client clarification
- Dynamic resource allocation
- Streaming progress updates
- Multi-broker task distribution

Use this to understand how the system operates end-to-end.

## Quick Start

### For System Architects
1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for overall design
2. Review [A2A_INTEGRATION.md](./A2A_INTEGRATION.md) for protocol details
3. Study [MESSAGE_FLOWS.md](./MESSAGE_FLOWS.md) for operational flows

### For Backend Developers
1. Review [A2A_INTEGRATION.md](./A2A_INTEGRATION.md) for API patterns
2. Reference [AGENT_CARDS.md](./AGENT_CARDS.md) for data schemas
3. Implement using [OLLAMA_INTEGRATION.md](./OLLAMA_INTEGRATION.md)

### For DevOps Engineers
1. Check [OLLAMA_INTEGRATION.md](./OLLAMA_INTEGRATION.md) for deployment
2. Review resource requirements in [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Plan infrastructure based on scalability section

## System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Thread Node System                        │
│                                                              │
│  Frontend (React)                                            │
│  ├── Canvas Interface                                        │
│  ├── Node Configuration                                      │
│  └── Real-time Visualization                                │
│                                                              │
│  Backend (Node.js/Python)                                    │
│  ├── A2A Protocol Gateway                                    │
│  ├── Agent Registry Service                                  │
│  └── Task Orchestration Engine                              │
│                                                              │
│  Agent Network                                               │
│  ├── Architect Nodes (Llama 3 70B)                          │
│  ├── Broker Nodes (Mistral 7B)                              │
│  ├── Worker Nodes (CodeLlama, Mistral)                      │
│  └── Validator Nodes (Llama 3 70B)                          │
│                                                              │
│  Infrastructure                                              │
│  ├── OLLAMA Server (Local LLM)                              │
│  ├── Redis (Message Queue)                                  │
│  └── PostgreSQL (State Store)                               │
└─────────────────────────────────────────────────────────────┘
```

## Key Features

### Dynamic Self-Organization
- Nodes can reorganize when initial strategies fail
- Workers can become "mini-architects" when needed
- System adapts to changing requirements

### A2A Protocol Communication
- Industry-standard agent-to-agent messaging
- Support for 150+ organizations
- Interoperable with external agents

### Local LLM with OLLAMA
- Privacy-focused (all data stays local)
- No usage costs or rate limits
- Multiple models for different node types

### Visual Canvas Interface
- Drag-and-drop node configuration
- Real-time task flow visualization
- Dynamic link creation

## Architecture Principles

1. **Separation of Concerns**: Each node type has a specific role
2. **Loose Coupling**: Nodes communicate via standard A2A protocol
3. **High Cohesion**: Related functionality grouped within node types
4. **Scalability**: Horizontal scaling of all node types
5. **Resilience**: Self-healing through re-architecting
6. **Transparency**: All actions logged and auditable

## Development Roadmap

### Phase 1: Foundation (Current)
- [x] Architecture design
- [x] A2A protocol specification
- [x] Agent Card schemas
- [x] OLLAMA integration plan
- [x] Message flow documentation

### Phase 2: Core Implementation
- [ ] A2A protocol gateway
- [ ] Basic Architect node
- [ ] Basic Broker node
- [ ] Basic Worker node
- [ ] OLLAMA client library

### Phase 3: Advanced Features
- [ ] Validator nodes
- [ ] Worker-to-worker collaboration
- [ ] Dynamic re-architecting
- [ ] Resource allocation system

### Phase 4: User Interface
- [ ] React canvas interface
- [ ] Node configuration UI
- [ ] Real-time visualization
- [ ] Monitoring dashboard

### Phase 5: Production Ready
- [ ] Security hardening
- [ ] Performance optimization
- [ ] Comprehensive testing
- [ ] Documentation completion

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Agent Communication | A2A Protocol | Industry standard, interoperable |
| LLM Provider | OLLAMA | Privacy, cost, flexibility |
| Frontend | React + Canvas | Rich visualization capability |
| Backend | Node.js/Python | A2A SDK support |
| Message Queue | Redis | Fast, reliable pub/sub |
| State Store | PostgreSQL | ACID compliance, complex queries |

## Security Considerations

- **TLS Encryption**: All A2A communication uses HTTPS
- **Signed Agent Cards**: Cryptographic verification
- **Authentication**: JWT tokens for sessions
- **Authorization**: Role-based access control
- **Audit Logging**: All actions tracked
- **Data Privacy**: Local processing with OLLAMA

## Performance Targets

| Metric | Target | Node Type |
|--------|--------|-----------|
| Task Decomposition | < 2.5s | Architect |
| Worker Assignment | < 150ms | Broker |
| Task Execution | < 45s avg | Worker |
| Validation | < 15s | Validator |
| End-to-End Latency | < 60s | Full System |

## Resource Requirements

### Minimum (Development)
- CPU: 8 cores
- RAM: 32 GB
- Storage: 200 GB SSD
- OLLAMA Models: Llama3:8b, Mistral:7b

### Recommended (Production)
- CPU: 32+ cores
- RAM: 128+ GB
- Storage: 1 TB NVMe
- GPU: Optional (improves inference speed)
- OLLAMA Models: Llama3:70b, Mistral:7b, CodeLlama:13b

## Contributing

When updating architecture documentation:

1. **Maintain Consistency**: Keep terminology consistent across documents
2. **Update Related Docs**: Changes to one doc may affect others
3. **Version Diagrams**: Use clear version indicators
4. **Add Examples**: Include practical code/config examples
5. **Link Between Docs**: Cross-reference related sections

## Questions?

For questions about the architecture:
- Review the specific document for your area of interest
- Check [MESSAGE_FLOWS.md](./MESSAGE_FLOWS.md) for operational examples
- Refer to external documentation:
  - [A2A Protocol Spec](https://a2a-protocol.org/latest/specification/)
  - [OLLAMA Documentation](https://github.com/ollama/ollama)

## License

Thread Node architecture documentation is part of the Thread Node project.

---

**Last Updated**: 2025-01-15
**Version**: 1.0.0
**Status**: Design Phase
