import React, { useState } from 'react';
import './App.css';
import Canvas from './components/Canvas';
import ConfigPanel from './components/ConfigPanel';
import TaskPanel from './components/TaskPanel';
import OutputPanel from './components/OutputPanel';
import NodeToolbar from './components/NodeToolbar';
import { executeTask as apiExecuteTask, transformData } from './services/apiService';
import { delegateTask } from './services/delegationService';

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

  const [connections, setConnections] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState('node-1');
  const [taskInput, setTaskInput] = useState('');
  const [output, setOutput] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [nodeCounter, setNodeCounter] = useState(2);

  const selectedNode = nodes.find(node => node.id === selectedNodeId);

  // Node management functions
  const handleAddNode = (type) => {
    const newNode = {
      id: `node-${nodeCounter}`,
      type: type,
      position: { x: 100 + (nodeCounter * 30), y: 100 + (nodeCounter * 30) },
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
        },
        skills: [] // Skills this node can perform
      }
    };
    setNodes([...nodes, newNode]);
    setNodeCounter(nodeCounter + 1);
    setSelectedNodeId(newNode.id);
  };

  const handleNodeClick = (nodeId) => {
    setSelectedNodeId(nodeId);
  };

  const handleNodeDrag = (nodeId, newPosition) => {
    setNodes(nodes.map(node =>
      node.id === nodeId
        ? { ...node, position: newPosition }
        : node
    ));
  };

  const handleNodeDelete = (nodeId) => {
    // Remove node
    setNodes(nodes.filter(node => node.id !== nodeId));

    // Remove connections involving this node
    setConnections(connections.filter(
      conn => conn.from !== nodeId && conn.to !== nodeId
    ));

    // Update selected node if necessary
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(nodes.find(n => n.id !== nodeId)?.id || null);
    }
  };

  const handleNodeUpdate = (nodeId, updatedConfig) => {
    setNodes(nodes.map(node =>
      node.id === nodeId
        ? { ...node, config: updatedConfig }
        : node
    ));
  };

  // Connection management
  const handleConnectionCreate = (fromNodeId, toNodeId) => {
    // Check if connection already exists
    const exists = connections.some(
      conn => conn.from === fromNodeId && conn.to === toNodeId
    );

    if (!exists && fromNodeId !== toNodeId) {
      const newConnection = {
        id: `conn-${connections.length + 1}`,
        from: fromNodeId,
        to: toNodeId,
        label: ''
      };
      setConnections([...connections, newConnection]);
    }
  };

  const handleConnectionDelete = (connectionId) => {
    setConnections(connections.filter(conn => conn.id !== connectionId));
  };

  const handleTaskSubmit = async (task) => {
    setIsProcessing(true);
    setTaskInput(task);

    try {
      // Check if node has connections - if so, use delegation
      const hasConnections = connections.some(
        conn => conn.from === selectedNodeId
      );

      let result;
      if (hasConnections && selectedNode.type !== 'worker') {
        // Use delegation system for connected nodes
        const delegationResult = await delegateTask(
          selectedNode,
          task,
          nodes,
          connections
        );

        result = {
          error: !delegationResult.success,
          message: delegationResult.data || delegationResult.error,
          task: task,
          node: selectedNode.id,
          executedBy: delegationResult.executedBy,
          delegationLog: delegationResult.delegationLog,
          timestamp: new Date().toISOString()
        };
      } else {
        // Execute directly on selected node
        result = await executeTask(selectedNode, task);
      }

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
          <NodeToolbar onAddNode={handleAddNode} />
          <Canvas
            nodes={nodes}
            connections={connections}
            selectedNodeId={selectedNodeId}
            onNodeClick={handleNodeClick}
            onNodeDrag={handleNodeDrag}
            onNodeDelete={handleNodeDelete}
            onConnectionCreate={handleConnectionCreate}
            onConnectionDelete={handleConnectionDelete}
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
