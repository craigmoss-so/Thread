# Thread Setup Guide

This guide will help you set up and run the Thread Node application.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- (Optional) OpenAI API key for OpenAI models
- (Optional) Ollama installed locally for Ollama models
- (Optional) LM Studio installed locally for LM Studio models

## Installation

1. Clone the repository and navigate to the project directory:
```bash
cd Thread
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your configuration:
```env
# OpenAI Configuration
REACT_APP_OPENAI_API_KEY=your_actual_api_key_here

# Ollama Configuration (local)
REACT_APP_OLLAMA_URL=http://localhost:11434

# LM Studio Configuration (local)
REACT_APP_LMSTUDIO_URL=http://localhost:1234
```

## Running the Application

Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## Configuring AI Providers

### OpenAI

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to your `.env` file as `REACT_APP_OPENAI_API_KEY`
3. Restart the development server

### Ollama (Local)

1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull a model:
```bash
ollama pull llama2
# or
ollama pull mistral
# or
ollama pull codellama
```
3. Ensure Ollama is running (it starts automatically on installation)
4. The default URL is `http://localhost:11434`

### LM Studio (Local)

1. Install LM Studio from [lmstudio.ai](https://lmstudio.ai)
2. Download a model through the LM Studio interface
3. Start the local server in LM Studio
4. The default URL is `http://localhost:1234`

## Using the Application

### Step 1: Configure Your Node

1. Click on the node in the canvas to select it
2. In the Configuration panel on the right:
   - Set a delegation ID (optional)
   - Choose your AI provider (OpenAI, Ollama, or LM Studio)
   - Select the model you want to use
   - Adjust model parameters:
     - **Temperature**: Controls randomness (0 = focused, 2 = creative)
     - **Top P**: Nucleus sampling threshold
     - **Max Tokens**: Maximum response length
     - **Seed**: For reproducible outputs (optional)
   - Set system parameters like logging level
3. Click "Save Configuration"

### Step 2: Execute a Task

1. In the Task Input panel (bottom left):
   - Enter your task or query
   - Or click one of the example tasks
2. Click "Execute Task"
3. View the output in the Output panel (bottom right)

## Troubleshooting

### "OpenAI API key not configured"
- Make sure you've added your API key to the `.env` file
- Restart the development server after adding the key

### "Cannot connect to Ollama"
- Ensure Ollama is installed and running
- Check that the URL in `.env` matches your Ollama instance
- Try accessing `http://localhost:11434` in your browser

### "Cannot connect to LM Studio"
- Make sure LM Studio is running
- Ensure you've started the local server in LM Studio
- Check that the URL in `.env` is correct

### Component errors
- Check the browser console for detailed error messages
- The application includes error boundaries for graceful error handling

## Development

### Project Structure
```
Thread/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   │   ├── Canvas.js
│   │   ├── CanvasNode.js
│   │   ├── ConfigPanel.js
│   │   ├── TaskPanel.js
│   │   ├── OutputPanel.js
│   │   └── ErrorBoundary.js
│   ├── services/        # API services
│   │   ├── apiService.js
│   │   ├── openaiService.js
│   │   ├── ollamaService.js
│   │   └── lmstudioService.js
│   ├── App.js          # Main application
│   ├── App.css         # Main styles
│   └── index.js        # Entry point
├── package.json
└── README.md
```

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

## Next Steps

This is Step 1 of the Thread project. Future steps will include:
- Step 2: Multi-node canvas with dynamic connections
- Step 3: Task delegation between nodes
- Step 4: Dynamic role switching (workers becoming architects)
- Step 5: Validation nodes and reputation systems

## Support

For issues and questions, please check the project README or create an issue in the repository.
