# Local AI Agent Platform

This repository contains the frontend and backend for a plug-and-play AI Agent Platform.

## Project Structure

- `agents/`: Contains configurations and definitions for different AI agents (e.g., AutoGen, smol-agents).
- `backend/`: The FastAPI backend server that orchestrates agents, manages data, and serves the API.
- `data/`: Local data storage for the platform, including vector stores, SQLite databases, and logs.
- `frontend/`: The React-based user interface for interacting with the platform.

## Backend Setup

This guide covers the initial setup of the backend environment.

### 1. Prerequisites

- Python 3.11+
- An environment manager like `venv` or `conda`.
- [Ollama](https://ollama.com/) installed and running for local LLM support. Verify it's running on `http://localhost:11434`.

### 2. Installation

Navigate to the `backend` directory and set up the environment:

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# On Windows
# .\.venv\Scripts\activate
# On macOS/Linux
source .venv/bin/activate

# Install all required dependencies
pip install -r requirements.txt

# Create your local environment file from the example
cp .env.example .env
```
Now, you can edit the `.env` file to add your API keys or change default paths.

### 3. Running the Backend Server

Once dependencies are installed, you can run the FastAPI server using Uvicorn:

```bash
# From the backend/ directory
uvicorn main:app --reload
```

The server will be available at `http://127.0.0.1:8000` by default. The application will automatically create a `data/` directory and run database migrations on the first start.

### 4. Verification

You can verify that the server is running correctly by accessing these endpoints:

- **API Docs**: Open your browser to [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).
- **Health Check**: `curl http://127.0.0.1:8000/healthz` should return `{"status":"ok"}`.
- **Tools List**: `curl http://127.0.0.1:8000/api/v1/tools` should return a JSON list of available agent tools.