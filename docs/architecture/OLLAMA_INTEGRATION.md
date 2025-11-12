# OLLAMA Integration

## Overview

Thread Node uses **OLLAMA** as its primary LLM provider for local, privacy-focused inference. OLLAMA enables running large language models locally without sending data to external APIs, providing cost efficiency, data privacy, and no rate limits.

## Why OLLAMA?

✅ **Privacy**: All inference happens locally - no data leaves your infrastructure
✅ **Cost Efficiency**: No per-token pricing, unlimited usage
✅ **Performance**: Low latency with local inference
✅ **Flexibility**: Easy model switching and fine-tuning
✅ **Multi-Model**: Support for multiple models simultaneously
✅ **Open Source**: Full control over deployment

## OLLAMA Architecture in Thread Node

```
┌─────────────────────────────────────────────────────────────┐
│                     Thread Node Network                      │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Architect │  │ Broker   │  │ Worker   │  │Validator │   │
│  │  Node    │  │  Node    │  │  Node    │  │  Node    │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │             │           │
│       └─────────────┴─────────────┴─────────────┘           │
│                     │                                        │
│              HTTP REST API                                   │
└─────────────────────┴────────────────────────────────────────┘
                      │
┌─────────────────────┴────────────────────────────────────────┐
│               OLLAMA Server (localhost:11434)                │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Llama 3   │  │   Mistral   │  │ CodeLlama   │         │
│  │     70B     │  │     7B      │  │    13B      │         │
│  │ (Architect) │  │  (Broker)   │  │  (Worker)   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  Model Library: ~/.ollama/models/                           │
└──────────────────────────────────────────────────────────────┘
```

## Recommended Models by Node Type

### Architect Nodes
**Recommended**: `llama3:70b` or `llama3.1:70b`

**Rationale**:
- High reasoning capability for complex task decomposition
- Large context window for understanding full requirements
- Strong planning and strategic thinking
- Good at breaking down abstract concepts

**Configuration**:
```json
{
  "model": "llama3:70b",
  "temperature": 0.3,
  "top_p": 0.9,
  "context_window": 8192,
  "optimization": "reasoning"
}
```

**Alternative Models**:
- `llama3:70b-instruct` - Better instruction following
- `mixtral:8x7b` - Good balance of speed and capability

### Broker Nodes
**Recommended**: `mistral:7b` or `llama3:8b`

**Rationale**:
- Fast decision-making for worker selection
- Efficient resource allocation logic
- Good at pattern matching and categorization
- Lower resource requirements

**Configuration**:
```json
{
  "model": "mistral:7b",
  "temperature": 0.2,
  "top_p": 0.85,
  "context_window": 8192,
  "optimization": "speed"
}
```

**Alternative Models**:
- `llama3:8b` - Faster, good for high-throughput
- `phi3:medium` - Very efficient for simple routing

### Worker Nodes
**Recommended**: Depends on specialization

#### Code Analysis Workers
```json
{
  "model": "codellama:13b",
  "temperature": 0.1,
  "top_p": 0.9,
  "context_window": 16384
}
```

#### General Purpose Workers
```json
{
  "model": "llama3:8b",
  "temperature": 0.4,
  "top_p": 0.9,
  "context_window": 8192
}
```

#### Specialized Domain Workers
```json
{
  "model": "mistral:7b",
  "temperature": 0.3,
  "top_p": 0.9,
  "context_window": 8192
}
```

**Alternative Models**:
- `deepseek-coder:6.7b` - Excellent for code tasks
- `starcoder2:7b` - Good for code generation
- `solar:10.7b` - Strong general capability

### Validator Nodes
**Recommended**: `llama3:70b` or `mixtral:8x7b`

**Rationale**:
- High accuracy for quality assessment
- Strong reasoning for validation logic
- Good at detecting inconsistencies
- Critical thinking capability

**Configuration**:
```json
{
  "model": "llama3:70b",
  "temperature": 0.1,
  "top_p": 0.85,
  "context_window": 8192,
  "optimization": "accuracy"
}
```

**Alternative Models**:
- `llama3.1:70b` - Enhanced validation capability
- `mixtral:8x7b` - Good balance of speed and accuracy

## OLLAMA API Integration

### Installation

```bash
# Linux
curl -fsSL https://ollama.com/install.sh | sh

# macOS
brew install ollama

# Windows
# Download from https://ollama.com/download
```

### Starting OLLAMA Server

```bash
# Start server (runs on http://localhost:11434)
ollama serve

# Pull models
ollama pull llama3:70b
ollama pull llama3:8b
ollama pull mistral:7b
ollama pull codellama:13b
```

### API Client Implementation

#### Python Example

```python
import requests
import json
from typing import Dict, Any, Optional

class OllamaClient:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url

    def generate(
        self,
        model: str,
        prompt: str,
        system: Optional[str] = None,
        temperature: float = 0.3,
        context_window: int = 8192,
        stream: bool = False
    ) -> Dict[str, Any]:
        """Generate completion from OLLAMA model"""

        payload = {
            "model": model,
            "prompt": prompt,
            "system": system,
            "options": {
                "temperature": temperature,
                "num_ctx": context_window,
            },
            "stream": stream
        }

        response = requests.post(
            f"{self.base_url}/api/generate",
            json=payload,
            stream=stream
        )

        if stream:
            return self._handle_stream(response)
        else:
            return response.json()

    def chat(
        self,
        model: str,
        messages: list[Dict[str, str]],
        temperature: float = 0.3,
        stream: bool = False
    ) -> Dict[str, Any]:
        """Chat completion with message history"""

        payload = {
            "model": model,
            "messages": messages,
            "options": {
                "temperature": temperature,
            },
            "stream": stream
        }

        response = requests.post(
            f"{self.base_url}/api/chat",
            json=payload,
            stream=stream
        )

        if stream:
            return self._handle_stream(response)
        else:
            return response.json()

    def _handle_stream(self, response):
        """Handle streaming responses"""
        for line in response.iter_lines():
            if line:
                yield json.loads(line)

    def list_models(self) -> list[Dict[str, Any]]:
        """List available models"""
        response = requests.get(f"{self.base_url}/api/tags")
        return response.json()["models"]

# Usage in Worker Node
class WorkerNode:
    def __init__(self, agent_id: str, model: str = "codellama:13b"):
        self.agent_id = agent_id
        self.ollama = OllamaClient()
        self.model = model

    def execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a task using OLLAMA"""

        system_prompt = self._build_system_prompt(task)
        user_prompt = self._build_user_prompt(task)

        response = self.ollama.generate(
            model=self.model,
            prompt=user_prompt,
            system=system_prompt,
            temperature=0.1
        )

        return {
            "task_id": task["task_id"],
            "result": response["response"],
            "model_used": self.model,
            "generation_time": response.get("total_duration", 0) / 1e9,
            "tokens_used": response.get("eval_count", 0)
        }
```

#### Node.js Example

```javascript
const axios = require('axios');

class OllamaClient {
  constructor(baseUrl = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
  }

  async generate(options) {
    const {
      model,
      prompt,
      system = null,
      temperature = 0.3,
      contextWindow = 8192,
      stream = false
    } = options;

    const response = await axios.post(
      `${this.baseUrl}/api/generate`,
      {
        model,
        prompt,
        system,
        options: {
          temperature,
          num_ctx: contextWindow
        },
        stream
      },
      { responseType: stream ? 'stream' : 'json' }
    );

    return stream ? this.handleStream(response.data) : response.data;
  }

  async chat(model, messages, temperature = 0.3, stream = false) {
    const response = await axios.post(
      `${this.baseUrl}/api/chat`,
      {
        model,
        messages,
        options: { temperature },
        stream
      },
      { responseType: stream ? 'stream' : 'json' }
    );

    return stream ? this.handleStream(response.data) : response.data;
  }

  async *handleStream(stream) {
    for await (const chunk of stream) {
      const lines = chunk.toString().split('\n').filter(Boolean);
      for (const line of lines) {
        yield JSON.parse(line);
      }
    }
  }

  async listModels() {
    const response = await axios.get(`${this.baseUrl}/api/tags`);
    return response.data.models;
  }
}

module.exports = OllamaClient;
```

## Model Detection for UI Dropdown

### Detecting Available Models

The Canvas UI needs to populate model dropdowns with locally available OLLAMA models. This is done by querying the OLLAMA API's `/api/tags` endpoint.

#### API Endpoint

```
GET http://localhost:11434/api/tags
```

#### Response Format

```json
{
  "models": [
    {
      "name": "llama3:70b",
      "model": "llama3:70b",
      "modified_at": "2025-01-15T10:30:00.000Z",
      "size": 40000000000,
      "digest": "sha256:abc123...",
      "details": {
        "parent_model": "",
        "format": "gguf",
        "family": "llama",
        "families": ["llama"],
        "parameter_size": "70B",
        "quantization_level": "Q4_0"
      }
    },
    {
      "name": "codellama:13b",
      "model": "codellama:13b",
      "modified_at": "2025-01-15T09:15:00.000Z",
      "size": 7400000000,
      "digest": "sha256:def456...",
      "details": {
        "parent_model": "",
        "format": "gguf",
        "family": "llama",
        "families": ["llama"],
        "parameter_size": "13B",
        "quantization_level": "Q4_0"
      }
    }
  ]
}
```

### Frontend Implementation

#### React Hook for Model Detection

```typescript
import { useState, useEffect } from 'react';

interface OllamaModel {
  name: string;
  size: number;
  modified_at: string;
  details: {
    parameter_size: string;
    family: string;
  };
}

function useAvailableModels() {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch('http://localhost:11434/api/tags');
        if (!response.ok) {
          throw new Error('OLLAMA server not available');
        }
        const data = await response.json();
        setModels(data.models);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setModels([]);
      } finally {
        setLoading(false);
      }
    }

    fetchModels();

    // Refresh every 30 seconds in case user pulls new models
    const interval = setInterval(fetchModels, 30000);
    return () => clearInterval(interval);
  }, []);

  return { models, loading, error };
}

export default useAvailableModels;
```

#### Model Dropdown Component

```typescript
import React from 'react';
import useAvailableModels from './useAvailableModels';

interface ModelDropdownProps {
  nodeType: 'architect' | 'broker' | 'worker' | 'validator';
  selectedModel: string;
  onModelChange: (model: string) => void;
}

function ModelDropdown({ nodeType, selectedModel, onModelChange }: ModelDropdownProps) {
  const { models, loading, error } = useAvailableModels();

  // Get recommended models for this node type
  const recommendations = getRecommendedModels(nodeType);

  if (loading) {
    return (
      <select disabled>
        <option>Loading models...</option>
      </select>
    );
  }

  if (error) {
    return (
      <select disabled>
        <option>OLLAMA not available</option>
      </select>
    );
  }

  if (models.length === 0) {
    return (
      <select disabled>
        <option>No models installed</option>
      </select>
    );
  }

  return (
    <select
      value={selectedModel}
      onChange={(e) => onModelChange(e.target.value)}
      className="model-dropdown"
    >
      {models.map((model) => {
        const isRecommended = recommendations.includes(model.name);
        const sizeGB = (model.size / 1e9).toFixed(1);

        return (
          <option
            key={model.name}
            value={model.name}
            className={isRecommended ? 'recommended' : ''}
          >
            {isRecommended ? '✓ ' : ''}
            {model.name}
            {` (${sizeGB}GB)`}
          </option>
        );
      })}
    </select>
  );
}

// Helper function to get recommended models by node type
function getRecommendedModels(nodeType: string): string[] {
  const recommendations = {
    architect: ['llama3:70b', 'llama3.1:70b', 'mixtral:8x7b'],
    broker: ['mistral:7b', 'llama3:8b', 'phi3:medium'],
    worker: ['codellama:13b', 'deepseek-coder:6.7b', 'llama3:8b'],
    validator: ['llama3:70b', 'llama3.1:70b', 'mixtral:8x7b']
  };

  return recommendations[nodeType] || [];
}

export default ModelDropdown;
```

#### Backend Proxy (Optional)

If the frontend can't directly access OLLAMA (CORS issues), create a backend proxy:

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/ollama/models")
async def get_available_models():
    """Proxy request to OLLAMA to get available models"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:11434/api/tags")
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=503,
            detail="OLLAMA server not available"
        )

@app.get("/api/ollama/models/{model_name}")
async def get_model_info(model_name: str):
    """Get detailed info about a specific model"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:11434/api/show",
                json={"name": model_name}
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError:
        raise HTTPException(
            status_code=404,
            detail=f"Model {model_name} not found"
        )
```

Then frontend calls:
```typescript
fetch('http://localhost:8000/api/ollama/models')
```

### Model Recommendations by Node Type

The UI should highlight recommended models based on node type:

```typescript
const MODEL_RECOMMENDATIONS = {
  architect: {
    primary: ['llama3:70b', 'llama3.1:70b'],
    alternatives: ['mixtral:8x7b'],
    reason: 'High reasoning capability for task decomposition'
  },
  broker: {
    primary: ['mistral:7b', 'llama3:8b'],
    alternatives: ['phi3:medium'],
    reason: 'Fast decision-making for worker selection'
  },
  worker: {
    code: {
      primary: ['codellama:13b', 'deepseek-coder:6.7b'],
      alternatives: ['starcoder2:7b'],
      reason: 'Optimized for code understanding'
    },
    general: {
      primary: ['llama3:8b', 'mistral:7b'],
      alternatives: [],
      reason: 'General purpose task execution'
    }
  },
  validator: {
    primary: ['llama3:70b', 'llama3.1:70b'],
    alternatives: ['mixtral:8x7b'],
    reason: 'High accuracy for quality assessment'
  }
};
```

### Live Model Status

Show real-time status of models:

```typescript
interface ModelStatus {
  name: string;
  loaded: boolean;
  usedBy: string[];  // Node IDs using this model
  memoryUsage: number;  // MB
}

async function getModelStatus(modelName: string): Promise<ModelStatus> {
  // Check if model is currently loaded in OLLAMA
  const response = await fetch('http://localhost:11434/api/ps');
  const data = await response.json();

  const loadedModel = data.models.find(m => m.name === modelName);

  return {
    name: modelName,
    loaded: !!loadedModel,
    usedBy: loadedModel?.used_by || [],
    memoryUsage: loadedModel?.size_vram || 0
  };
}
```

### UI Enhancement: Model Info Tooltip

Show detailed info on hover:

```typescript
function ModelOption({ model, isRecommended }: { model: OllamaModel, isRecommended: boolean }) {
  return (
    <option
      value={model.name}
      title={`
        Model: ${model.name}
        Size: ${(model.size / 1e9).toFixed(1)}GB
        Family: ${model.details.family}
        Parameters: ${model.details.parameter_size}
        ${isRecommended ? '✓ Recommended for this node type' : ''}
      `}
    >
      {isRecommended ? '✓ ' : ''}
      {model.name}
    </option>
  );
}
```

See [UI_DESIGN.md](./UI_DESIGN.md) for complete UI specifications including model dropdown designs.

## Node Configuration Examples

### Architect Node with OLLAMA

```yaml
# architect-config.yaml
node:
  type: architect
  agent_id: architect-node-001
  name: "Strategic Task Architect"

ollama:
  endpoint: http://localhost:11434
  model: llama3:70b

  options:
    temperature: 0.3
    top_p: 0.9
    context_window: 8192
    repeat_penalty: 1.1

  system_prompt: |
    You are a strategic task architect responsible for decomposing
    complex user requests into executable task plans. Analyze requests
    thoroughly, identify subtasks, and delegate to appropriate brokers.

  capabilities:
    - task-decomposition
    - strategic-planning
    - broker-selection
    - progress-aggregation

  performance:
    max_concurrent_orchestrations: 10
    avg_decomposition_time_target_ms: 2500
```

### Worker Node with OLLAMA

```yaml
# worker-config.yaml
node:
  type: worker
  agent_id: worker-node-042
  name: "Code Analysis Specialist"

ollama:
  endpoint: http://localhost:11434
  model: codellama:13b

  options:
    temperature: 0.1
    top_p: 0.9
    context_window: 16384
    repeat_penalty: 1.0

  system_prompt: |
    You are a specialized code analysis worker. Your expertise includes
    static analysis, security auditing, refactoring suggestions, and
    code quality assessment. Provide detailed, actionable feedback.

  capabilities:
    skills:
      - code-analysis
      - security-audit
      - refactoring
      - python
      - javascript
      - typescript

  specialization:
    domain: software-engineering
    languages: [python, javascript, typescript, go, rust]

  performance:
    max_concurrent_tasks: 3
    confidence_threshold: 0.85
```

## Model Management

### Model Selection Strategy

```python
class ModelSelector:
    """Intelligently select OLLAMA model based on task requirements"""

    MODEL_REGISTRY = {
        "high_reasoning": ["llama3:70b", "llama3.1:70b", "mixtral:8x7b"],
        "fast_decision": ["mistral:7b", "llama3:8b", "phi3:medium"],
        "code_tasks": ["codellama:13b", "deepseek-coder:6.7b", "starcoder2:7b"],
        "general": ["llama3:8b", "mistral:7b"]
    }

    def select_model(self, task_requirements: dict) -> str:
        """Select optimal model for task"""

        # High complexity tasks need reasoning models
        if task_requirements.get("complexity") == "high":
            return self.MODEL_REGISTRY["high_reasoning"][0]

        # Code-related tasks
        if "code" in task_requirements.get("skills", []):
            return self.MODEL_REGISTRY["code_tasks"][0]

        # Fast turnaround needed
        if task_requirements.get("priority") == "urgent":
            return self.MODEL_REGISTRY["fast_decision"][0]

        # Default to general purpose
        return self.MODEL_REGISTRY["general"][0]
```

### Dynamic Model Switching

```python
class DynamicWorkerNode:
    """Worker that can switch models based on task type"""

    def __init__(self, agent_id: str):
        self.agent_id = agent_id
        self.ollama = OllamaClient()
        self.model_selector = ModelSelector()
        self.current_model = None

    def execute_task(self, task: dict) -> dict:
        """Execute with optimal model selection"""

        # Select best model for this task
        optimal_model = self.model_selector.select_model(
            task.get("requirements", {})
        )

        # Switch model if needed
        if optimal_model != self.current_model:
            self.current_model = optimal_model
            print(f"Switched to model: {optimal_model}")

        # Execute with selected model
        return self.ollama.generate(
            model=self.current_model,
            prompt=task["input"]["description"],
            system=self._get_system_prompt(task)
        )
```

## Performance Optimization

### Connection Pooling

```python
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
import requests

class OptimizedOllamaClient:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.session = self._create_session()

    def _create_session(self):
        """Create session with connection pooling and retries"""
        session = requests.Session()

        # Retry strategy
        retry = Retry(
            total=3,
            backoff_factor=0.3,
            status_forcelist=[500, 502, 503, 504]
        )

        # Connection pooling
        adapter = HTTPAdapter(
            pool_connections=10,
            pool_maxsize=20,
            max_retries=retry
        )

        session.mount('http://', adapter)
        session.mount('https://', adapter)

        return session
```

### Caching Responses

```python
from functools import lru_cache
import hashlib
import json

class CachedOllamaClient(OllamaClient):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.cache = {}

    def generate_cached(self, model: str, prompt: str, **kwargs):
        """Generate with caching for deterministic queries"""

        # Create cache key
        cache_key = hashlib.sha256(
            f"{model}:{prompt}:{json.dumps(kwargs)}".encode()
        ).hexdigest()

        # Check cache
        if cache_key in self.cache:
            return self.cache[cache_key]

        # Generate and cache
        result = self.generate(model, prompt, **kwargs)
        self.cache[cache_key] = result

        return result
```

### Batch Processing

```python
async def batch_process_tasks(
    tasks: list[dict],
    ollama_client: OllamaClient,
    model: str,
    max_concurrent: int = 3
) -> list[dict]:
    """Process multiple tasks concurrently"""
    import asyncio

    semaphore = asyncio.Semaphore(max_concurrent)

    async def process_one(task):
        async with semaphore:
            return await asyncio.to_thread(
                ollama_client.generate,
                model=model,
                prompt=task["input"]["description"]
            )

    results = await asyncio.gather(*[
        process_one(task) for task in tasks
    ])

    return results
```

## Monitoring and Health Checks

### Health Check Endpoint

```python
def check_ollama_health(base_url: str = "http://localhost:11434") -> dict:
    """Check OLLAMA server health and available models"""

    try:
        # Check server is running
        response = requests.get(f"{base_url}/api/tags", timeout=5)
        response.raise_for_status()

        models = response.json()["models"]

        return {
            "status": "healthy",
            "endpoint": base_url,
            "available_models": len(models),
            "models": [m["name"] for m in models]
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "endpoint": base_url,
            "error": str(e)
        }
```

### Performance Monitoring

```python
import time
from dataclasses import dataclass

@dataclass
class InferenceMetrics:
    model: str
    prompt_tokens: int
    completion_tokens: int
    duration_seconds: float
    tokens_per_second: float

class MonitoredOllamaClient(OllamaClient):
    def generate_with_metrics(self, **kwargs) -> tuple[dict, InferenceMetrics]:
        """Generate with performance metrics"""

        start_time = time.time()
        result = self.generate(**kwargs)
        duration = time.time() - start_time

        metrics = InferenceMetrics(
            model=kwargs["model"],
            prompt_tokens=result.get("prompt_eval_count", 0),
            completion_tokens=result.get("eval_count", 0),
            duration_seconds=duration,
            tokens_per_second=result.get("eval_count", 0) / duration
        )

        return result, metrics
```

## Fallback Strategy

### Cloud Provider Fallback

```python
class HybridLLMClient:
    """OLLAMA with cloud fallback for resilience"""

    def __init__(self):
        self.ollama = OllamaClient()
        self.openai_key = os.getenv("OPENAI_API_KEY")

    def generate(self, prompt: str, use_fallback: bool = True):
        """Try OLLAMA first, fallback to OpenAI if needed"""

        try:
            # Try OLLAMA first
            return self.ollama.generate(
                model="llama3:8b",
                prompt=prompt,
                timeout=30
            )
        except Exception as e:
            if use_fallback and self.openai_key:
                # Fallback to OpenAI
                import openai
                openai.api_key = self.openai_key

                return openai.ChatCompletion.create(
                    model="gpt-4",
                    messages=[{"role": "user", "content": prompt}]
                )
            else:
                raise e
```

## Resource Requirements

### Hardware Recommendations

| Model | RAM Required | GPU | CPU Cores | Tokens/sec (CPU) |
|-------|-------------|-----|-----------|------------------|
| llama3:8b | 8 GB | Optional | 4+ | 10-20 |
| llama3:70b | 48 GB | Recommended | 16+ | 2-5 |
| mistral:7b | 6 GB | Optional | 4+ | 15-25 |
| codellama:13b | 16 GB | Optional | 8+ | 8-15 |

### Docker Deployment

```dockerfile
# Dockerfile for OLLAMA-enabled Thread Node
FROM ollama/ollama:latest

# Install models
RUN ollama serve & sleep 5 && \
    ollama pull llama3:8b && \
    ollama pull mistral:7b && \
    ollama pull codellama:13b

# Expose OLLAMA API
EXPOSE 11434

CMD ["ollama", "serve"]
```

## Next Steps

1. Install and configure OLLAMA server
2. Pull recommended models for each node type
3. Implement OLLAMA client wrapper
4. Create model selection logic
5. Add health monitoring
6. Test performance with different models

## References

- [OLLAMA Documentation](https://github.com/ollama/ollama)
- [OLLAMA Model Library](https://ollama.com/library)
- [Agent Card Specifications](./AGENT_CARDS.md)
- [System Architecture](./ARCHITECTURE.md)
