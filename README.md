# Thread Node

A multi-agent AI system with nodal, canvas-based architecture.

## Overview

Thread is an advanced AI orchestration system that allows you to:
- Configure multiple AI agent nodes on a visual canvas
- Define different agent roles (Architect, Broker, Worker, Validator)
- Connect nodes dynamically based on task requirements
- Integrate multiple AI providers (OpenAI, Ollama, LM Studio)

## Current Status

**Step 1: Single-Node Prototype** - In Development

Building the basic single-node implementation with UI, configuration panel, and task execution.

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
- [ ] Step 1: Single-node prototype with basic UI
- [ ] Step 2: Multi-node canvas with connections
- [ ] Step 3: Task delegation and execution
- [ ] Step 4: Dynamic role switching
- [ ] Step 5: Validation and reputation systems
