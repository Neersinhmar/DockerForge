import os
import subprocess
import uuid
from pathlib import Path


BASE_DIR = Path("tmp_repos")


def clone_repo(repo_url: str) -> Path:
    BASE_DIR.mkdir(exist_ok=True)

    repo_id = str(uuid.uuid4())
    repo_path = BASE_DIR / repo_id

    try:
        result = subprocess.run(
            ["git", "clone", repo_url, str(repo_path)],
            capture_output=True,
            text=True,
            timeout=120
        )
    except FileNotFoundError:
        raise Exception("Git command not found. Install Git and restart CMD/VS Code.")

    if result.returncode != 0:
        raise Exception(f"Git clone failed: {result.stderr}")

    return repo_path


def scan_repo(repo_path: Path) -> str:
    ignored_dirs = {
        ".git",
        "node_modules",
        "__pycache__",
        ".venv",
        "venv",
        "dist",
        "build",
    }

    structure = []

    for root, dirs, files in os.walk(repo_path):
        dirs[:] = [d for d in dirs if d not in ignored_dirs]

        level = root.replace(str(repo_path), "").count(os.sep)
        indent = "  " * level

        structure.append(f"{indent}{os.path.basename(root)}/")

        for file in files[:15]:
            structure.append(f"{indent}  {file}")

    return "\n".join(structure)