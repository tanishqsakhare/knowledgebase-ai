from flask import Blueprint, request, jsonify, send_file
from app import db
from app.models import Document, Embedding
from datetime import datetime
import os
import fitz
import numpy as np
from sentence_transformers import SentenceTransformer
from transformers import pipeline
from keybert import KeyBERT
from app.models import Document, Embedding, QueryLog

documents_bp = Blueprint("documents", __name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

model = SentenceTransformer("all-MiniLM-L6-v2")
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
kw_model = KeyBERT()

@documents_bp.route("/upload", methods=["POST"])
def upload_document():
    try:
        file = request.files.get("file")
        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        filename = file.filename
        file_type = filename.split(".")[-1].lower()
        file_path = os.path.abspath(os.path.join(UPLOAD_FOLDER, filename))
        file.save(file_path)

        content = extract_text(file_path, file_type)

        # 📝 Generate summary
        summary = generate_summary(content)

        # 🧠 Auto-tagging
        tags = extract_tags(content)

        doc = Document(
            filename=filename,
            file_path=file_path,
            content=content,
            file_type=file_type,
            summary=summary,
            tags=tags
        )
        db.session.add(doc)
        db.session.flush()  # Capture doc.id before commit

        vector = generate_embedding(content)
        embedding = Embedding(document_id=doc.id, vector=vector)
        db.session.add(embedding)

        db.session.commit()

        return jsonify({"message": "✅ Uploaded", "doc_id": doc.id}), 201

    except Exception as e:
        print("❌ Upload error:", str(e))
        return jsonify({"error": str(e)}), 500

@documents_bp.route("/search", methods=["POST"])
def semantic_search():
    try:
        data = request.json
        query = data.get("query")

        if not query:
            return jsonify({"error": "Missing search query"}), 400
        
        log = QueryLog(query=query)
        db.session.add(log)
        db.session.commit()

        query_vector = model.encode(query, convert_to_numpy=True)
        all_embeddings = Embedding.query.all()
        results = []

        for emb in all_embeddings:
            doc = Document.query.get(emb.document_id)
            if not doc or not emb.vector:
                continue

            score = cosine_similarity(query_vector, np.array(emb.vector))
            results.append({
                "doc_id": doc.id,
                "filename": doc.filename,
                "content_snippet": doc.content[:200] + "...",
                "summary": doc.summary,
                "tags": doc.tags,
                "similarity": round(float(score), 3)
            })

        results.sort(key=lambda x: x["similarity"], reverse=True)
        return jsonify({"matches": results[:5]}), 200

    except Exception as e:
        print("❌ Search error:", str(e))
        return jsonify({"error": str(e)}), 500

def extract_text(path, file_type):
    if file_type == "pdf":
        text = ""
        with fitz.open(path) as pdf:
            for page in pdf:
                text += page.get_text()
        return text
    elif file_type == "txt":
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    else:
        return "❌ Unsupported file type"

def generate_embedding(text):
    embedding = model.encode(text, convert_to_numpy=True)
    return embedding.tolist()

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def generate_summary(text):
    try:
        return summarizer(text[:1000])[0]["summary_text"]
    except:
        return "Summary unavailable."

def extract_tags(text):
    try:
        keywords = kw_model.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words="english")
        return [kw[0] for kw in keywords[:5]]
    except:
        return []

@documents_bp.route("/history", methods=["GET"])
def get_upload_history():
    try:
        docs = Document.query.order_by(Document.created_at.desc()).all()
        results = []
        for doc in docs:
            results.append({
                "id": doc.id,
                "filename": doc.filename,
                "date": doc.created_at.strftime("%B %d"),
                "type": doc.file_type,
                "tags": doc.tags or []
            })
        return jsonify({"uploads": results})
    except Exception as e:
        print("❌ History fetch error:", str(e))
        return jsonify({"error": str(e)}), 500

@documents_bp.route("/delete/<int:doc_id>", methods=["DELETE"])
def delete_document(doc_id):
    try:
        doc = Document.query.get(doc_id)
        if not doc:
            return jsonify({"error": "Document not found"}), 404

        db.session.delete(doc)
        db.session.commit()
        return jsonify({"message": "Deleted successfully"})
    except Exception as e:
        print("❌ Delete error:", str(e))
        return jsonify({"error": str(e)}), 500

@documents_bp.route("/view/<int:doc_id>")
def view_document(doc_id):
    doc = Document.query.get(doc_id)
    if not doc:
        return jsonify({"error": "Document not found"}), 404

    return send_file(doc.file_path, as_attachment=False)

@documents_bp.route("/stats", methods=["GET"])
def get_stats():
    try:
        recent_queries = db.session.query(QueryLog).order_by(QueryLog.timestamp.desc()).limit(5).all()

        file_counts_raw = db.session.query(
            Document.file_type,
            db.func.count()
        ).filter(Document.file_type.isnot(None)).group_by(Document.file_type).all()

        file_counts = {ftype: count for ftype, count in file_counts_raw}

        print("📊 File counts:", file_counts)
        print("📊 file_counts raw:", file_counts_raw)
        print("📊 Converted file_counts:", file_counts)


        return jsonify({
            "recent": [q.query for q in recent_queries],
            "file_counts": file_counts
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        print("❌ Stats error:", str(e))
        return jsonify({"error": str(e)}), 500


@documents_bp.route("/dev/fix-filetypes")
def fix_filetypes():
    fixed = 0
    for doc in Document.query.all():
        if not doc.file_type and doc.filename:
            doc.file_type = doc.filename.split(".")[-1].lower()
            fixed += 1
    db.session.commit()
    return f"✅ Fixed {fixed} missing file types"
