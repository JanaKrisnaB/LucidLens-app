import React, { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("text");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleModeClick = (selectedMode) => {
    setMode(selectedMode);
  };

  const handleProcess = async () => {
    if (!file) {
      setError("Please upload a file.");
      return;
    }

    setError("");
    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);

    try {
      const response = await fetch("https://lucidlens-backend-1.onrender.com/process", {
      method: "POST",
      body: formData,
    });


      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An error occurred.");
        setResult("");
      } else {
        setResult(data.result);
      }
    } catch (err) {
      setError("Could not connect to the API.");
      setResult("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header>
        <h1>🔎LucidLens</h1>
        <p>Extract, Summarize and Understand Effortlessly</p>
      </header>

      <div className="controls">
        <div className="upload-section">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div className="mode-buttons">
          <button
            className={mode === "text" ? "active" : ""}
            onClick={() => handleModeClick("text")}
          >
            View Text
          </button>
          <button
            className={mode === "summary" ? "active" : ""}
            onClick={() => handleModeClick("summary")}
          >
            Summarize
          </button>
          <button
            className={mode === "explain" ? "active" : ""}
            onClick={() => handleModeClick("explain")}
          >
            Explain
          </button>
        </div>

        <button
          className="process-button"
          onClick={handleProcess}
          disabled={loading}
        >
          {loading ? "Processing..." : "Process"}
        </button>

        {error && <div className="error">{error}</div>}

        {result && (
          <div className="result-box">
            <pre>{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
