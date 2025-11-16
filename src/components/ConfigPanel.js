import React, { useState, useEffect } from 'react';
import './ConfigPanel.css';

const ConfigPanel = ({ node, onUpdate }) => {
  const [config, setConfig] = useState(node?.config || {});

  useEffect(() => {
    if (node) {
      setConfig(node.config);
    }
  }, [node]);

  if (!node) {
    return (
      <div className="config-panel">
        <div className="panel-header">
          <h2>Configuration</h2>
        </div>
        <div className="panel-content">
          <p className="no-selection">No node selected</p>
        </div>
      </div>
    );
  }

  const handleChange = (path, value) => {
    const newConfig = { ...config };
    const keys = path.split('.');
    let current = newConfig;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setConfig(newConfig);
  };

  const handleSave = () => {
    onUpdate(config);
  };

  const handleCancel = () => {
    setConfig(node.config);
  };

  return (
    <div className="config-panel">
      <div className="panel-header">
        <h2>Configuration</h2>
        <span className="node-id">{node.id}</span>
      </div>

      <div className="panel-content">
        <div className="config-section">
          <h3>Node Settings</h3>

          <div className="form-group">
            <label>Delegation ID</label>
            <input
              type="text"
              value={config.delegationId || ''}
              onChange={(e) => handleChange('delegationId', e.target.value)}
              placeholder="Enter delegation ID"
            />
            <span className="help-text">Unique identifier for task delegation</span>
          </div>
        </div>

        <div className="config-section">
          <h3>Primary Model</h3>

          <div className="form-group">
            <label>Provider</label>
            <select
              value={config.primaryModel?.provider || 'openai'}
              onChange={(e) => handleChange('primaryModel.provider', e.target.value)}
            >
              <option value="openai">OpenAI</option>
              <option value="ollama">Ollama</option>
              <option value="lmstudio">LM Studio</option>
            </select>
          </div>

          <div className="form-group">
            <label>Model</label>
            <select
              value={config.primaryModel?.model || 'gpt-4'}
              onChange={(e) => handleChange('primaryModel.model', e.target.value)}
            >
              {config.primaryModel?.provider === 'openai' && (
                <>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </>
              )}
              {config.primaryModel?.provider === 'ollama' && (
                <>
                  <option value="llama2">Llama 2</option>
                  <option value="mistral">Mistral</option>
                  <option value="codellama">Code Llama</option>
                </>
              )}
              {config.primaryModel?.provider === 'lmstudio' && (
                <>
                  <option value="local-model">Local Model</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="config-section">
          <h3>Model Parameters</h3>

          <div className="form-group">
            <label>Temperature ({config.modelParams?.temperature || 0.7})</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.modelParams?.temperature || 0.7}
              onChange={(e) => handleChange('modelParams.temperature', parseFloat(e.target.value))}
            />
            <span className="help-text">Controls randomness: 0 is focused, 2 is creative</span>
          </div>

          <div className="form-group">
            <label>Top P ({config.modelParams?.top_p || 1.0})</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.modelParams?.top_p || 1.0}
              onChange={(e) => handleChange('modelParams.top_p', parseFloat(e.target.value))}
            />
            <span className="help-text">Nucleus sampling threshold</span>
          </div>

          <div className="form-group">
            <label>Max Tokens</label>
            <input
              type="number"
              value={config.modelParams?.max_tokens || 2000}
              onChange={(e) => handleChange('modelParams.max_tokens', parseInt(e.target.value))}
              min="1"
              max="32000"
            />
            <span className="help-text">Maximum length of generated response</span>
          </div>

          <div className="form-group">
            <label>Seed (optional)</label>
            <input
              type="number"
              value={config.modelParams?.seed || ''}
              onChange={(e) => handleChange('modelParams.seed', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Leave empty for random"
            />
            <span className="help-text">For reproducible outputs</span>
          </div>
        </div>

        <div className="config-section">
          <h3>System Parameters</h3>

          <div className="form-group">
            <label>Logging Level</label>
            <select
              value={config.systemParams?.loggingLevel || 'info'}
              onChange={(e) => handleChange('systemParams.loggingLevel', e.target.value)}
            >
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
            </select>
            <span className="help-text">Verbosity of logging output</span>
          </div>

          <div className="form-group">
            <label>Max Retry Attempts</label>
            <input
              type="number"
              value={config.systemParams?.maxRetries || 3}
              onChange={(e) => handleChange('systemParams.maxRetries', parseInt(e.target.value))}
              min="0"
              max="10"
            />
            <span className="help-text">Number of retries before escalation</span>
          </div>
        </div>

        <div className="config-section">
          <h3>Skills & Capabilities</h3>
          <span className="help-text" style={{ display: 'block', marginBottom: '1rem' }}>
            Define what this node can do. Used for intelligent task routing.
          </span>

          <div className="form-group">
            <label>Skills (comma-separated)</label>
            <input
              type="text"
              value={config.skills?.join(', ') || ''}
              onChange={(e) => handleChange('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              placeholder="e.g., coding, documentation, testing, analysis"
            />
            <span className="help-text">List skills this node excels at</span>
          </div>

          <div className="form-group">
            <label>Can Collaborate</label>
            <select
              value={config.canCollaborate !== undefined ? config.canCollaborate.toString() : 'true'}
              onChange={(e) => handleChange('canCollaborate', e.target.value === 'true')}
            >
              <option value="true">Yes - Can request help from other workers</option>
              <option value="false">No - Works independently</option>
            </select>
            <span className="help-text">Allow this node to collaborate with peers</span>
          </div>

          <div className="form-group">
            <label>Can Lead</label>
            <select
              value={config.canLead !== undefined ? config.canLead.toString() : 'true'}
              onChange={(e) => handleChange('canLead', e.target.value === 'true')}
            >
              <option value="true">Yes - Can become temporary architect</option>
              <option value="false">No - Never takes lead role</option>
            </select>
            <span className="help-text">Allow dynamic role switching when needed</span>
          </div>
        </div>

        <div className="config-actions">
          <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save Configuration</button>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
