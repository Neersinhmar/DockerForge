import { useState } from "react";

function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const generateDockerfile = async () => {
    if (!repoUrl.trim()) {
      setError("Please enter a GitHub repository URL.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

   try {
  const res = await fetch("/generate-dockerfile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ repo_url: repoUrl }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || data.error || "Backend error occurred.");
  }

  setResult(data);
} catch (err) {
  setError(err.message || "Something went wrong.");
} finally {
  setLoading(false);
}
  };

  const copyDockerfile = async () => {
    if (result?.dockerfile) {
      await navigator.clipboard.writeText(result.dockerfile);
      alert("Dockerfile copied!");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>DockerForge</h1>
            <p style={styles.subtitle}>
              AI-powered Dockerfile generator that builds, tests, and retries automatically.
            </p>
          </div>

          <div style={styles.badge}>Full Stack + Agentic AI</div>
        </div>

        <div style={styles.card}>
          <label style={styles.label}>GitHub Repository URL</label>

          <div style={styles.inputRow}>
            <input
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/user/repository"
              style={styles.input}
            />

            <button
              onClick={generateDockerfile}
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Generating..." : "Generate Dockerfile"}
            </button>
          </div>

          <p style={styles.hint}>
            Example: https://github.com/docker/getting-started-app
          </p>
        </div>

        {loading && (
          <div style={styles.loadingCard}>
            <div style={styles.spinner}></div>
            <div>
              <h3 style={styles.loadingTitle}>DockerForge is working...</h3>
              <p style={styles.loadingText}>
                Cloning repository, analyzing files, generating Dockerfile, building image,
                and verifying container startup.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div style={styles.errorCard}>
            <h3 style={styles.errorTitle}>Error</h3>
            <pre style={styles.errorText}>{error}</pre>
          </div>
        )}

        {result && (
          <div style={styles.results}>
            <div
              style={{
                ...styles.statusCard,
                borderColor: result.success ? "#22c55e" : "#ef4444",
              }}
            >
              <div>
                <p style={styles.statusLabel}>Status</p>
                <h2
                  style={{
                    ...styles.statusText,
                    color: result.success ? "#22c55e" : "#ef4444",
                  }}
                >
                  {result.success ? "Success" : "Failed"}
                </h2>
              </div>

              <div>
                <p style={styles.statusLabel}>Attempts</p>
                <h2 style={styles.statusText}>{result.attempts || "N/A"}</h2>
              </div>
            </div>

            {result.error && (
              <LogBlock
                title="Backend Error"
                content={result.error}
                variant="error"
              />
            )}

            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Final Dockerfile</h2>

              {result.dockerfile && (
                <button onClick={copyDockerfile} style={styles.copyButton}>
                  Copy
                </button>
              )}
            </div>

            <LogBlock
              content={result.dockerfile || "No Dockerfile generated."}
              variant="dockerfile"
            />

            <LogBlock
              title="Build Logs"
              content={result.build_logs || "No build logs available."}
            />

            <LogBlock
              title="Run Logs"
              content={result.run_logs || "No run logs available."}
            />

            {result.message && (
              <div style={styles.messageBox}>{result.message}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LogBlock({ title, content, variant }) {
  return (
    <div style={styles.logWrapper}>
      {title && <h3 style={styles.logTitle}>{title}</h3>}

      <pre
        style={{
          ...styles.logBox,
          background:
            variant === "error"
              ? "#450a0a"
              : variant === "dockerfile"
              ? "#020617"
              : "#111827",
          color:
            variant === "error"
              ? "#fecaca"
              : variant === "dockerfile"
              ? "#86efac"
              : "#e5e7eb",
        }}
      >
        {content}
      </pre>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #111827 100%)",
    color: "#f8fafc",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "40px 20px",
  },

  container: {
    maxWidth: "1150px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    fontSize: "44px",
    margin: "0",
    letterSpacing: "-1px",
  },

  subtitle: {
    marginTop: "10px",
    color: "#cbd5e1",
    fontSize: "17px",
  },

  badge: {
    padding: "10px 16px",
    borderRadius: "999px",
    background: "rgba(59, 130, 246, 0.15)",
    color: "#93c5fd",
    border: "1px solid rgba(147, 197, 253, 0.3)",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  card: {
    background: "rgba(15, 23, 42, 0.9)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
  },

  label: {
    display: "block",
    marginBottom: "10px",
    color: "#e2e8f0",
    fontWeight: "600",
  },

  inputRow: {
    display: "flex",
    gap: "12px",
  },

  input: {
    flex: 1,
    padding: "15px 16px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#f8fafc",
    outline: "none",
    fontSize: "15px",
  },

  button: {
    padding: "15px 20px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
    color: "white",
    fontWeight: "700",
    fontSize: "15px",
  },

  hint: {
    marginTop: "12px",
    color: "#94a3b8",
    fontSize: "14px",
  },

  loadingCard: {
    marginTop: "24px",
    display: "flex",
    gap: "18px",
    alignItems: "center",
    background: "rgba(30, 41, 59, 0.9)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "18px",
    padding: "22px",
  },

  spinner: {
    width: "34px",
    height: "34px",
    border: "4px solid #334155",
    borderTop: "4px solid #60a5fa",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingTitle: {
    margin: "0 0 5px 0",
  },

  loadingText: {
    margin: 0,
    color: "#cbd5e1",
  },

  errorCard: {
    marginTop: "24px",
    background: "#450a0a",
    border: "1px solid #ef4444",
    borderRadius: "18px",
    padding: "20px",
  },

  errorTitle: {
    marginTop: 0,
    color: "#fecaca",
  },

  errorText: {
    whiteSpace: "pre-wrap",
    color: "#fecaca",
  },

  results: {
    marginTop: "28px",
  },

  statusCard: {
    display: "flex",
    gap: "50px",
    background: "rgba(15, 23, 42, 0.9)",
    border: "1px solid",
    borderRadius: "18px",
    padding: "22px",
    marginBottom: "24px",
  },

  statusLabel: {
    margin: "0 0 6px 0",
    color: "#94a3b8",
    fontSize: "14px",
  },

  statusText: {
    margin: 0,
    fontSize: "30px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    margin: "10px 0 12px 0",
  },

  copyButton: {
    padding: "9px 14px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "#e2e8f0",
    cursor: "pointer",
  },

  logWrapper: {
    marginBottom: "24px",
  },

  logTitle: {
    margin: "10px 0 12px 0",
  },

  logBox: {
    padding: "18px",
    borderRadius: "14px",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    overflowX: "auto",
    whiteSpace: "pre-wrap",
    minHeight: "70px",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  messageBox: {
    background: "rgba(234, 179, 8, 0.12)",
    border: "1px solid rgba(234, 179, 8, 0.35)",
    color: "#fde68a",
    borderRadius: "14px",
    padding: "16px",
    marginBottom: "30px",
  },
};

export default App;