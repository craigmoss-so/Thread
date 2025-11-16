# Step 2: Multi-Node Canvas and Task Delegation Guide

This guide explains how to use the multi-node features introduced in Step 2.

## Quick Start

1. **Install and Run**
   ```bash
   npm install
   npm start
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Add your API keys (see SETUP.md for details)

## Using the Multi-Node Canvas

### Adding Nodes

1. Use the **Node Toolbar** at the top of the left panel
2. Click on any node type to add it to the canvas:
   - **Architect** 🏗️ - Breaks down tasks and delegates
   - **Broker** 🔀 - Routes tasks to workers
   - **Worker** ⚙️ - Executes tasks
   - **Validator** ✓ - Validates results

3. New nodes appear slightly offset from each other

### Moving Nodes

1. Click and hold any node
2. Drag it to your desired position
3. Release to place

### Deleting Nodes

1. Hover over a node
2. Click the red **×** button in the top-right corner
3. Confirm deletion
4. All connections to/from the node are automatically removed

## Creating Connections

### Basic Connection Flow

1. Hover over a node
2. Click the **⚡** button in the top-left corner
3. You'll see "Connecting from [node-id]..." message
4. Click on the target node to complete the connection
5. A visual arrow appears showing the connection

### Canceling a Connection

- Click anywhere on the canvas (not on a node) to cancel

### Deleting Connections

1. Click on any connection line
2. Confirm deletion

### Connection Best Practices

- **Architect → Broker**: Architects should connect to Brokers
- **Broker → Worker**: Brokers should connect to Workers
- **Any → Validator**: Any node can connect to a Validator

## Task Delegation

### Understanding the Delegation Flow

When you execute a task on a node with outgoing connections:

```
Architect (receives task)
    ↓ (delegates)
Broker (routes task)
    ↓ (assigns)
Worker (executes task)
    ↓ (returns result)
Output Panel
```

### Example Workflow

1. **Create Network**
   ```
   - Add an Architect node
   - Add a Broker node
   - Add a Worker node
   - Connect: Architect → Broker → Worker
   ```

2. **Configure Nodes**
   - Select each node
   - Set the AI model in the Configuration panel
   - Adjust parameters as needed
   - Save configuration

3. **Execute Task**
   - Click on the Architect node to select it
   - Enter your task in the Task Input panel
   - Click "Execute Task"
   - Watch the delegation flow in the Output panel

### Delegation Log

The Output panel shows a detailed delegation log:

- 🏗️ **Architect** actions (blue border)
- 🔀 **Broker** actions (pink border)
- ⚙️ **Worker** actions (light blue border)
- ✓ **Validator** actions (green border)

Each log entry shows:
- Node ID
- Action taken
- Status message

### Direct Execution vs Delegation

**Direct Execution** (no connections):
- Node executes the task itself
- No delegation log
- Faster for simple tasks

**Delegated Execution** (with connections):
- Task routes through connected nodes
- Full delegation log visible
- Shows collaborative workflow

## Configuration Tips

### Architect Configuration

```javascript
- Higher temperature (0.8-1.0) for creative task breakdown
- Larger max_tokens for complex planning
- Provider: OpenAI GPT-4 recommended
```

### Broker Configuration

```javascript
- Moderate temperature (0.5-0.7) for routing decisions
- Standard max_tokens (2000)
- Provider: Any (task routing is lightweight)
```

### Worker Configuration

```javascript
- Task-specific temperature
  - Low (0.2-0.4) for factual/coding tasks
  - High (0.8-1.0) for creative tasks
- Provider: Based on task type
  - OpenAI for general tasks
  - Ollama for local/private tasks
  - LM Studio for custom models
```

## Advanced Usage

### Multiple Workers

Create specialized workers:

```
Architect
    ↓
Broker
    ├→ Worker-1 (Code generation)
    ├→ Worker-2 (Documentation)
    └→ Worker-3 (Testing)
```

**Note**: Currently the broker assigns to the first available worker. Future versions will support skill-based routing.

### Validation Flow

Add validation to your workflow:

```
Architect → Broker → Worker → Validator
```

1. Create the standard workflow
2. Add a Validator node
3. Connect Worker → Validator
4. Validator independently checks results

### Network Layouts

**Simple Chain**:
```
Architect → Broker → Worker
```

**Hub and Spoke**:
```
        Worker-1
          ↑
Architect → Broker → Worker-2
          ↓
        Worker-3
```

**With Validation**:
```
Architect → Broker → Worker → Validator
```

## Troubleshooting

### Connection Not Appearing

- Ensure you clicked the connection handle (⚡)
- Verify the target node is different from source
- Check for existing connection (duplicates prevented)

### Node Not Dragging

- Make sure you're not clicking the delete or connection buttons
- Click and hold on the node body
- Try refreshing if behavior persists

### Task Not Delegating

- Verify connections exist from the selected node
- Check delegation log for error messages
- Ensure all nodes are configured with valid models
- Confirm API keys are set in `.env`

### Delegation Log Empty

- Delegation only occurs when node has outgoing connections
- Worker nodes execute directly (no further delegation)
- Check that you selected a connected Architect or Broker

## keyboard Shortcuts

Currently none implemented. Coming in future versions:
- Delete selected node
- Duplicate node
- Quick connect mode
- Canvas zoom/pan

## Next Steps

After mastering Step 2:

1. **Step 3** will add:
   - Dynamic role switching (workers becoming architects)
   - Worker collaboration
   - Skill-based task assignment

2. **Step 4** will add:
   - Client feedback loops
   - Requirement clarification
   - Validation failures and retries

3. **Step 5** will add:
   - Reputation scoring
   - Performance tracking
   - Load balancing

## Tips for Best Results

1. **Start Simple**: Begin with a 3-node chain (Architect → Broker → Worker)
2. **Test Individually**: Verify each node works alone before connecting
3. **Watch the Log**: The delegation log reveals how tasks flow
4. **Iterate**: Adjust node positions and connections based on results
5. **Save Configs**: Keep track of successful node configurations

## Example Scenarios

### Code Generation Workflow

```
1. Add Architect (GPT-4, temp=0.7)
2. Add Broker (GPT-3.5, temp=0.5)
3. Add Worker (GPT-4, temp=0.3)
4. Connect: Architect → Broker → Worker
5. Task: "Create a Python REST API for user management"
```

### Creative Writing Workflow

```
1. Add Architect (GPT-4, temp=0.9)
2. Add Worker (GPT-4, temp=1.0)
3. Connect: Architect → Worker
4. Task: "Write a short story about AI collaboration"
```

### Research Workflow

```
1. Add Broker (GPT-3.5, temp=0.6)
2. Add Worker-1 (Ollama Mistral, temp=0.4)
3. Add Worker-2 (GPT-4, temp=0.3)
4. Connect: Broker → Worker-1, Broker → Worker-2
5. Task: "Research the benefits of renewable energy"
```

---

For more information:
- See SETUP.md for installation details
- See README.md for architecture overview
- Check the original conversation in `onversation` for design philosophy
