from app import create_app

app = create_app()

if __name__ == "__main__":
    print("✅ Flask is running successfully!")
    app.run(debug=True)
