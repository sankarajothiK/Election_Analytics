from app import create_app
from models import Feedback

app = create_app()

with app.app_context():
    print("Feedback columns:")
    for col in Feedback.__table__.columns:
        print(col.name)
    
    try:
        f = Feedback(preferred_cm='TVK', voter_id_hash='test', election_type='P', state='S', constituency='C')
        print("Instantiation successful!")
    except Exception as e:
        print(f"Instantiation failed: {e}")
