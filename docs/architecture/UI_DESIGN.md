# Canvas UI & User Experience Design

## Overview

The Thread Node Canvas UI provides an intuitive, visual interface for creating, configuring, and managing agent nodes. Users can drag-and-drop nodes onto a canvas, configure them through interactive cards, and watch task execution in real-time.

## Canvas Interface

### Main Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Thread Node                                    [⚙️] [👤] [?]   │
├─────────────────────────────────────────────────────────────────┤
│  [+ Architect] [+ Broker] [+ Worker] [+ Validator]  [▶️ Run]    │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                       │
│  Node    │              Canvas Area                             │
│  Library │                                                       │
│          │         [Drag nodes here]                            │
│  📦 Models│                                                       │
│  • llama3│         Nodes appear as cards                        │
│  • mistral│        with configuration                           │
│  • codellama│                                                    │
│          │                                                       │
│  📊 Tasks │                                                       │
│  Active: 3│                                                       │
│  Queue: 5 │                                                       │
│          │                                                       │
└──────────┴───────────────────────────────────────────────────────┘
```

## Node Card Design

### Architect Node Card

```
┌─────────────────────────────────────────┐
│  🏛️  Architect Node                     │
│  ───────────────────────────────────    │
│                                         │
│  Name: Strategic Planner               │
│  └─ [Edit inline]                      │
│                                         │
│  Model: [llama3:70b          ▼]       │
│  └─ Dropdown with local models         │
│                                         │
│  Status: ● Available                   │
│  Load: ▓▓▓░░░░░░░ 35%                 │
│                                         │
│  Skills:                               │
│  • Task Decomposition                  │
│  • Strategic Planning                  │
│  • Broker Selection                    │
│                                         │
│  [⚙️ Advanced] [🗑️ Delete] [▶️ Test]    │
└─────────────────────────────────────────┘
         ↓ (connection line)
```

### Worker Node Card

```
┌─────────────────────────────────────────┐
│  👷 Worker Node                         │
│  ───────────────────────────────────    │
│                                         │
│  Name: Code Analyzer #1                │
│  └─ [Edit inline]                      │
│                                         │
│  Model: [codellama:13b       ▼]       │
│  └─ [llama3:8b               ]         │
│     [mistral:7b              ]         │
│     [codellama:13b         ✓]         │
│     [deepseek-coder:6.7b     ]         │
│                                         │
│  Specialization: [Code Analysis ▼]     │
│                                         │
│  Skills: [+ Add Skill]                 │
│  ✓ code-analysis                       │
│  ✓ security-audit                      │
│  ✓ python                              │
│  ✓ javascript                          │
│                                         │
│  Temperature: [0.1     ] 🎚️            │
│  Context: [16384       ] tokens        │
│                                         │
│  Status: ● Working (Task #42)          │
│  Progress: ▓▓▓▓▓▓▓░░░ 75%             │
│                                         │
│  [⚙️ Advanced] [🗑️ Delete] [⏸️ Pause]   │
└─────────────────────────────────────────┘
```

### Broker Node Card

```
┌─────────────────────────────────────────┐
│  🎯 Broker Node                         │
│  ───────────────────────────────────    │
│                                         │
│  Name: Resource Manager                │
│                                         │
│  Model: [mistral:7b          ▼]       │
│                                         │
│  Worker Pool: 12/25 available          │
│  Queue: 8 tasks pending                │
│                                         │
│  Assignment Strategy:                  │
│  ○ Best Match                          │
│  ● Load Balanced                       │
│  ○ Round Robin                         │
│  ○ Performance Weighted                │
│                                         │
│  Status: ● Active                      │
│  Throughput: 45 tasks/hour             │
│                                         │
│  [⚙️ Advanced] [🗑️ Delete] [📊 Stats]   │
└─────────────────────────────────────────┘
```

### Validator Node Card

```
┌─────────────────────────────────────────┐
│  ✓ Validator Node                      │
│  ───────────────────────────────────    │
│                                         │
│  Name: Quality Assurance               │
│                                         │
│  Model: [llama3:70b          ▼]       │
│                                         │
│  Validation Criteria:                  │
│  Accuracy:     [0.85] threshold        │
│  Completeness: [0.90] threshold        │
│  Consistency:  [0.95] threshold        │
│                                         │
│  Recent Results:                       │
│  ✓ Approved: 127                       │
│  ✗ Rejected: 8                         │
│  ⚠ Flagged: 3                          │
│                                         │
│  [⚙️ Advanced] [🗑️ Delete] [📋 Report]  │
└─────────────────────────────────────────┘
```

## Model Selection Dropdown

### Dropdown Features

The model dropdown on each card:

1. **Auto-detects local OLLAMA models**
   - Queries `http://localhost:11434/api/tags`
   - Shows only available models
   - Updates when new models are pulled

2. **Shows model metadata**
   ```
   ┌───────────────────────────────────┐
   │ Select Model                      │
   ├───────────────────────────────────┤
   │ 🦙 llama3:70b                     │
   │    Size: 40GB • RAM: 48GB         │
   │    ✓ Recommended for Architects   │
   ├───────────────────────────────────┤
   │ 🦙 llama3:8b                      │
   │    Size: 4.7GB • RAM: 8GB         │
   │    Fast, general purpose          │
   ├───────────────────────────────────┤
   │ 🌟 mistral:7b                     │
   │    Size: 4.1GB • RAM: 8GB         │
   │    ✓ Recommended for Brokers      │
   ├───────────────────────────────────┤
   │ 💻 codellama:13b                  │
   │    Size: 7.4GB • RAM: 16GB        │
   │    ✓ Recommended for Code Workers │
   ├───────────────────────────────────┤
   │ 🔍 deepseek-coder:6.7b           │
   │    Size: 3.8GB • RAM: 8GB         │
   │    Code generation specialist     │
   └───────────────────────────────────┘
   ```

3. **Recommendations based on node type**
   - Shows checkmark (✓) for recommended models
   - Architect: Prefers llama3:70b, mixtral:8x7b
   - Broker: Prefers mistral:7b, llama3:8b
   - Worker: Suggests based on specialization
   - Validator: Prefers llama3:70b

4. **Live status indicators**
   - Green dot: Model loaded and ready
   - Yellow dot: Model needs to be loaded
   - Red dot: Model download required

### Model Detection API

```javascript
// Fetch available OLLAMA models
async function fetchAvailableModels() {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    const data = await response.json();

    return data.models.map(model => ({
      name: model.name,
      size: model.size,
      modified: model.modified_at,
      digest: model.digest,
      details: model.details
    }));
  } catch (error) {
    console.error('OLLAMA not available:', error);
    return [];
  }
}

// Update dropdown with available models
function updateModelDropdown(nodeCard, nodeType) {
  const models = await fetchAvailableModels();
  const recommendations = getRecommendedModels(nodeType);

  const dropdown = nodeCard.querySelector('.model-select');
  dropdown.innerHTML = models.map(model => {
    const isRecommended = recommendations.includes(model.name);
    return `
      <option value="${model.name}" ${isRecommended ? 'data-recommended' : ''}>
        ${isRecommended ? '✓ ' : ''}${model.name}
        ${model.details ? `(${formatSize(model.size)})` : ''}
      </option>
    `;
  }).join('');
}
```

## Card Configuration Panel

When user clicks **[⚙️ Advanced]** on a card:

```
┌─────────────────────────────────────────────────────┐
│  Advanced Configuration: Worker Node #1             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Model Configuration                               │
│  ─────────────────────────────────────────────     │
│  Model: [codellama:13b          ▼]                │
│                                                     │
│  OLLAMA Instance Assignment                        │
│  ─────────────────────────────────────────────     │
│  Strategy:                                         │
│  ● Auto-Select (Recommended)                       │
│  ○ Specific Instances                              │
│  ○ Load Balanced                                   │
│                                                     │
│  Preferred Instances: (priority order)             │
│  1. [Local Machine (GPU)     ▼] [Remove]          │
│  2. [Network Server 1        ▼] [Remove]          │
│  3. [Cloud Backup            ▼] [Remove]          │
│  [+ Add Fallback Instance]                         │
│                                                     │
│  Instance Requirements:                            │
│  ☐ Require GPU                                     │
│  ☐ Prefer Low Latency (< 50ms)                    │
│  Max Latency: [100 ] ms                            │
│  Tags: [code-models          ]                     │
│                                                     │
│  Current Instance: Local Machine (GPU)             │
│  Status: ● Online • Load: 35% • 18ms               │
│                                                     │
│  Model Parameters                                  │
│  ─────────────────────────────────────────────     │
│  Temperature:     [0.1     ]  🎚️                   │
│  Top P:           [0.9     ]  🎚️                   │
│  Top K:           [40      ]  🎚️                   │
│  Context Window:  [16384   ] tokens                │
│  Repeat Penalty:  [1.0     ]  🎚️                   │
│                                                     │
│  System Prompt                                     │
│  ─────────────────────────────────────────────     │
│  ┌───────────────────────────────────────────┐    │
│  │ You are a specialized code analysis       │    │
│  │ worker. Your expertise includes static    │    │
│  │ analysis, security auditing, and          │    │
│  │ refactoring suggestions...                │    │
│  │                                           │    │
│  └───────────────────────────────────────────┘    │
│                                                     │
│  Skills & Capabilities                             │
│  ─────────────────────────────────────────────     │
│  [+ Add Skill]                                     │
│  • code-analysis        [Edit] [Remove]            │
│  • security-audit       [Edit] [Remove]            │
│  • python               [Edit] [Remove]            │
│  • javascript           [Edit] [Remove]            │
│                                                     │
│  Performance Tuning                                │
│  ─────────────────────────────────────────────     │
│  Max Concurrent Tasks:  [3      ]                  │
│  Task Timeout:          [300    ] seconds          │
│  Confidence Threshold:  [0.85   ]                  │
│                                                     │
│  [Test Configuration] [Reset] [Save] [Cancel]      │
└─────────────────────────────────────────────────────┘
```

## Node Creation Flow

### Step 1: Add Node Button

User clicks **[+ Worker]** button in toolbar:

```
Click [+ Worker]
    ↓
┌─────────────────────────────┐
│ Create Worker Node          │
├─────────────────────────────┤
│                             │
│ Name: [New Worker     ]     │
│                             │
│ Model: [Select...     ▼]   │
│                             │
│ Template:                   │
│ ○ Code Analysis             │
│ ○ Data Processing           │
│ ○ General Purpose           │
│ ● Custom                    │
│                             │
│ [Create] [Cancel]           │
└─────────────────────────────┘
```

### Step 2: Node Appears on Canvas

Node appears with default configuration and model dropdown ready:

```
New node appears → User can drag to position
                 → User selects model from dropdown
                 → User configures skills
                 → Node becomes active
```

## Real-time Visual Feedback

### Task Execution Animation

When a task is running:

```
┌─────────────────────────────────────────┐
│  👷 Worker Node                         │
│  ───────────────────────────────────    │
│                                         │
│  Status: ● Working                     │
│                                         │
│  Task: Analyzing security.py           │
│  Progress: ▓▓▓▓▓▓▓▓░░ 80%             │
│                                         │
│  ⚡ Streaming output...                 │
│  ┌─────────────────────────────────┐   │
│  │ Found 3 potential issues...     │   │
│  │ - SQL injection risk at line 42│   │
│  │ - Unvalidated input at line 89 │   │
│  │ ...                             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Tokens: 2,847 / 16,384                │
│  Speed: 15.3 tok/s                     │
└─────────────────────────────────────────┘
```

### Connection Lines

Visual connection lines show task flow:

```
Architect ──────┐
                │
                ├──→ Broker 1 ──→ Worker 1
                │                  Worker 2
                │                  Worker 3
                │
                └──→ Broker 2 ──→ Worker 4
                                  Worker 5

Active connections: Solid blue
Idle connections: Dashed gray
Active task flow: Animated dots flowing along line
Error state: Red connection line
```

## OLLAMA Instance & Model Management Panel

Sidebar panel with tabs for managing multiple OLLAMA instances and their models:

### Instances Tab

```
┌────────────────────────────────┐
│  🖥️  OLLAMA Instances    [+]   │
├────────────────────────────────┤
│                                │
│  ● Local Machine (GPU)         │
│     http://localhost:11434     │
│     Load: 35% • 18ms latency   │
│     Models: 5 • Priority: 100  │
│     [Edit] [Test] [⚙️]         │
│                                │
│  ● Network Server 1            │
│     http://192.168.1.10:11434  │
│     Load: 60% • 25ms latency   │
│     Models: 8 • Priority: 80   │
│     🏷️ code-models, high-cpu   │
│     [Edit] [Test] [⚙️]         │
│                                │
│  ● Network Server 2 (GPU)      │
│     http://192.168.1.11:11434  │
│     Load: 22% • 20ms latency   │
│     Models: 4 • Priority: 85   │
│     🏷️ gpu, fast                │
│     [Edit] [Test] [⚙️]         │
│                                │
│  ○ Cloud Backup (Offline)      │
│     https://ollama.cloud:443   │
│     Last seen: 5m ago          │
│     Priority: 50               │
│     [Edit] [Test] [⚙️]         │
│                                │
│  [+ Add Instance]              │
│  [Discover Network Instances]  │
│                                │
└────────────────────────────────┘
```

### Add Instance Dialog

When user clicks **[+ Add Instance]**:

```
┌─────────────────────────────────────────┐
│  Add OLLAMA Instance                    │
├─────────────────────────────────────────┤
│                                         │
│  Name:                                  │
│  [Local GPU Server              ]      │
│                                         │
│  Endpoint URL:                          │
│  [http://192.168.1.15:11434     ]      │
│                                         │
│  Location:                              │
│  ◉ Local        ○ Network   ○ Cloud    │
│                                         │
│  Priority: [85  ] 🎚️                   │
│  (Higher = preferred)                   │
│                                         │
│  Tags: (space-separated)                │
│  [gpu high-ram fast            ]       │
│                                         │
│  Authentication:                        │
│  ○ None                                 │
│  ○ Bearer Token                         │
│  ○ API Key                              │
│                                         │
│  Max Concurrent Requests: [10  ]       │
│                                         │
│  ☐ Auto-discover models on save        │
│                                         │
│  [Test Connection] [Save] [Cancel]     │
└─────────────────────────────────────────┘
```

### Models Tab (Per Instance)

Click on an instance to see its models:

```
┌────────────────────────────────┐
│  📦 Models: Local Machine      │
├────────────────────────────────┤
│                                │
│  Instance: Local Machine (GPU) │
│  Endpoint: localhost:11434     │
│                                │
│  Loaded Models                 │
│  ─────────────────────────     │
│                                │
│  ● llama3:70b                  │
│     40GB • VRAM: 18GB          │
│     Used by: Architect #1      │
│     [Unload] [Remove]          │
│                                │
│  ● mistral:7b                  │
│     4.1GB • VRAM: 3GB          │
│     Used by: Broker #1, #2     │
│     [Unload] [Remove]          │
│                                │
│  Available Models              │
│  ─────────────────────────     │
│                                │
│  ○ codellama:13b              │
│     7.4GB • Not loaded         │
│     [Load] [Remove]            │
│                                │
│  ○ llama3:8b                  │
│     4.7GB • Not loaded         │
│     [Load] [Remove]            │
│                                │
│  Pull New Models               │
│  ─────────────────────────     │
│  [ Search models...        ]   │
│                                │
│  • deepseek-coder:6.7b        │
│    [Pull Model]                │
│                                │
│  Memory Usage: 52GB / 128GB    │
│  ▓▓▓▓▓░░░░░░░░░░ 41%          │
│                                │
│  [← Back to Instances]         │
└────────────────────────────────┘
```

### Instance Status Monitor

Real-time status dashboard:

```
┌─────────────────────────────────────────┐
│  📊 OLLAMA Instances Overview           │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ● Local Machine (GPU)           │   │
│  │   Load: ▓▓▓░░░░░░░ 35%         │   │
│  │   Latency: 18ms • RPM: 45      │   │
│  │   Models: 5 loaded             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ● Network Server 1              │   │
│  │   Load: ▓▓▓▓▓▓░░░░ 60%         │   │
│  │   Latency: 25ms • RPM: 82      │   │
│  │   Models: 8 loaded             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ● Network Server 2 (GPU)        │   │
│  │   Load: ▓▓░░░░░░░░ 22%         │   │
│  │   Latency: 20ms • RPM: 28      │   │
│  │   Models: 4 loaded             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ○ Cloud Backup - OFFLINE        │   │
│  │   Last seen: 5m ago            │   │
│  │   ⚠ Automatic failover active   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Total Requests/min: 155               │
│  Average Latency: 21ms                 │
│  Success Rate: 99.2%                   │
│                                         │
└─────────────────────────────────────────┘
```

## Interaction Patterns

### Model Selection

1. **Click dropdown** → Shows available models
2. **Hover over model** → Shows tooltip with details
3. **Select model** → Updates node immediately
4. **Model loads** → Status indicator updates
5. **Ready** → Node can accept tasks

### Node Configuration

1. **Single click** → Select node (highlights border)
2. **Double click** → Open quick edit (name, model)
3. **Click ⚙️ Advanced** → Open full configuration panel
4. **Drag node** → Reposition on canvas
5. **Drag from port** → Create connection

### Task Monitoring

1. **Task starts** → Progress bar appears
2. **Streaming enabled** → Live output in card
3. **Task completes** → Success/failure animation
4. **Click on task** → View full details

## Responsive Design

### Desktop (1920x1080+)
- Full canvas with sidebar
- Multiple nodes visible
- Detailed cards with all info

### Tablet (768x1024)
- Collapsible sidebar
- Simplified cards
- Tap to expand details

### Mobile (< 768px)
- List view instead of canvas
- Swipe between nodes
- Essential info only

## Accessibility

- **Keyboard Navigation**: Tab through nodes, Enter to select
- **Screen Reader**: All cards have ARIA labels
- **High Contrast**: Available theme for visibility
- **Zoom**: Canvas supports pinch-zoom
- **Focus Indicators**: Clear visual focus states

## State Management

```typescript
interface NodeState {
  id: string;
  type: 'architect' | 'broker' | 'worker' | 'validator';
  name: string;
  position: { x: number; y: number };

  // Model configuration
  model: {
    selected: string;           // e.g., "codellama:13b"
    available: string[];        // Models from OLLAMA
    loading: boolean;
    loaded: boolean;
  };

  // Runtime state
  status: 'offline' | 'available' | 'busy' | 'error';
  load: number;                 // 0.0 - 1.0
  currentTask?: string;

  // Configuration
  config: {
    temperature: number;
    context_window: number;
    skills: string[];
    system_prompt: string;
  };
}
```

## Technical Implementation

### React Component Structure

```
<Canvas>
  <Toolbar>
    <AddNodeButton type="architect" />
    <AddNodeButton type="broker" />
    <AddNodeButton type="worker" />
    <AddNodeButton type="validator" />
  </Toolbar>

  <Sidebar>
    <ModelManagementPanel />
    <TaskQueuePanel />
  </Sidebar>

  <CanvasArea>
    <NodeCard
      type="worker"
      modelDropdown={<ModelDropdown />}
      onModelChange={handleModelChange}
    />
    <ConnectionLine from="node1" to="node2" />
  </CanvasArea>

  <ConfigPanel node={selectedNode} />
</Canvas>
```

### Model Dropdown Component

```typescript
interface ModelDropdownProps {
  nodeType: NodeType;
  currentModel: string;
  onModelChange: (model: string) => void;
}

function ModelDropdown({ nodeType, currentModel, onModelChange }: ModelDropdownProps) {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch available models from OLLAMA
    fetchOllamaModels().then(setModels);
  }, []);

  const recommendations = getRecommendedModels(nodeType);

  return (
    <select
      value={currentModel}
      onChange={(e) => onModelChange(e.target.value)}
      className="model-dropdown"
    >
      {models.map(model => (
        <option
          key={model.name}
          value={model.name}
          data-recommended={recommendations.includes(model.name)}
        >
          {recommendations.includes(model.name) ? '✓ ' : ''}
          {model.name}
          {` (${formatSize(model.size)})`}
        </option>
      ))}
    </select>
  );
}
```

## User Workflows

### Workflow 1: Create and Configure Worker

1. Click **[+ Worker]** button
2. Node appears on canvas with default settings
3. Click **model dropdown**
4. Select **codellama:13b** from list
5. Model loads (spinner shows progress)
6. Click **[+ Add Skill]**
7. Add "python", "security-audit", "code-review"
8. Click **[⚙️ Advanced]** to tune temperature
9. Set temperature to 0.1 for consistency
10. Node is ready and shows **● Available**

### Workflow 2: Monitor Task Execution

1. Submit task through natural language interface
2. Architect card shows "Decomposing task..."
3. Connection line animates from Architect → Broker
4. Broker card shows "Selecting worker..."
5. Connection line animates from Broker → Worker
6. Worker card shows progress bar and streaming output
7. Progress updates in real-time: 25% → 50% → 75% → 100%
8. Success animation plays
9. Results appear in validation queue

### Workflow 3: Change Model on Active Node

1. Node is currently using **llama3:8b**
2. User clicks model dropdown
3. Selects **mistral:7b** (better for this use case)
4. System checks if node has active tasks
5. Shows warning: "Node has 1 active task. Switch after completion?"
6. User confirms "Switch now" or "Queue for later"
7. Model switches, node restarts
8. Status updates to **● Available** with new model

## Next Steps for Implementation

1. Create React component library for node cards
2. Implement OLLAMA API integration for model detection
3. Build drag-and-drop canvas with connection lines
4. Add real-time state management (Redux/Zustand)
5. Implement WebSocket for live task updates
6. Add model management panel
7. Create configuration persistence layer

## Design Resources

- **Icons**: Font Awesome or Lucide React
- **Colors**: Material Design palette
- **Fonts**: Inter for UI, Fira Code for code
- **Animations**: Framer Motion for smooth transitions
- **Canvas**: React Flow or custom Canvas API implementation

---

**This UI design prioritizes user control over model selection while maintaining the sophisticated multi-agent architecture underneath.**
