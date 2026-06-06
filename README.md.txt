# DockerForge — AI-Powered Dockerfile Generator

DockerForge is an AI-powered DevOps tool that accepts a public GitHub repository URL, analyzes the repository structure, generates a Dockerfile, builds the Docker image, and verifies whether the container starts successfully.

The tool is not only a Dockerfile text generator. It follows an agentic flow where it generates a Dockerfile, runs `docker build`, reads build errors, and retries up to three times.

## Features

* Accepts a public GitHub repository URL
* Clones the repository locally
* Scans project file structure
* Uses an LLM to generate a Dockerfile
* Runs `docker build`
* Captures build logs
* Retries failed builds up to 3 times
* Runs the generated Docker image
* Shows final Dockerfile, build logs, and run logs in the UI
* Dockerized project setup

## Tech Stack

* Frontend: React + Vite
* Backend: FastAPI + Python
* Containerization: Docker
* LLM Provider: Gemini API
* Repository Handling: Git CLI
* Build Verification: Docker CLI

## Architecture

User enters GitHub repository URL in the React UI.

The frontend sends the URL to the FastAPI backend.

The backend clones the repository using Git, scans the file structure, and sends the structure to the Gemini-powered AI agent.

The AI agent generates a Dockerfile based on the project structure. The backend writes the Dockerfile into the cloned repository and runs `docker build`.

If the build fails, the backend captures the error logs and sends them back to the AI agent. The AI agent then tries to fix the Dockerfile. This retry process runs up to three attempts.

If the image builds successfully, DockerForge runs the container and verifies whether it starts properly.

Finally, the UI displays the status, attempts, final Dockerfile, build logs, and run logs.

## LLM Provider

DockerForge uses Gemini API as the LLM provider.

Gemini was selected because it provides fast response generation, is easy to integrate with Python, and is suitable for generating structured DevOps configuration files such as Dockerfiles.

## Setup Instructions

### Prerequisites

* Python 3.11+
* Node.js
* Git
* Docker Desktop
* Gemini API key

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

Backend runs on:

```txt
http://localhost:8000
```

## Environment Variables

Create a `.env` file inside the backend folder:

```env
GEMINI_API_KEY=your_gemini_api_key
```

## Running with Docker

Build the DockerForge image:

```bash
docker build -t dockerforge .
```

Run the container:

```bash
docker run -p 8000:8000 -e GEMINI_API_KEY=your_gemini_api_key -v /var/run/docker.sock:/var/run/docker.sock dockerforge
```

Then open:

```txt
http://localhost:8000
```

## Known Limitations

* Only public GitHub repositories are supported.
* Some repositories may not be directly runnable because they are libraries, frameworks, or require external services.
* Port detection is basic and may fail for complex projects.
* Repositories requiring databases, queues, or secret environment variables may need docker-compose support.
* Running untrusted repositories can be risky. In production, builds should run inside isolated sandboxes with CPU, memory, and network restrictions.
* Docker must be installed and running on the host machine.

## Demo Repository Used

Medium-level test repository:

```txt
https://github.com/render-examples/express-hello-world
```
