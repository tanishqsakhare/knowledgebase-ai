import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Analytics() {
  const [recentQueries, setRecentQueries] = useState([]);
  const [fileCounts, setFileCounts] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/documents/stats")
      .then((res) => {
        console.log("📦 Stats response:", res.data);
        setRecentQueries(res.data.recent || []);
        const counts = res.data.file_counts || {};
        console.log("📊 fileCounts raw:", counts);
        setFileCounts(counts);
      })
      .catch((err) => console.error("Stats fetch failed:", err));
  }, []);

  const labels = Object.keys(fileCounts);
  const values = labels.map((type) => Number(fileCounts[type]));

  console.log("📊 Chart Labels:", labels);
  console.log("📊 Chart Values:", values);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Uploaded File Types",
        data: values,
        backgroundColor: "#36a2eb",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">📊 Analytics Dashboard</h2>

      <div className="mb-5">
        <h5>🕵️ Recent Queries</h5>
        <div className="d-flex flex-wrap gap-2">
          {recentQueries.length === 0 ? (
            <span className="text-muted">No queries yet</span>
          ) : (
            recentQueries.map((q, i) => (
              <span key={i} className="badge bg-dark">{q}</span>
            ))
          )}
        </div>
      </div>

      <div className="mb-5">
        <h5>📁 File Type Distribution</h5>
        {labels.length === 0 || values.every((v) => v === 0) ? (
          <p className="text-muted">No uploads yet or data missing</p>
        ) : (
          <div className="p-3 border rounded" style={{ maxHeight: "350px", overflow: "auto" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
