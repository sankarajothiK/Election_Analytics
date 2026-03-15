from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config
from models import db, Feedback, State, Constituency
import hashlib

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app) # Enable CORS for frontend
    db.init_app(app)
    
    with app.app_context():
        # Create tables if they don't exist
        # In production, use migrations (Alembic)
        try:
           db.create_all()
           print("Database initialized successfully.")
        except Exception as e:
           print(f"Error initializing database: {e}")
           print("Make sure your MySQL server is running and the database 'election_db' exists.")

    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy', 'database': app.config['SQLALCHEMY_DATABASE_URI'].split('://')[0]})

    @app.route('/', methods=['GET'])
    def index():
        return jsonify({'message': 'Election Analytics API is running. Access endpoints at /api/...'}), 200

    @app.route('/api/feedback', methods=['POST'])
    def submit_feedback():
        data = request.json
        
        # Basic validation
        required_fields = ['voter_id', 'election_type', 'state', 'constituency', 'ratings', 'preferred_cm']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        # Hash Voter ID
        voter_id = data['voter_id']
        voter_hash = hashlib.sha256(voter_id.encode()).hexdigest()
        
        # Check for duplicate
        existing = Feedback.query.filter_by(voter_id_hash=voter_hash, election_type=data['election_type']).first()
        if existing:
            return jsonify({'error': 'You have already submitted feedback for this election.'}), 409
            
        try:
            ratings = data.get('ratings', {})
            feedback = Feedback(
                voter_id_hash=voter_hash,
                election_type=data['election_type'],
                state=data['state'],
                constituency=data['constituency'],
                
                education_rating=ratings.get('education', {}).get('rating'),
                education_text=ratings.get('education', {}).get('text'),
                
                public_services_rating=ratings.get('public_services', {}).get('rating'),
                public_services_text=ratings.get('public_services', {}).get('text'),
                
                crime_rating=ratings.get('crime', {}).get('rating'),
                crime_text=ratings.get('crime', {}).get('text'),
                
                local_dev_rating=ratings.get('local_dev', {}).get('rating'),
                local_dev_text=ratings.get('local_dev', {}).get('text'),
                
                safety_rating=ratings.get('safety', {}).get('rating'),
                safety_text=ratings.get('safety', {}).get('text'),
                
                preferred_cm=data.get('preferred_cm')
            )
            
            db.session.add(feedback)
            db.session.commit()
            
            return jsonify({'message': 'Feedback submitted successfully', 'id': feedback.id}), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    @app.route('/api/states', methods=['GET'])
    def get_states():
        states = State.query.all()
        return jsonify([{'id': s.id, 'name': s.name} for s in states])

    @app.route('/api/constituencies/<state_name>/<max_type>', methods=['GET'])
    def get_constituencies(state_name, max_type):
        # type is 'Parliament' or 'Assembly'
        state = State.query.filter_by(name=state_name).first()
        if not state:
            return jsonify([]), 404
        
        consts = Constituency.query.filter_by(state_id=state.id, type=max_type).all()
        return jsonify([{'id': c.id, 'name': c.name} for c in consts])

    @app.route('/api/analytics/summary', methods=['GET'])
    def get_summary():
        from analytics import get_analytics_summary
        try:
            data = get_analytics_summary()
            return jsonify(data)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/analytics/constituency/<path:c_name>', methods=['GET'])
    def get_const_analytics(c_name):
        from analytics import get_constituency_analytics
        try:
            data = get_constituency_analytics(c_name)
            if not data:
                return jsonify({'message': 'No data found'}), 404
            return jsonify(data)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
