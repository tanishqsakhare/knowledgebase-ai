import "./style.css";
import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import SearchViewer from "./components/SearchViewer";
import UploadHistory from "./components/UploadHistory";
import Analytics from "./components/Analytics";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <div className="App">
      {/* 🧠 Centered Main Title */}
      <h1 className="project-title text-center mt-3">
        🚀 Personal Knowledgebase with Semantic Search
      </h1>

      <ToastContainer position="top-center" />

      {/* 🔘 Section Buttons */}
      <div className="d-flex justify-content-center mt-3">
        <div className="btn-group">
          <button
            className={`btn btn-outline-primary ${activeTab === "upload" ? "active" : ""}`}
            onClick={() => setActiveTab("upload")}
          >
            Upload File
          </button>
          <button
            className={`btn btn-outline-success ${activeTab === "search" ? "active" : ""}`}
            onClick={() => setActiveTab("search")}
          >
            Semantic Search
          </button>
          <button
            className={`btn btn-outline-secondary ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Upload History
          </button>
          <button
            className={`btn btn-outline-warning ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* 👇 Section Wrapper */}
      <div className="block-wrapper mt-4 pt-3">
        {activeTab === "upload" && <UploadForm />}
        {activeTab === "search" && <SearchViewer />}
        {activeTab === "history" && <UploadHistory />}
        {activeTab === "analytics" && <Analytics />}
      </div>
    </div>
  );
}

export default App;
