import React, { useState } from 'react';
import './TaskPanel.css';

const TaskPanel = ({ onTaskSubmit, isProcessing }) => {
  const [taskInput, setTaskInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskInput.trim() && !isProcessing) {
      onTaskSubmit(taskInput);
    }
  };

  return (
    <div className="task-panel">
      <div className="panel-header">
        <h2>Task Input</h2>
      </div>

      <div className="panel-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Enter your task or query:</label>
            <textarea
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Describe the task you want the node to execute..."
              rows="4"
              disabled={isProcessing}
            />
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={!taskInput.trim() || isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              'Execute Task'
            )}
          </button>
        </form>

        <div className="task-examples">
          <h4>Example Tasks:</h4>
          <ul>
            <li onClick={() => setTaskInput('Explain the concept of quantum computing in simple terms')}>
              Explain quantum computing
            </li>
            <li onClick={() => setTaskInput('Write a Python function to calculate fibonacci numbers')}>
              Generate Python code
            </li>
            <li onClick={() => setTaskInput('Analyze the pros and cons of renewable energy')}>
              Analyze renewable energy
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskPanel;
