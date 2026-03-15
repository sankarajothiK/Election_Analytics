from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class State(db.Model):
    __tablename__ = 'state'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    constituencies = db.relationship('Constituency', backref='state', lazy=True)

class Constituency(db.Model):
    __tablename__ = 'constituency'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(20), nullable=False) # 'Parliament' or 'Assembly'
    state_id = db.Column(db.Integer, db.ForeignKey('state.id'), nullable=False)

class Feedback(db.Model):
    __tablename__ = 'feedback'
    
    id = db.Column(db.Integer, primary_key=True)
    voter_id_hash = db.Column(db.String(64), nullable=False) # SHA-256 hash
    election_type = db.Column(db.String(20), nullable=False) # 'Parliament' or 'Assembly'
    state = db.Column(db.String(50), nullable=False)
    constituency = db.Column(db.String(100), nullable=False)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Ratings (1-5)
    education_rating = db.Column(db.Integer)
    education_text = db.Column(db.Text)
    
    public_services_rating = db.Column(db.Integer)
    public_services_text = db.Column(db.Text)
    
    crime_rating = db.Column(db.Integer)
    crime_text = db.Column(db.Text)
    
    local_dev_rating = db.Column(db.Integer)
    local_dev_text = db.Column(db.Text)
    
    safety_rating = db.Column(db.Integer)
    safety_text = db.Column(db.Text)
    
    # New Field
    preferred_cm = db.Column(db.String(20)) # TVK, DMK, ADMK, NTK

    __table_args__ = (
        db.UniqueConstraint('voter_id_hash', 'election_type', name='unique_voter_feedback'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'election_type': self.election_type,
            'state': self.state,
            'constituency': self.constituency,
            'submitted_at': self.submitted_at.isoformat(),
            'ratings': {
                'education': self.education_rating,
                'public_services': self.public_services_rating,
                'crime': self.crime_rating,
                'local_dev': self.local_dev_rating,
                'safety': self.safety_rating
            }
        }
