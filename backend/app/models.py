from app import db
from datetime import datetime

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(120))
    content = db.Column(db.Text)
    file_type = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    summary = db.Column(db.Text)          
    tags = db.Column(db.PickleType)        
    file_path = db.Column(db.String(300))   


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))

class DocumentTag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey("document.id"))
    tag_id = db.Column(db.Integer, db.ForeignKey("tag.id"))

class Embedding(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey("document.id"))
    vector = db.Column(db.PickleType)  # or store as JSON string

class QueryLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    query = db.Column(db.String(200))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
