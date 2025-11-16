# Thread Node

> A dynamic, self-organizing multi-agent AI system with nodal, canvas-based architecture

## Overview

**Thread Node** is a next-generation multi-agent AI platform that enables complex task processing through specialized, collaborative AI agents. Built with support for the A2A (Agent2Agent) protocol and using OLLAMA for privacy-focused local LLM inference, Thread Node provides a flexible, scalable architecture for building sophisticated AI workflows.

## Key Features

### 🔄 Dynamic Self-Organization
Agents can adapt and reorganize themselves when initial strategies fail, creating emergent solutions to complex problems. Workers can dynamically switch to architect roles to reframe problems when needed.

### 🌐 Federated Thread Networks
Decentralized peer-to-peer networking enabling multiple Thread instances to discover, connect, and collaborate. Workers can request help from workers in other Thread instances, creating a truly distributed AI collaboration network.

### 🔒 Privacy-First with OLLAMA
All LLM inference can happen locally—no data leaves your infrastructure. No usage costs, no rate limits. Also supports OpenAI and LM Studio for flexibility.

### 🎨 Visual Canvas Interface
Intuitive drag-and-drop interface for configuring nodes, creating connections, and visualizing task flows in real-time. Each node card features a **model dropdown** to select from locally available OLLAMA models with smart recommendations.

### 🤝 Collaborative Agents
Workers can request help from peers, share compute resources, and reorganize task strategies dynamically. Reputation system tracks performance across the network.

### ⚡ Specialized Node Types
- **Architect Nodes**: Strategic planning and task decomposition
- **Broker Nodes**: Resource management and task assignment
- **Worker Nodes**: Specialized task execution
- **Validator Nodes**: Quality assurance and verification

### 📊 Advanced Features
- Formal agent-to-agent messaging protocol with 11 message types
- Performance-based reputation system with 5-tier classification
- Validator feedback loops for quality improvement
- Client clarification requests for ambiguous tasks
- Network health monitoring dashboard
- Cross-Thread reputation tracking

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

## Current Status

**Step 6: Federated Thread Networks** - ✅ Foundation Complete

**Steps 4 & 5: Validation Loops, Reputation System, and Agent Protocol** - ✅ Complete

**Architecture & Design Phase** - ✅ Complete

### Implementation Progress

- [x] Design and conceptual planning
- [x] Core architecture design
- [x] A2A protocol integration plan
- [x] Agent Card specifications
- [x] OLLAMA integration architecture
- [x] Multi-instance OLLAMA support
- [x] Message flow documentation
- [x] Docker deployment configuration
- [x] Step 1: Single-node prototype with basic UI
- [x] Step 2: Multi-node canvas with connections and task delegation
- [x] Step 3: Dynamic role switching and worker collaboration
- [x] Step 4: Validation nodes and feedback loops
- [x] Step 5: Reputation systems and advanced features
- [x] Step 6: Federated Thread networks (foundation)
- [ ] Protocol gateway implementation
- [ ] Full backend integration
- [ ] Production Canvas UI
- [ ] Comprehensive integration testing

## Documentation

Comprehensive architecture documentation is available in `/docs/architecture/`:

- **[ARCHITECTURE.md](./docs/architecture/ARCHITECTURE.md)** - System overview and design
- **[A2A_INTEGRATION.md](./docs/architecture/A2A_INTEGRATION.md)** - Protocol specifications
- **[AGENT_CARDS.md](./docs/architecture/AGENT_CARDS.md)** - Node capability schemas
- **[OLLAMA_INTEGRATION.md](./docs/architecture/OLLAMA_INTEGRATION.md)** - LLM integration guide
- **[MESSAGE_FLOWS.md](./docs/architecture/MESSAGE_FLOWS.md)** - Operational flow diagrams
- **[DOCKER_DEPLOYMENT.md](./docs/architecture/DOCKER_DEPLOYMENT.md)** - Complete deployment guide
- **[UI_DESIGN.md](./docs/architecture/UI_DESIGN.md)** - UI design specifications

## Quick Start

### Prerequisites

- **OLLAMA**: Local LLM server (optional, can use OpenAI/LM Studio)
- **Node.js**: v18+ or Python 3.10+
- **Docker**: For containerized deployment (recommended)
- **Hardware**: 32GB+ RAM recommended for local LLMs

### Installation

```bash
# Install OLLAMA (optional)
curl -fsSL https://ollama.com/install.sh | sh

# Pull required models
ollama pull llama3:8b
ollama pull mistral:7b
ollama pull codellama:13b

# Clone repository
git clone https://github.com/yourusername/thread-node.git
cd thread-node

# Install dependencies
npm install

# Start Thread Node
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

## Features Overview

### Multi-Node Management (Step 2)
- Add nodes of different types (Architect, Broker, Worker, Validator)
- Drag-and-drop positioning on canvas
- Delete nodes with automatic connection cleanup
- Visual indicators for node types with color coding
- Click-to-connect interface between nodes
- Task delegation: **Architect → Broker → Worker** flow
- Live delegation log and workflow visualization

### Skills & Collaboration (Step 3)
- Define node capabilities via comma-separated skills
- Intelligent skill-based task routing by brokers
- Workers request help from peers when stuck
- Dynamic role switching (workers become temporary architects)
- Progressive failure recovery: retry → collaborate → role switch
- Configurable retry attempts (0-10)

### Validation & Reputation (Steps 4 & 5)
- Formal agent-to-agent messaging protocol with 11 message types
- Performance tracking with success rates and metrics
- 5-tier classification (Expert to Novice)
- Validator feedback loops with improvement suggestions
- Client clarification requests for ambiguous tasks
- Network health monitoring dashboard
- Performance-based routing and collaborator selection

### Federated Networks (Step 6)
- Unique Thread ID generation and identity system
- Manual peer addition via manifest sharing
- Peer capability discovery and skill-based filtering
- Remote worker delegation to peer Threads
- Cross-Thread reputation tracking
- Distributed task routing with multi-peer fallback
- Federation UI dashboard with network statistics

## Use Cases

### Code Analysis & Review
Deploy specialized Worker nodes with CodeLlama for comprehensive code analysis, security auditing, and refactoring suggestions.

### Complex Research Tasks
Architect nodes decompose research questions into subtasks, distributed across Workers with different specializations.

### Multi-Step Workflows
Chain together multiple agents for complex workflows like data processing, analysis, validation, and reporting.

### Collaborative Problem Solving
Workers can dynamically collaborate, share knowledge, and reorganize when encountering difficult problems.

### Distributed AI Networks
Connect multiple Thread instances to create a federated network where agents across different deployments can collaborate.

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React + Canvas API | Visual node interface |
| **Backend** | Node.js / Python | A2A gateway & orchestration |
| **Protocol** | A2A (Agent2Agent) | Inter-agent communication |
| **LLM** | OLLAMA / OpenAI / LM Studio | Inference engines |
| **Queue** | Redis | Message queuing |
| **Database** | PostgreSQL | State persistence |
| **Container** | Docker | Deployment |

## Roadmap

### Q1 2025: Foundation ✅
- ✅ Architecture documentation
- 🔄 A2A protocol gateway
- 🔄 Core node implementations
- ✅ OLLAMA integration (design)
- ✅ Federated networking (foundation)

### Q2 2025: Core Features
- Backend integration with frontend
- Production-ready protocol gateway
- Full validation system
- Advanced performance optimization
- Security hardening

### Q3 2025: Advanced Features
- Enhanced resource allocation
- Multi-cloud deployment support
- Advanced monitoring dashboard
- Plugin system for custom nodes

### Q4 2025: Production Ready
- Comprehensive testing suite
- Production deployment guides
- Complete API documentation
- Community tools and examples

## Contributing

Thread Node is in active development. We welcome contributions!

### Areas for Contribution
- Protocol gateway implementation
- Node type implementations
- UI/UX design and development
- Documentation improvements
- Testing and validation
- Performance optimization

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/thread-node.git

# Install dependencies
npm install

# Review architecture docs
cd docs/architecture/

# Start development server
npm start
```

## Inspiration

Thread Node was inspired by:
- The need for privacy-focused AI systems
- The A2A protocol's vision of agent interoperability
- OLLAMA's democratization of local LLM inference
- The concept of emergent behavior in multi-agent systems
- Federated and decentralized computing models

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

**Status**: Active Development | **Version**: 0.2.0-alpha | **Updated**: 2025-01-15
