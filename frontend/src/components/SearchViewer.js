import React, { useState } from "react";
import axios from "axios";

const SearchViewer = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("");
  const [fileType, setFileType] = useState("");
  const [modalDoc, setModalDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return setStatus("⚠️ Please enter a query.");

    setIsLoading(true);
    setStatus("");

    try {
      const res = await axios.post("http://localhost:5000/documents/search", {
        query,
        file_type: fileType || null
      });
      setResults(res.data.matches || []);
      setStatus(`✅ ${res.data.matches.length} results found for "${query}"`);
    } catch (error) {
      console.error("❌ Search error:", error);
      setStatus("❌ Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5 fade-in-block">
      <h3 className="text-center animated-title">
        🔍 Semantic Search
        <span className="info-tooltip" title="Find documents by meaning using AI embedding matching.">ℹ️</span>
      </h3>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="e.g. AI certifications"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="row mb-3">
          <div className="col-md-4">
            <select
              className="form-select"
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
            >
              <option value="">All File Types</option>
              <option value="pdf">PDF</option>
              <option value="txt">Text</option>
            </select>
          </div>

          <div className="col-md-4">
            <select className="form-select">
              <option value="">Tag</option>
              <option value="Resume">Resume</option>
              <option value="Internship">Internship</option>
              <option value="Skills">Skills</option>
            </select>
          </div>

          <div className="col-md-4">
            <select className="form-select">
              <option value="">Date Range</option>
              <option value="last7">Last 7 Days</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-success">Search</button>
      </form>

      <div className="recent-queries mt-3">
        <strong>Recent Queries:</strong>
        <ul className="list-inline">
          <li className="list-inline-item badge bg-secondary me-1">Internship timeline</li>
          <li className="list-inline-item badge bg-secondary me-1">AI certification</li>
          <li className="list-inline-item badge bg-secondary me-1">Excel training</li>
        </ul>
      </div>

      {isLoading && <div className="loader mx-auto mt-4"></div>}
      {status && (
        <div className="alert alert-info mt-3 text-center">{status}</div>
      )}

      <div className="mt-4">
        {results.map((doc) => (
          <div key={doc.doc_id} className="card mb-3 result-card">
            <div className="card-body">
              <h5 className="card-title">{doc.filename}</h5>
              <p className="card-text">{doc.content_snippet}</p>
              <span className="badge bg-info">🧠 Score: {doc.similarity}</span>

              <p className="card-text text-muted">📝 Summary: {doc.summary}</p>

              <div className="mt-2">
                <a
                  href={`http://localhost:5000/documents/view/${doc.doc_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm"
                >
                  View File
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalDoc && (
        <div
          className="modal show d-block bg-dark bg-opacity-75"
          tabIndex="-1"
          onClick={() => setModalDoc(null)}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content modal-fade">
              <div className="modal-header">
                <h5 className="modal-title">{modalDoc.filename}</h5>
                <button type="button" className="btn-close" onClick={() => setModalDoc(null)}></button>
              </div>
              <div className="modal-body">
                <p>{modalDoc.content_snippet}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchViewer;
