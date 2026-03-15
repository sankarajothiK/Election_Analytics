from app import create_app, db
from models import Feedback
import hashlib
import sys

app = create_app()

def test_submission():
    with app.app_context():
        # Create a sample payload
        data = {
            'voter_id': 'DEBUG_USER_9992', # Unique ID
            'election_type': 'Assembly',
            'state': 'Tamil Nadu',
            'constituency': 'Tenkasi',
            'preferred_cm': 'TVK',
            'ratings': {
                'education': {'rating': 4, 'text': 'Good'},
                'public_services': {'rating': 3, 'text': 'Average'},
                'crime': {'rating': 5, 'text': 'Safe'},
                'local_dev': {'rating': 2, 'text': 'Bad'},
                'safety': {'rating': 5, 'text': 'Secure'}
            }
        }

        print("Testing submission with data:", data)

        # Hash Voter ID
        voter_id = data['voter_id']
        voter_hash = hashlib.sha256(voter_id.encode()).hexdigest()
        
        # Check for duplicate
        existing = Feedback.query.filter_by(voter_id_hash=voter_hash, election_type=data['election_type']).first()
        if existing:
            print("Error: Duplicate feedback found.")
            return
            
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
            
            print("Success! Feedback ID:", feedback.id)
            
            # Verify it's in the DB
            saved = Feedback.query.get(feedback.id)
            print(f"Verified Retrieval: {saved.preferred_cm}")
            
        except Exception as e:
            db.session.rollback()
            print("Exception caught:", e)
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    test_submission()
