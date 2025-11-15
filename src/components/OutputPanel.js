import React from 'react';
import './OutputPanel.css';

const OutputPanel = ({ output, isProcessing }) => {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="output-panel">
      <div className="panel-header">
        <h2>Output</h2>
        {output && !output.error && (
          <span className="status-badge success">Success</span>
        )}
        {output && output.error && (
          <span className="status-badge error">Error</span>
        )}
        {isProcessing && (
          <span className="status-badge processing">Processing...</span>
        )}
      </div>

      <div className="panel-content">
        {!output && !isProcessing && (
          <div className="empty-state">
            <p>No output yet. Execute a task to see results here.</p>
          </div>
        )}

        {isProcessing && (
          <div className="processing-state">
            <div className="spinner-large"></div>
            <p>Processing your request...</p>
          </div>
        )}

        {output && !isProcessing && (
          <div className={`output-content ${output.error ? 'error-content' : ''}`}>
            {output.error ? (
              <>
                <h3>Error</h3>
                <p className="error-message">{output.message}</p>
              </>
            ) : (
              <>
                <div className="output-message">
                  {output.message}
                </div>

                {output.timestamp && (
                  <div className="output-metadata">
                    <div className="metadata-item">
                      <span className="label">Timestamp:</span>
                      <span className="value">{formatTimestamp(output.timestamp)}</span>
                    </div>
                    {output.node && (
                      <div className="metadata-item">
                        <span className="label">Node:</span>
                        <span className="value">{output.node}</span>
                      </div>
                    )}
                    {output.task && (
                      <div className="metadata-item">
                        <span className="label">Task:</span>
                        <span className="value">{output.task}</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
