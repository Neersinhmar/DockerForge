# DockerForge — AI-Powered Dockerfile Generator

DockerForge is an AI-powered DevOps tool that accepts a public GitHub repository URL, analyzes the repository structure, generates a Dockerfile, builds the Docker image, and verifies whether the generated container starts successfully.

This is not only a text-generation tool. DockerForge follows an agentic workflow where it generates a Dockerfile, runs `docker build`, reads build errors, and retries with improvements up to three times.

---

## Features

* Accepts a public GitHub repository URL
* Clones the repository locally
* Scans the project file structure
* Uses an LLM to generate a Dockerfile
* Writes the Dockerfile into the cloned repository
* Runs `docker build`
* Captures and displays build logs
* Retries failed builds up to 3 times
* Runs the generated Docker image
* Verifies whether the container starts
* Displays the final Dockerfile, build logs, and run logs in the UI
* Dockerized setup for running DockerForge itself

---

## Tech Stack

### Frontend

* React
* Vite
* JavaScript

### Backend

* Python
* FastAPI
* Uvicorn

### DevOps / Tooling

* Docker
* Docker CLI
* Git CLI

### LLM Provider

* Gemini API

---

## Architecture

```txt
User
 |
 | enters public GitHub repository URL
 v
React Frontend
 |
 | sends POST request with repo URL
 v
FastAPI Backend
 |
 | clones GitHub repository
 v
Repository Analyzer
 |
 | scans files and folder structure
 v
Gemini AI Agent
 |
 | generates Dockerfile based on repo structure
 v
Docker Runner
 |
 | writes Dockerfile
 | runs docker build
 | captures logs
 v
Retry Loop
 |
 | if build fails, sends error logs back to AI
 | retries up to 3 attempts
 v
Container Verification
 |
 | runs docker container
 | checks if container starts
 v
Frontend UI
 |
 | shows final Dockerfile, build logs, and run logs
```

---

## How It Works

1. The user enters a public GitHub repository URL in the UI.
2. The frontend sends the URL to the FastAPI backend.
3. The backend clones the repository using Git.
4. The backend scans the repository file structure.
5. The scanned structure is sent to the Gemini-powered AI agent.
6. The AI agent generates a Dockerfile.
7. DockerForge writes the Dockerfile into the cloned repository.
8. DockerForge runs `docker build`.
9. If the build fails, the build error is passed back to the AI agent.
10. The agent retries Dockerfile generation up to 3 attempts.
11. If the image builds successfully, DockerForge runs the container.
12. The UI displays the final status, Dockerfile, build logs, and run logs.

---

## LLM Provider Used

DockerForge uses **Gemini API** as the LLM provider.

### Why Gemini?

Gemini was selected because:

* It is easy to integrate with Python.
* It provides fast responses.
* It is suitable for structured generation tasks like Dockerfiles.
* It is useful for testing and demo projects.
* It can reason over repository structure and build errors.

The LLM is used to generate the Dockerfile and improve it when Docker build errors occur.

---

## Prerequisites

Before running the project, make sure these are installed:

* Python 3.11+
* Node.js
* npm
* Git
* Docker Desktop
* Gemini API key

Check installation:

```bash
python --version
node -v
npm -v
git --version
docker --version
docker ps
```

Docker Desktop must be running before using DockerForge.

---

## Environment Variables

Create a `.env` file inside the `backend` folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Do not push `.env` to GitHub.

---

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Neersinhmar/DockerForge.git
cd DockerForge
```

---

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend will run on:

```txt
http://localhost:8000
```

FastAPI docs:

```txt
http://localhost:8000/docs
```

---

## Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```txt
http://localhost:5173
```

---

## Running DockerForge with Docker

DockerForge itself is Dockerized.

### Build Image

From the project root:

```bash
docker build -t dockerforge .
```

### Run Container

For Windows CMD:

```bash
docker run -p 8000:8000 --env-file backend\.env -v //var/run/docker.sock:/var/run/docker.sock dockerforge
```

For Linux/Mac:

```bash
docker run -p 8000:8000 --env-file backend/.env -v /var/run/docker.sock:/var/run/docker.sock dockerforge
```

Then open:

```txt
http://localhost:8000
```

---

## Docker Compose

You can also run the project using Docker Compose:

```bash
docker compose up --build
```

---

## API Endpoint

### Health Check

```http
GET /
```

or:

```http
GET /health
```

Response:

```json
{
  "message": "DockerForge backend is running"
}
```

### Generate Dockerfile

```http
POST /generate-dockerfile
```

Request body:

```json
{
  "repo_url": "https://github.com/render-examples/express-hello-world"
}
```

Response includes:

```json
{
  "success": true,
  "attempts": 1,
  "dockerfile": "...",
  "build_logs": "...",
  "run_logs": "..."
}
```

---

## Demo Repository

A sample repository used for testing:

```txt
https://github.com/render-examples/express-hello-world
```

---

## Project Structure

```txt
DockerForge/
│
├── Dockerfile
├── docker-compose.yml
├── README.md
├── .gitignore
│
├── backend/
│   ├── main.py
│   ├── agent.py
│   ├── docker_runner.py
│   ├── repo_analyser.py
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── package-lock.json
    └── src/
        ├── App.jsx
        ├── App.css
        ├── api.js
        └── main.jsx
```

Note: `.env`, `venv`, `node_modules`, and temporary cloned repositories are ignored using `.gitignore`.

---

## Known Limitations and Edge Cases

* Only public GitHub repositories are supported.
* Private repositories are not supported.
* Some repositories are libraries or frameworks and may not be directly runnable.
* Complex projects requiring databases, queues, Redis, Kafka, or external services may need `docker-compose.yml`.
* Port detection is basic and may not work for every framework.
* Some repositories require secret environment variables that DockerForge cannot infer.
* Repositories with custom build systems may fail.
* Running unknown repositories can be risky.
* The Dockerized version mounts the Docker socket for demo purposes, which should be avoided in production.
* In production, builds should run inside isolated sandboxes with CPU, memory, network, and filesystem restrictions.

---

## Security Notes

DockerForge clones and builds public repositories. Since this can involve running untrusted code, production usage should include:

* Sandbox isolation
* Resource limits
* Network restrictions
* Container cleanup
* Image cleanup
* Secret protection
* Separate build workers

The `.env` file is ignored and should never be pushed to GitHub.

---

## Assignment Requirements Covered

* Public GitHub repository
* Dockerized project
* Dockerfile included
* Docker build and Docker run support
* README with architecture explanation
* Setup instructions
* LLM provider explanation
* Known limitations
* AI-generated Dockerfile
* Docker build verification
* Retry loop up to 3 attempts
* Container startup verification
* UI displays final Dockerfile and logs

---

## Author

DockerForge was built as a technical assignment for the Full Stack + Agentic AI Developer role.
