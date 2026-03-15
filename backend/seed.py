from app import create_app, db
from models import State, Constituency, Feedback
from data import DATA
import random
import hashlib

app = create_app()

def seed_data():
    with app.app_context():
        db.create_all()
        
        print("Starting comprehensive seed...")
        
        for state_name, elections in DATA.items():
            # Check or Create State
            state = State.query.filter_by(name=state_name).first()
            if not state:
                state = State(name=state_name)
                db.session.add(state)
                db.session.commit()
                # print(f"Created State: {state_name}")
            
            # Add Parliament Constituencies
            if "Parliament" in elections:
                for c_name in elections["Parliament"]:
                    exists = Constituency.query.filter_by(name=c_name, type='Parliament', state_id=state.id).first()
                    if not exists:
                        db.session.add(Constituency(name=c_name, type='Parliament', state_id=state.id))
            
            # Add Assembly Constituencies
            if "Assembly" in elections:
                for c_name in elections["Assembly"]:
                    exists = Constituency.query.filter_by(name=c_name, type='Assembly', state_id=state.id).first()
                    if not exists:
                        db.session.add(Constituency(name=c_name, type='Assembly', state_id=state.id))
            
            db.session.commit()
        
        print("All States and Constituencies seeded successfully.")
        
        # Add sample feedback data
        feedback_count = Feedback.query.count()
        if feedback_count == 0:
            print("Adding sample feedback data...")
            
            states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat']
            constituencies = ['North Mumbai', 'South Delhi', 'Bangalore Central', 'Chennai East', 'Ahmedabad']
            cm_candidates = ['Candidate A', 'Candidate B', 'Candidate C', 'Candidate D']
            
            for i in range(20):
                state = random.choice(states)
                constituency = random.choice(constituencies)
                
                voter_id = f"VOTER_{i:04d}"
                voter_hash = hashlib.sha256(voter_id.encode()).hexdigest()
                
                feedback = Feedback(
                    voter_id_hash=voter_hash,
                    election_type=random.choice(['Assembly', 'Parliament']),
                    state=state,
                    constituency=constituency,
                    education_rating=random.randint(1, 5),
                    public_services_rating=random.randint(1, 5),
                    crime_rating=random.randint(1, 5),
                    local_dev_rating=random.randint(1, 5),
                    safety_rating=random.randint(1, 5),
                    preferred_cm=random.choice(cm_candidates),
                    comments=f"Sample feedback #{i+1}"
                )
                db.session.add(feedback)
            
            db.session.commit()
            print("Sample feedback data added successfully.")
        
        count = Feedback.query.count()
        print(f"Total feedback count: {count}")

if __name__ == '__main__':
    seed_data()
