// Main application logic for Thread mockup

// Sample node data
const nodeData = {
    'node-1': {
        id: 'node-1',
        type: 'architect',
        label: 'Architect-1',
        delegationId: 'ARCH-001',
        primaryModel: 'gpt-4',
        secondaryModels: [],
        modelParams: {
            temperature: 0.7,
            topP: 1.0,
            n: 1,
            maxTokens: 2048,
            seed: null
        },
        systemParams: {
            resourceLimits: { cpu: 2, memory: 4096 },
            loggingLevel: 'info',
            dataTransformation: 'strip_whitespace'
        },
        skills: ['task_decomposition', 'planning', 'delegation']
    },
    'node-2': {
        id: 'node-2',
        type: 'broker',
        label: 'Broker-1',
        delegationId: 'BRK-001',
        primaryModel: 'claude-3-5-sonnet',
        secondaryModels: [],
        modelParams: {
            temperature: 0.5,
            topP: 0.9,
            n: 1,
            maxTokens: 4096,
            seed: null
        },
        systemParams: {
            resourceLimits: { cpu: 4, memory: 8192 },
            loggingLevel: 'debug',
            dataTransformation: 'json_parse'
        },
        skills: ['task_routing', 'resource_allocation', 'coordination']
    },
    'node-3': {
        id: 'node-3',
        type: 'worker',
        label: 'Worker-1',
        delegationId: 'WRK-001',
        primaryModel: 'llama-3-70b',
        secondaryModels: ['gpt-3.5-turbo'],
        modelParams: {
            temperature: 0.8,
            topP: 0.95,
            n: 1,
            maxTokens: 1024,
            seed: 42
        },
        systemParams: {
            resourceLimits: { cpu: 2, memory: 2048 },
            loggingLevel: 'info',
            dataTransformation: 'none'
        },
        skills: ['code_generation', 'text_analysis', 'data_processing']
    },
    'node-4': {
        id: 'node-4',
        type: 'worker',
        label: 'Worker-2',
        delegationId: 'WRK-002',
        primaryModel: 'gpt-3.5-turbo',
        secondaryModels: [],
        modelParams: {
            temperature: 0.7,
            topP: 1.0,
            n: 1,
            maxTokens: 1024,
            seed: null
        },
        systemParams: {
            resourceLimits: { cpu: 1, memory: 2048 },
            loggingLevel: 'warn',
            dataTransformation: 'strip_whitespace'
        },
        skills: ['text_generation', 'summarization']
    },
    'node-5': {
        id: 'node-5',
        type: 'validator',
        label: 'Validator-1',
        delegationId: 'VAL-001',
        primaryModel: 'claude-3-5-sonnet',
        secondaryModels: [],
        modelParams: {
            temperature: 0.3,
            topP: 0.9,
            n: 1,
            maxTokens: 2048,
            seed: null
        },
        systemParams: {
            resourceLimits: { cpu: 2, memory: 4096 },
            loggingLevel: 'info',
            dataTransformation: 'json_parse'
        },
        skills: ['validation', 'quality_assurance', 'error_detection']
    }
};

// Model providers and their models
const modelProviders = {
    openai: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-3.5-turbo-16k'],
    anthropic: ['claude-3-5-sonnet', 'claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    ollama: ['llama-3-70b', 'llama-3-8b', 'mistral-7b', 'codellama-34b'],
    lmstudio: ['local-model-1', 'local-model-2']
};

// Selected node
let selectedNodeId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeNodes();
    initializeThemeToggle();
    initializeToolbar();
});

// Initialize node click handlers
function initializeNodes() {
    const nodes = document.querySelectorAll('.canvas-node');
    nodes.forEach(node => {
        node.addEventListener('click', (e) => {
            e.stopPropagation();
            selectNode(node.dataset.nodeId);
        });
    });

    // Deselect when clicking canvas
    document.getElementById('mainCanvas').addEventListener('click', () => {
        deselectAllNodes();
    });
}

// Select node
function selectNode(nodeId) {
    selectedNodeId = nodeId;

    // Update visual selection
    document.querySelectorAll('.canvas-node').forEach(node => {
        node.classList.remove('selected');
    });
    document.querySelector(`[data-node-id="${nodeId}"]`).classList.add('selected');

    // Show configuration panel
    showConfigPanel(nodeId);
}

// Deselect all nodes
function deselectAllNodes() {
    selectedNodeId = null;
    document.querySelectorAll('.canvas-node').forEach(node => {
        node.classList.remove('selected');
    });
    hideConfigPanel();
}

// Show configuration panel
function showConfigPanel(nodeId) {
    const node = nodeData[nodeId];
    if (!node) return;

    const configPanel = document.getElementById('configPanel');

    configPanel.innerHTML = `
        <div class="config-header">
            <h4>${node.label}</h4>
            <span class="config-node-type ${node.type}">${capitalizeFirst(node.type)}</span>
        </div>

        <div class="config-section">
            <label class="config-label">Delegation ID</label>
            <input type="text" class="config-input" value="${node.delegationId}" />
        </div>

        <div class="config-section">
            <label class="config-label">Node Type</label>
            <select class="config-select">
                <option value="architect" ${node.type === 'architect' ? 'selected' : ''}>Architect</option>
                <option value="broker" ${node.type === 'broker' ? 'selected' : ''}>Broker</option>
                <option value="worker" ${node.type === 'worker' ? 'selected' : ''}>Worker</option>
                <option value="validator" ${node.type === 'validator' ? 'selected' : ''}>Validator</option>
            </select>
        </div>

        <div class="config-section">
            <h5 class="config-subsection-title">Model Configuration</h5>

            <label class="config-label">Primary Model</label>
            <select class="config-select">
                <optgroup label="OpenAI">
                    ${modelProviders.openai.map(m => `<option value="${m}" ${node.primaryModel === m ? 'selected' : ''}>${m}</option>`).join('')}
                </optgroup>
                <optgroup label="Anthropic">
                    ${modelProviders.anthropic.map(m => `<option value="${m}" ${node.primaryModel === m ? 'selected' : ''}>${m}</option>`).join('')}
                </optgroup>
                <optgroup label="Ollama">
                    ${modelProviders.ollama.map(m => `<option value="${m}" ${node.primaryModel === m ? 'selected' : ''}>${m}</option>`).join('')}
                </optgroup>
                <optgroup label="LM Studio">
                    ${modelProviders.lmstudio.map(m => `<option value="${m}" ${node.primaryModel === m ? 'selected' : ''}>${m}</option>`).join('')}
                </optgroup>
            </select>

            <label class="config-label">
                Secondary Models
                <button class="config-btn-small" onclick="addSecondaryModel()">+ Add</button>
            </label>
            <div class="secondary-models-list">
                ${node.secondaryModels.length > 0
                    ? node.secondaryModels.map(m => `
                        <div class="secondary-model-item">
                            <span>${m}</span>
                            <button class="config-btn-small remove">×</button>
                        </div>
                    `).join('')
                    : '<p class="config-hint">No secondary models</p>'
                }
            </div>
        </div>

        <div class="config-section">
            <h5 class="config-subsection-title">Model Parameters</h5>

            <label class="config-label">
                Temperature
                <span class="config-value">${node.modelParams.temperature}</span>
            </label>
            <input type="range" class="config-slider" min="0" max="2" step="0.1" value="${node.modelParams.temperature}" />

            <label class="config-label">
                Top P
                <span class="config-value">${node.modelParams.topP}</span>
            </label>
            <input type="range" class="config-slider" min="0" max="1" step="0.05" value="${node.modelParams.topP}" />

            <label class="config-label">Max Tokens</label>
            <input type="number" class="config-input" value="${node.modelParams.maxTokens}" />

            <label class="config-label">Seed (optional)</label>
            <input type="number" class="config-input" value="${node.modelParams.seed || ''}" placeholder="Random" />
        </div>

        <div class="config-section">
            <h5 class="config-subsection-title">System Parameters</h5>

            <label class="config-label">CPU Limit (cores)</label>
            <input type="number" class="config-input" value="${node.systemParams.resourceLimits.cpu}" />

            <label class="config-label">Memory Limit (MB)</label>
            <input type="number" class="config-input" value="${node.systemParams.resourceLimits.memory}" />

            <label class="config-label">Logging Level</label>
            <select class="config-select">
                <option value="debug" ${node.systemParams.loggingLevel === 'debug' ? 'selected' : ''}>Debug</option>
                <option value="info" ${node.systemParams.loggingLevel === 'info' ? 'selected' : ''}>Info</option>
                <option value="warn" ${node.systemParams.loggingLevel === 'warn' ? 'selected' : ''}>Warning</option>
                <option value="error" ${node.systemParams.loggingLevel === 'error' ? 'selected' : ''}>Error</option>
            </select>

            <label class="config-label">Data Transformation</label>
            <select class="config-select">
                <option value="none" ${node.systemParams.dataTransformation === 'none' ? 'selected' : ''}>None</option>
                <option value="strip_whitespace" ${node.systemParams.dataTransformation === 'strip_whitespace' ? 'selected' : ''}>Strip Whitespace</option>
                <option value="json_parse" ${node.systemParams.dataTransformation === 'json_parse' ? 'selected' : ''}>JSON Parse</option>
                <option value="xml_parse" ${node.systemParams.dataTransformation === 'xml_parse' ? 'selected' : ''}>XML Parse</option>
            </select>
        </div>

        <div class="config-section">
            <h5 class="config-subsection-title">Skills & Capabilities</h5>
            <div class="skills-list">
                ${node.skills.map(skill => `
                    <span class="skill-tag">${skill.replace(/_/g, ' ')}</span>
                `).join('')}
            </div>
            <button class="config-btn-small">+ Add Skill</button>
        </div>

        <div class="config-actions">
            <button class="config-btn primary">Save Changes</button>
            <button class="config-btn secondary">Reset</button>
            <button class="config-btn danger">Delete Node</button>
        </div>
    `;

    // Add slider update handlers
    const sliders = configPanel.querySelectorAll('.config-slider');
    sliders.forEach(slider => {
        slider.addEventListener('input', (e) => {
            const valueSpan = e.target.previousElementSibling.querySelector('.config-value');
            valueSpan.textContent = e.target.value;
        });
    });
}

// Hide configuration panel
function hideConfigPanel() {
    const configPanel = document.getElementById('configPanel');
    configPanel.innerHTML = '<p class="no-selection">Select a node to configure</p>';
}

// Initialize theme toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
    });
}

// Initialize toolbar
function initializeToolbar() {
    const modes = ['selectMode', 'connectMode', 'panMode'];
    modes.forEach(mode => {
        document.getElementById(mode).addEventListener('click', (e) => {
            modes.forEach(m => document.getElementById(m).classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Zoom controls
    let zoomLevel = 100;
    document.getElementById('zoomIn').addEventListener('click', () => {
        zoomLevel = Math.min(zoomLevel + 10, 200);
        updateZoom(zoomLevel);
    });

    document.getElementById('zoomOut').addEventListener('click', () => {
        zoomLevel = Math.max(zoomLevel - 10, 50);
        updateZoom(zoomLevel);
    });

    document.getElementById('fitView').addEventListener('click', () => {
        zoomLevel = 100;
        updateZoom(zoomLevel);
    });
}

// Update zoom
function updateZoom(level) {
    document.querySelector('.zoom-level').textContent = `${level}%`;
    const canvas = document.getElementById('mainCanvas');
    canvas.style.transform = `scale(${level / 100})`;
    canvas.style.transformOrigin = 'top left';
}

// Utility function
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Add secondary model (placeholder)
function addSecondaryModel() {
    alert('Add secondary model functionality - to be implemented');
}

// Console message
console.log('Thread Mockup v1.0 - Node configuration panel loaded');
