import React, { useEffect, useState } from "react";
import axios from "axios";

const UploadHistory = () => {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await axios.get("http://localhost:5000/documents/history");
        setUploads(res.data.uploads || []);
      } catch (err) {
        console.error("❌ Failed to load history:", err);
      }
    }
    fetchHistory();
  }, []);

  const handleDelete = async (docId) => {
    console.log("Deleting doc ID:", docId); // 🧪 Debug log
    try {
      await axios.delete(`http://localhost:5000/documents/delete/${docId}`);
      setUploads((prev) => prev.filter((u) => u.id !== docId));
    } catch (err) {
      console.error("❌ Failed to delete:", err);
    }
  };

  return (
    <div className="container mt-4 block-wrapper">
      <h4 className="text-center animated-title">📁 Upload History</h4>
      <div className="scroll-wrapper">
        <table className="table table-hover table-bordered">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Date Uploaded</th>
              <th>Type</th>
              <th>Tags</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((u, i) => (
              <tr key={i}>
                <td>{u.filename}</td>
                <td>{u.date}</td>
                <td>{u.type}</td>
                <td>{u.tags?.join(", ") || "—"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(u.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {uploads.length > 0 && (
        <div className="text-center mt-2">
          <strong>🧮 Total PDFs Uploaded:</strong>{" "}
          {uploads.filter((u) => u.type?.toLowerCase() === "pdf").length}
        </div>
      )}
    </div>
  );
};

export default UploadHistory;
