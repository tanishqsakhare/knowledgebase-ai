# 📚 Knowledgebase AI

**Knowledgebase AI** is a powerful full-stack web application built using **Flask**, **React**, and **SQLite**, designed to streamline document indexing and enable intelligent semantic search. Users can upload files (PDFs, TXTs), explore extracted content, and perform AI-driven queries with sentence-transformer embeddings. It features a sleek analytics dashboard crafted with Chart.js, offering insights into recent searches, file type distributions, and usage trends. The app combines responsive design, practical functionality, and AI integration to deliver an intuitive knowledge management experience.

---

## 🧠 Features

- 🔍 Semantic search using AI embeddings (`sentence-transformers`)
- 📂 File upload support for PDF, TXT documents
- 🗂️ Knowledgebase viewer with indexed document metadata
- 📊 Analytics dashboard built with Chart.js + React
- 🕵️ Recent query history tracking
- 📁 File type distribution graph
- 🏷️ Tag integration (optional)

---

## 🏗️ Tech Stack

| Layer       | Tools Used                                    |
|-------------|------------------------------------------------|
| Frontend    | React, Bootstrap, Chart.js                    |
| Backend     | Flask, Flask-SQLAlchemy, SQLite               |
| AI Model    | SentenceTransformers (`all-MiniLM-L6-v2`)     |
| Dev Tools   | Axios, React Hooks, SQLAlchemy, Werkzeug      |

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python run.py
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

# 📈 Dashboard Preview

- File type bar chart for uploaded documents
- Recent search queries as tags
- Future: Pie chart, tag summary, daily upload trends

---

# 📬 Contact & Contribution

[![LinkedIn](https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/tanishqsakhare)
[![GitHub](https://img.shields.io/badge/GitHub-black?style=for-the-badge&logo=github)](https://github.com/tanishqsakhare)
[![Gmail](https://img.shields.io/badge/Gmail-red?style=for-the-badge&logo=gmail)](mailto:tanishqsakhare@gmail.com)

Feel free to fork, star ⭐, and contribute!

---
