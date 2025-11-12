# Thread Node

> A dynamic, self-organizing multi-agent AI system powered by A2A protocol and OLLAMA

## Overview

**Thread Node** is a next-generation multi-agent AI platform that enables complex task processing through specialized, collaborative AI agents. Built on the industry-standard A2A (Agent2Agent) protocol and using OLLAMA for privacy-focused local LLM inference, Thread Node provides a flexible, scalable architecture for building sophisticated AI workflows.

## Key Features

### 🔄 Dynamic Self-Organization
Agents can adapt and reorganize themselves when initial strategies fail, creating emergent solutions to complex problems.

### 🌐 A2A Protocol Communication
Industry-standard agent-to-agent messaging with support from 150+ organizations including Google, Salesforce, and Adobe.

### 🔒 Privacy-First with OLLAMA
All LLM inference happens locally—no data leaves your infrastructure. No usage costs, no rate limits.

### 🎨 Visual Canvas Interface
Intuitive drag-and-drop interface for configuring nodes, creating connections, and visualizing task flows in real-time. Each node card features a **model dropdown** to select from locally available OLLAMA models with smart recommendations.

### 🤝 Collaborative Agents
Workers can request help from peers, share compute resources, and reorganize task strategies dynamically.

### ⚡ Specialized Node Types
- **Architect Nodes**: Strategic planning and task decomposition
- **Broker Nodes**: Resource management and task assignment
- **Worker Nodes**: Specialized task execution
- **Validator Nodes**: Quality assurance and verification

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│              Natural Language Interface (NLI)                │
│                   React Canvas UI                            │
└────────────────────────┬────────────────────────────────────┘
                         │ A2A Protocol (JSON-RPC 2.0)
┌────────────────────────┴────────────────────────────────────┐
│                      Backend Services                        │
│              A2A Protocol Gateway                            │
│             Agent Registry & Discovery                       │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                   Agent Node Network                         │
│                                                              │
│   Architect → Broker → Worker → Validator                   │
│      ↓          ↓        ↓         ↓                        │
│   (Llama3    (Mistral  (CodeLlama (Llama3                  │
│    70B)       7B)       13B)       70B)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│               Infrastructure Layer                           │
│   OLLAMA Server │ Redis Queue │ PostgreSQL Store            │
└─────────────────────────────────────────────────────────────┘
```

## Documentation

Comprehensive architecture documentation is available in `/docs/architecture/`:

- **[ARCHITECTURE.md](./docs/architecture/ARCHITECTURE.md)** - System overview and design
- **[A2A_INTEGRATION.md](./docs/architecture/A2A_INTEGRATION.md)** - Protocol specifications
- **[AGENT_CARDS.md](./docs/architecture/AGENT_CARDS.md)** - Node capability schemas
- **[OLLAMA_INTEGRATION.md](./docs/architecture/OLLAMA_INTEGRATION.md)** - LLM integration guide
- **[MESSAGE_FLOWS.md](./docs/architecture/MESSAGE_FLOWS.md)** - Operational flow diagrams

## Quick Start

### Prerequisites

- **OLLAMA**: Local LLM server
- **Node.js**: v18+ or Python 3.10+
- **Docker**: For containerized deployment (optional)
- **Hardware**: 32GB+ RAM recommended

### Installation

```bash
# Install OLLAMA
curl -fsSL https://ollama.com/install.sh | sh

# Pull required models
ollama pull llama3:70b
ollama pull mistral:7b
ollama pull codellama:13b

# Clone repository
git clone https://github.com/yourusername/thread-node.git
cd thread-node

# Install dependencies (coming soon)
npm install

# Start Thread Node (coming soon)
npm start
```

### Docker Deployment (Recommended)

Thread Node can run as a fully containerized application with all prerequisites included:

```bash
# Clone repository
git clone https://github.com/yourusername/thread-node.git
cd thread-node

# Copy environment template
cp .env.example .env

# Edit .env and set your passwords
nano .env

# Start all services with Docker Compose
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Pull OLLAMA models (first time)
docker-compose exec ollama ollama pull llama3:8b
docker-compose exec ollama ollama pull mistral:7b
docker-compose exec ollama ollama pull codellama:13b
```

Access the application at `http://localhost:3000`

**What's included:**
- ✅ React frontend with Canvas UI
- ✅ Python/Node.js backend with A2A gateway
- ✅ OLLAMA server for local LLM inference
- ✅ PostgreSQL for state persistence
- ✅ Redis for message queuing
- ✅ Pre-configured networking and volumes

See **[DOCKER_DEPLOYMENT.md](./docs/architecture/DOCKER_DEPLOYMENT.md)** for complete deployment guide.

## Project Status

**Current Phase**: Architecture & Design ✅

- [x] Core architecture design
- [x] A2A protocol integration plan
- [x] Agent Card specifications
- [x] OLLAMA integration architecture
- [x] Multi-instance OLLAMA support
- [x] Message flow documentation
- [x] Docker deployment configuration
- [ ] Protocol gateway implementation
- [ ] Node implementations (Architect, Broker, Worker, Validator)
- [ ] Canvas UI development
- [ ] Integration testing

## Use Cases

### Code Analysis & Review
Deploy specialized Worker nodes with CodeLlama for comprehensive code analysis, security auditing, and refactoring suggestions.

### Complex Research Tasks
Architect nodes decompose research questions into subtasks, distributed across Workers with different specializations.

### Multi-Step Workflows
Chain together multiple agents for complex workflows like data processing, analysis, validation, and reporting.

### Collaborative Problem Solving
Workers can dynamically collaborate, share knowledge, and reorganize when encountering difficult problems.

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React + Canvas API | Visual node interface |
| **Backend** | Node.js / Python | A2A gateway & orchestration |
| **Protocol** | A2A (Agent2Agent) | Inter-agent communication |
| **LLM** | OLLAMA | Local inference engine |
| **Queue** | Redis | Message queuing |
| **Database** | PostgreSQL | State persistence |
| **Container** | Docker | Deployment |

## Contributing

Thread Node is in active development. We welcome contributions!

### Areas for Contribution
- Protocol gateway implementation
- Node type implementations
- UI/UX design and development
- Documentation improvements
- Testing and validation

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/thread-node.git

# Review architecture docs
cd docs/architecture/
```

## Roadmap

### Q1 2025: Foundation
- ✅ Architecture documentation
- 🔄 A2A protocol gateway
- 🔄 Core node implementations
- 🔄 OLLAMA integration

### Q2 2025: Core Features
- Worker-to-worker collaboration
- Dynamic re-architecting
- Basic Canvas UI
- Validation system

### Q3 2025: Advanced Features
- Resource allocation system
- Performance optimization
- Security hardening
- Monitoring dashboard

### Q4 2025: Production Ready
- Comprehensive testing
- Production deployment guides
- API documentation
- Community tools

## Inspiration

Thread Node was inspired by:
- The need for privacy-focused AI systems
- The A2A protocol's vision of agent interoperability
- OLLAMA's democratization of local LLM inference
- The concept of emergent behavior in multi-agent systems

## License

[License TBD]

## Community

- **Documentation**: [docs/architecture/](./docs/architecture/)
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

## Acknowledgments

- **Google & A2A Contributors**: For the A2A protocol specification
- **OLLAMA Team**: For making local LLM inference accessible
- **Open Source Community**: For the incredible tools and libraries

---

**Built with** ❤️ **for the AI agent ecosystem**

**Status**: Design Phase | **Version**: 0.1.0-alpha | **Updated**: 2025-01-15
