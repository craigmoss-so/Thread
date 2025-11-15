# Thread Node

A multi-agent AI system with nodal, canvas-based architecture.

## Overview

Thread is an advanced AI orchestration system that allows you to:
- Configure multiple AI agent nodes on a visual canvas
- Define different agent roles (Architect, Broker, Worker, Validator)
- Connect nodes dynamically based on task requirements
- Integrate multiple AI providers (OpenAI, Ollama, LM Studio)

## Current Status

**Step 2: Multi-Node Canvas with Task Delegation** - ✅ Complete

Full multi-node canvas with drag-and-drop, visual connections, and hierarchical task delegation system.

## Getting Started

```bash
npm install
npm start
```

## Architecture

### Agent Types
- **Architect**: Receives tasks and breaks them down, delegating to brokers
- **Broker**: Routes tasks to workers based on advertised skills
- **Worker**: Executes specific tasks assigned by brokers
- **Validator**: Independently verifies results

### Key Features
- Dynamic role switching when plans fail
- Skill-based messaging between nodes
- Multi-model support per node
- Reputation system for agent performance tracking
- Client feedback loops for clarification

## Development Roadmap

- [x] Design and conceptual planning
- [x] Step 1: Single-node prototype with basic UI
- [x] Step 2: Multi-node canvas with connections and task delegation
- [ ] Step 3: Dynamic role switching and worker collaboration
- [ ] Step 4: Validation nodes and feedback loops
- [ ] Step 5: Reputation systems and advanced features

## Features (Step 2)

### Multi-Node Management
- Add nodes of different types (Architect, Broker, Worker, Validator)
- Drag-and-drop positioning on canvas
- Delete nodes with automatic connection cleanup
- Visual indicators for node types with color coding

### Connection System
- Click-to-connect interface between nodes
- Visual connection lines with arrows
- Delete connections by clicking
- Real-time connection status display

### Task Delegation
- **Architect → Broker → Worker** flow
- Automatic routing based on node connections
- Delegation log showing task flow through network
- Support for both delegated and direct execution

### Workflow Visualization
- Live delegation log in output panel
- Node-specific status indicators
- Connection count display
- Real-time task routing visibility
