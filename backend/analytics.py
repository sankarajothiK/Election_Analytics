import pandas as pd
from models import Feedback, db

def get_analytics_summary():
    # Fetch all feedback
    query = Feedback.query.statement
    try:
        with db.engine.connect() as connection:
            df = pd.read_sql(query, connection)
    except Exception as e:
        print(f"Analytics Error: {e}")
        return {'total_feedback': 0, 'error': str(e)}
    
    if df.empty:
        return {
            'total_feedback': 0,
            'top_issues': [],
            'avg_ratings': {}
        }
        
    # Calculate stats
    total = len(df)
    
    # Average ratings
    avg_ratings = {
        'Education': df['education_rating'].mean(),
        'Public Services': df['public_services_rating'].mean(),
        'Crime': df['crime_rating'].mean(),
        'Local Development': df['local_dev_rating'].mean(),
        'Safety': df['safety_rating'].mean()
    }
    
    # Find critical issues (lowest rated)
    # Convert to series
    s_ratings = pd.Series(avg_ratings)
    critical_issues = s_ratings.sort_values().head(3).to_dict()
    
    # Poll Results
    cm_counts = df['preferred_cm'].value_counts().to_dict()
    
    return {
        'total_feedback': total,
        'state_counts': df['state'].value_counts().to_dict(),
        'avg_ratings': avg_ratings,
        'critical_issues': critical_issues,
        'cm_poll': cm_counts
    }

def get_constituency_analytics(constituency_name):
    query = Feedback.query.statement
    try:
        with db.engine.connect() as connection:
            df = pd.read_sql(query, connection)
    except Exception:
        return None
    
    cdf = df[df['constituency'] == constituency_name]
    
    if cdf.empty:
         return None
         
    return {
        'total': len(cdf),
        'avg_ratings': {
            'Education': cdf['education_rating'].mean(),
            'Public Services': cdf['public_services_rating'].mean(),
            'Crime': cdf['crime_rating'].mean(),
            'Local Development': cdf['local_dev_rating'].mean(),
            'Safety': cdf['safety_rating'].mean()
        },
        'cm_poll': cdf['preferred_cm'].value_counts().to_dict()
    }
