import sys
print(f"Python: {sys.version}")

try:
    import flask
    import flask_cors
    import pandas as pd
    import sqlalchemy
    import mysql.connector
    print("Dependencies: OK")
except ImportError as e:
    print(f"Missing Dependency: {e}")
    sys.exit(1)

from app import create_app, db
from models import Feedback

try:
    app = create_app()
    with app.app_context():
        count = Feedback.query.count()
        print(f"Database Connection: OK")
        print(f"Feedback Count: {count}")
        
        from analytics import get_analytics_summary
        print("Testing Analytics Summary...")
        summary = get_analytics_summary()
        print(f"Analytics Summary Keys: {list(summary.keys())}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
