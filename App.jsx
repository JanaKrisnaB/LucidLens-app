import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("text");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload an image.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);

    try {
      const response = await fetch("http://localhost:8000/process", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.result);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Could not connect to API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🧠 Futuristic Image Text Processor</h1>

      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <div className="mode-buttons">
        <button
          className={mode === "text" ? "active" : ""}
          onClick={() => setMode("text")}
        >
          View Text
        </button>
        <button
          className={mode === "summary" ? "active" : ""}
          onClick={() => setMode("summary")}
        >
          Summarize
        </button>
        <button
          className={mode === "explain" ? "active" : ""}
          onClick={() => setMode("explain")}
        >
          Explain
        </button>
      </div>


      <button
        onClick={handleSubmit}
        disabled={loading}
        className="process-button"
      >
        {loading ? "Processing..." : "Process"}
      </button>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result">
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
