from app import create_app, db
from app.models import Document

app = create_app()  # ✅ initialize your Flask app

with app.app_context():
    fixed = 0
    for doc in Document.query.all():
        if not doc.file_type and doc.filename:
            doc.file_type = doc.filename.split('.')[-1].lower()
            fixed += 1
    db.session.commit()
    print(f"✅ Fixed {fixed} missing file_types")
