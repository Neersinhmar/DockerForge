from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from repo_analyser import clone_repo, scan_repo
from agent import generate_dockerfile
from docker_runner import write_dockerfile, build_image, run_container

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GenerateRequest(BaseModel):
    repo_url: str


@app.get("/health")
def health():
    return {"message": "DockerForge backend is running"}


@app.post("/generate-dockerfile")
def generate(req: GenerateRequest):
    try:
        repo_path = clone_repo(req.repo_url)
        repo_structure = scan_repo(repo_path)

        previous_error = None
        final_dockerfile = None
        final_build_logs = None

        for attempt in range(1, 4):
            dockerfile = generate_dockerfile(repo_structure, previous_error)
            write_dockerfile(repo_path, dockerfile)

            build_result = build_image(repo_path)
            final_dockerfile = dockerfile
            final_build_logs = build_result["logs"]

            if build_result["success"]:
                run_result = run_container(build_result["image_name"])

                return {
                    "success": run_result["success"],
                    "attempts": attempt,
                    "dockerfile": final_dockerfile,
                    "build_logs": final_build_logs,
                    "run_logs": run_result["logs"],
                }

            previous_error = build_result["logs"]

        return {
            "success": False,
            "attempts": 3,
            "dockerfile": final_dockerfile,
            "build_logs": final_build_logs,
            "run_logs": None,
            "message": "Docker build failed after 3 attempts.",
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"

if FRONTEND_DIST.exists():
    app.mount(
        "/assets",
        StaticFiles(directory=FRONTEND_DIST / "assets"),
        name="assets"
    )

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        index_file = FRONTEND_DIST / "index.html"
        return FileResponse(index_file)