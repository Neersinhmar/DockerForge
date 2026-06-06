import subprocess
import uuid
import time
from pathlib import Path


def write_dockerfile(repo_path: Path, dockerfile: str):
    dockerfile_path = repo_path / "Dockerfile"

    with open(dockerfile_path, "w", encoding="utf-8") as f:
        f.write(dockerfile)


def build_image(repo_path: Path):
    image_name = f"dockerforge-{uuid.uuid4()}"

    try:
        result = subprocess.run(
            ["docker", "build", "-t", image_name, "."],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=300
        )
    except FileNotFoundError:
        raise Exception(
            "Docker command not found. Please install Docker Desktop and make sure it is running."
        )

    logs = result.stdout + "\n" + result.stderr

    return {
        "success": result.returncode == 0,
        "image_name": image_name,
        "logs": logs
    }


def run_container(image_name: str):
    try:
        result = subprocess.run(
            [
                "docker",
                "run",
                "-d",
                "-p",
                "8080:8080",
                image_name
            ],
            capture_output=True,
            text=True,
            timeout=60
        )
    except FileNotFoundError:
        raise Exception(
            "Docker command not found. Please install Docker Desktop and make sure it is running."
        )

    if result.returncode != 0:
        return {
            "success": False,
            "logs": result.stdout + "\n" + result.stderr
        }

    container_id = result.stdout.strip()

    time.sleep(5)

    logs_result = subprocess.run(
        ["docker", "logs", container_id],
        capture_output=True,
        text=True,
        timeout=30
    )

    logs = logs_result.stdout + "\n" + logs_result.stderr

    inspect_result = subprocess.run(
        [
            "docker",
            "inspect",
            "-f",
            "{{.State.Running}}",
            container_id
        ],
        capture_output=True,
        text=True
    )

    is_running = inspect_result.stdout.strip() == "true"

    subprocess.run(
        ["docker", "rm", "-f", container_id],
        capture_output=True
    )

    return {
        "success": is_running,
        "logs": logs
    }