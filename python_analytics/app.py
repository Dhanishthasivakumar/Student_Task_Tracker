from flask import Flask
from flask_cors import CORS
from routes import analytics_bp

app = Flask(__name__)
CORS(app) # Enable CORS for frontend

# Register routes
app.register_blueprint(analytics_bp, url_prefix='/analytics')

if __name__ == '__main__':
    print("Starting Student Analytics Python Service on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
