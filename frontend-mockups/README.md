# Thread - Frontend Mockups

Interactive HTML mockups for the Thread Nodal Agent System.

## Overview

These mockups demonstrate the visual design and user interface for the Thread application, a nodal agent system that enables dynamic task delegation between different types of AI agents.

## Features Showcased

### 1. Main Canvas Interface
- **Grid-based canvas** for placing and arranging nodes
- **Visual node representations** with distinct styling for each node type
- **Connection visualization** showing relationships between nodes
- **Zoom and pan controls** for canvas navigation
- **Multiple interaction modes**: Select, Connect, and Pan

### 2. Node Types

Each node type has unique visual styling and capabilities:

- **Architect (🎯)** - Red theme
  - Responsible for high-level task decomposition and planning
  - Delegates tasks to appropriate brokers

- **Broker (🔀)** - Blue theme
  - Routes and coordinates task distribution
  - Manages resource allocation between workers
  - Transparent and auditable message routing

- **Worker (⚙️)** - Teal theme
  - Executes assigned tasks
  - Can request assistance from other workers
  - Reports results back to brokers

- **Validator (✓)** - Purple theme
  - Validates task outputs and quality
  - Can request clarification from clients
  - Flags issues with architects

### 3. Node Configuration Panel

Comprehensive configuration interface for each node:

- **Node Identity**
  - Delegation ID
  - Node type selection

- **Model Configuration**
  - Primary model selection from multiple providers:
    - OpenAI (GPT-4, GPT-3.5-turbo, etc.)
    - Anthropic (Claude 3.5 Sonnet, Opus, etc.)
    - Ollama (Llama 3, Mistral, CodeLlama)
    - LM Studio (local models)
  - Secondary model support for enhanced capabilities

- **Model Parameters**
  - Temperature (0-2)
  - Top P (0-1)
  - Max Tokens
  - Seed (optional for reproducibility)

- **System Parameters**
  - CPU and Memory limits
  - Logging levels (Debug, Info, Warning, Error)
  - Data transformation rules

- **Skills & Capabilities**
  - Visual skill tags showing node capabilities
  - Ability to add/modify skills

### 4. Input/Output Interface

- **Input section** - Text area for submitting tasks and queries
- **Output section** - Real-time display of agent communications and results
- Shows the conversation flow between different nodes

### 5. Node Palette

Left sidebar with drag-and-drop node types for quick canvas population

### 6. Toolbar Controls

- Project management (New, Save, Load)
- Theme toggle (Light/Dark mode)
- Canvas tools (Clear, Auto-arrange, Export)
- Display options (Show connections, labels, grid snap)

## Visual Design Elements

### Color Scheme

**Dark Theme (Default)**
- Primary: #4A90E2 (Blue)
- Secondary: #50E3C2 (Teal)
- Background: #1a1a1a - #3a3a3a
- Text: #ffffff, #b0b0b0

**Light Theme**
- Inverted color scheme for comfortable daytime viewing

### Node Status Indicators

Animated status dots showing real-time node state:
- 🟢 Active - Green pulsing
- 🟡 Working - Yellow pulsing
- ⚪ Idle - Gray static
- 🔴 Error - Red rapid pulsing

### Typography

- System fonts: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- Font sizes: 0.75rem - 1.5rem
- Consistent spacing and hierarchy

## File Structure

```
frontend-mockups/
├── index.html          # Main mockup page
├── css/
│   └── main.css       # All styling and themes
├── js/
│   └── main.js        # Interactive functionality
└── assets/            # (Reserved for images/icons)
```

## How to Use

1. **Open the mockup**
   ```bash
   # Navigate to the frontend-mockups directory
   cd frontend-mockups

   # Open index.html in your browser
   # On Linux:
   xdg-open index.html
   # On macOS:
   open index.html
   # On Windows:
   start index.html
   ```

2. **Interact with nodes**
   - Click any node on the canvas to select it
   - View and edit configuration in the right sidebar
   - Use sliders to adjust model parameters

3. **Test different modes**
   - Toggle between Select, Connect, and Pan modes
   - Try the zoom controls
   - Switch between light and dark themes

4. **Review the UI flow**
   - Submit input in the bottom panel
   - Observe the output messages
   - See how different nodes communicate

## Key Interactions (Currently Mocked)

These interactions are demonstrated visually but not fully functional:

- ✓ Node selection and configuration display
- ✓ Theme switching
- ✓ Parameter sliders with live value updates
- ✓ Zoom controls with visual feedback
- ✓ Mode switching (Select/Connect/Pan)
- ⚠ Drag-and-drop node creation (planned)
- ⚠ Connection drawing between nodes (planned)
- ⚠ Actual model API calls (planned)
- ⚠ Real-time task execution (planned)

## Design Principles

1. **Clarity** - Clear visual hierarchy and labeling
2. **Flexibility** - Configurable nodes and dynamic connections
3. **Responsiveness** - Adapts to different screen sizes
4. **Accessibility** - High contrast, readable fonts, clear states
5. **Performance** - Lightweight animations and efficient rendering

## Next Steps for Implementation

1. **Backend Integration**
   - Connect to actual model APIs (OpenAI, Anthropic, Ollama)
   - Implement WebSocket for real-time communication
   - Add state management (Redux/Zustand)

2. **Enhanced Interactions**
   - Drag-and-drop node creation from palette
   - Connection drawing with SVG paths
   - Node dragging and repositioning
   - Multi-select and bulk operations

3. **Data Persistence**
   - Save/load canvas configurations
   - Export/import JSON schemas
   - Version control for configurations

4. **Advanced Features**
   - Task history and logging
   - Performance metrics dashboard
   - Node clustering and grouping
   - Real-time collaboration

## Technology Stack (Mockup)

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with CSS variables
- **Vanilla JavaScript** - No framework dependencies (yet)
- **SVG** - Vector connections between nodes

## Browser Compatibility

Tested on:
- Chrome/Edge (Recommended)
- Firefox
- Safari

Requires modern browser with ES6+ support.

## Notes

- This is a **visual mockup** demonstrating UI/UX concepts
- Core business logic is not implemented
- Sample data is hardcoded for demonstration
- Ideal for stakeholder review and design iteration

## Feedback & Iteration

This mockup serves as a foundation for:
- User experience testing
- Stakeholder approval
- Developer implementation reference
- Design system documentation

---

**Version**: 1.0
**Last Updated**: 2025-11-12
**Status**: Initial mockup complete
