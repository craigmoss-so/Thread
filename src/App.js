import React, { useState } from 'react';
import './App.css';
import Canvas from './components/Canvas';
import ConfigPanel from './components/ConfigPanel';
import TaskPanel from './components/TaskPanel';
import OutputPanel from './components/OutputPanel';
import { executeTask as apiExecuteTask, transformData } from './services/apiService';

function App() {
  const [nodes, setNodes] = useState([
    {
      id: 'node-1',
      type: 'worker',
      position: { x: 100, y: 100 },
      config: {
        delegationId: '',
        primaryModel: { provider: 'openai', model: 'gpt-4' },
        secondaryModels: [],
        modelParams: {
          temperature: 0.7,
          top_p: 1.0,
          n: 1,
          max_tokens: 2000,
          seed: null
        },
        systemParams: {
          resourceLimits: { memory: '2GB', cpu: '2 cores' },
          loggingLevel: 'info',
          dataTransformationRules: []
        }
      }
    }
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState('node-1');
  const [taskInput, setTaskInput] = useState('');
  const [output, setOutput] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedNode = nodes.find(node => node.id === selectedNodeId);

  const handleNodeClick = (nodeId) => {
    setSelectedNodeId(nodeId);
  };

  const handleNodeUpdate = (nodeId, updatedConfig) => {
    setNodes(nodes.map(node =>
      node.id === nodeId
        ? { ...node, config: updatedConfig }
        : node
    ));
  };

  const handleTaskSubmit = async (task) => {
    setIsProcessing(true);
    setTaskInput(task);

    try {
      // Task execution will be implemented here
      const result = await executeTask(selectedNode, task);
      setOutput(result);
    } catch (error) {
      setOutput({
        error: true,
        message: error.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const executeTask = async (node, task) => {
    try {
      // Apply data transformation rules if configured
      const transformedTask = transformData(
        task,
        node.config.systemParams?.dataTransformationRules
      );

      // Execute task using the API service
      const apiResponse = await apiExecuteTask(node.config, transformedTask);

      if (!apiResponse.success) {
        throw new Error(apiResponse.error);
      }

      // Apply transformation to output if needed
      const transformedOutput = transformData(
        apiResponse.data,
        node.config.systemParams?.dataTransformationRules
      );

      return {
        error: false,
        message: transformedOutput,
        task: task,
        node: node.id,
        provider: apiResponse.provider,
        model: apiResponse.model,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Thread Node</h1>
        <p className="subtitle">Multi-Agent AI Orchestration</p>
      </header>

      <div className="main-container">
        <div className="left-panel">
          <Canvas
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onNodeClick={handleNodeClick}
          />
          <TaskPanel
            onTaskSubmit={handleTaskSubmit}
            isProcessing={isProcessing}
          />
        </div>

        <div className="right-panel">
          <ConfigPanel
            node={selectedNode}
            onUpdate={(config) => handleNodeUpdate(selectedNodeId, config)}
          />
          <OutputPanel
            output={output}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
