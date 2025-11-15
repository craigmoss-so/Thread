# Thread Node

A multi-agent AI system with nodal, canvas-based architecture.

## Overview

Thread is an advanced AI orchestration system that allows you to:
- Configure multiple AI agent nodes on a visual canvas
- Define different agent roles (Architect, Broker, Worker, Validator)
- Connect nodes dynamically based on task requirements
- Integrate multiple AI providers (OpenAI, Ollama, LM Studio)

## Current Status

**Steps 4 & 5: Validation Loops, Reputation System, and Agent Protocol** - ✅ Complete

Advanced multi-agent network with formal agent-to-agent messaging protocol, reputation-based performance tracking, validator feedback loops, and real-time network health monitoring.

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
- [x] Step 3: Dynamic role switching and worker collaboration
- [x] Step 4: Validation nodes and feedback loops
- [x] Step 5: Reputation systems and advanced features

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

## Features (Step 3)

### Skills System
- Define node capabilities via comma-separated skills
- Intelligent skill-based task routing by brokers
- Skill matching for optimal worker selection
- Visual skill display in delegation log

### Worker Collaboration
- Workers request help from peers when stuck
- Configurable collaboration behavior per node
- Collaboration attempts tracked in delegation log
- Success attribution to both workers

### Dynamic Role Switching
- Workers become temporary architects when needed
- Triggered after exhausting retry attempts
- Re-frames problems for alternative solutions
- Role switches visible in output with special badge

### Intelligent Failure Recovery
- Configurable retry attempts (0-10)
- Progressive escalation: retry → collaborate → role switch
- Failure context passed to collaborating workers
- Detailed failure tracking in logs

### Enhanced Routing
- Keyword-based skill matching
- Priority to workers with matching skills
- Fallback to most versatile workers
- Task-to-skill correlation scoring

## Features (Steps 4 & 5)

### Formal Agent-to-Agent Messaging Protocol
- 11 structured message types for inter-node communication
- Priority levels (URGENT, HIGH, NORMAL, LOW)
- Complete message history tracking
- Request/response patterns for collaboration
- Message IDs for full audit trails

### Reputation System
- Performance tracking for every node
- Success rate and collaboration metrics
- 5-tier classification (Expert to Novice)
- Skill-specific success rates
- Network-wide health statistics
- Top performer rankings

### Performance-Based Routing
- Collaborator selection based on reputation scores
- Complementary skills matching
- Historical performance consideration
- Minimum reputation thresholds
- Help history weighting

### Validator Feedback Loops
- Structured validation with detailed feedback
- Issue identification and improvement suggestions
- Retry with validator guidance
- Multi-round validation support
- Task clarity assessment

### Client Clarification Requests
- Ambiguity detection in task descriptions
- Automated clarification question generation
- Requirements refinement workflow
- Clear specification enforcement

### Network Health Monitoring
- Real-time performance dashboard
- Network health percentage
- Task, collaboration, and role switch counters
- Top performer visualization
- Per-node reputation displays with progress bars
- Recent message history view
- Expandable analytics panel
