import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def clean_dockerfile(text: str) -> str:
    text = text.strip()

    if text.startswith("```dockerfile"):
        text = text.replace("```dockerfile", "", 1).strip()

    if text.startswith("```"):
        text = text.replace("```", "", 1).strip()

    if text.endswith("```"):
        text = text[:-3].strip()

    return text


def generate_dockerfile(repo_structure: str, previous_error: str | None = None) -> str:
    prompt = f"""
You are DockerForge, an expert DevOps AI agent.

Your task:
Generate a working Dockerfile for the given GitHub repository structure.

Repository structure:
{repo_structure}

Previous build error:
{previous_error or "None"}

Rules:
- Return only Dockerfile content.
- Do not use markdown.
- Do not explain anything.
- Choose correct base image.
- Install dependencies.
- Expose correct port if obvious.
- Add correct CMD.
- Make sure docker build can work.
- If previous error exists, fix the Dockerfile according to that error.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return clean_dockerfile(response.text)