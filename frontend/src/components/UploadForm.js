import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.warning("⚠️ No file selected.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tags", tags);

    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`✅ Uploaded! Doc ID: ${res.data.doc_id}`);
      setFile(null);
      setTags("");
    } catch (err) {
      console.error("❌ Upload error:", err);
      toast.error("❌ Upload failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4 fade-in-block">
      <h3 className="text-center animated-title mb-4">
        📤 Upload a File to Your Knowledgebase
      </h3>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".pdf,.txt"
          className="form-control mb-3"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <div className="text-center">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
