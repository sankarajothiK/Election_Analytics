import os
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import pandas as pd
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = 'supersecretkey_for_election_analytics'

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client['election_analytics_db']
feedback_collection = db['feedback']
contact_collection = db['contact']

# Ensure voter_id is unique
feedback_collection.create_index("voter_id", unique=True)


@app.route('/')
def home():
    state = request.args.get('state', 'all')
    constituency = request.args.get('constituency', 'all')

    query = {}
    if state and state != 'all':
        query["state"] = state
    if constituency and constituency != 'all':
        query["constituency"] = constituency

    # Get total feedback collected
    total_feedback = feedback_collection.count_documents(query)
    
    # Get total distinct states
    total_states = len(feedback_collection.distinct("state"))
    
    # Get total distinct constituencies
    total_constituencies = len(feedback_collection.distinct("constituency"))
    
    issues = ['education_rating', 'healthcare_rating', 'employment_rating', 'crime_rating', 'development_rating', 'infrastructure_rating', 'water_rating']
    most_important_issue = "N/A"
    
    if total_feedback > 0:
        pipeline = []
        if query:
            pipeline.append({"$match": query})
            
        pipeline.append({
            "$group": {
                "_id": None,
                "avg_education_rating": {"$avg": "$education_rating"},
                "avg_healthcare_rating": {"$avg": "$healthcare_rating"},
                "avg_employment_rating": {"$avg": "$employment_rating"},
                "avg_crime_rating": {"$avg": "$crime_rating"},
                "avg_development_rating": {"$avg": "$development_rating"},
                "avg_infrastructure_rating": {"$avg": "$infrastructure_rating"},
                "avg_water_rating": {"$avg": "$water_rating"}
            }
        })
        
        result = list(feedback_collection.aggregate(pipeline))
        if result:
            avgs = result[0]
            del avgs['_id']
            
            # Find the issue with the lowest average rating
            min_issue = min(avgs, key=avgs.get)
            issue_names = {
                'avg_education_rating': 'Education',
                'avg_healthcare_rating': 'Healthcare',
                'avg_employment_rating': 'Employment',
                'avg_crime_rating': 'Crime & Safety',
                'avg_development_rating': 'Local Development',
                'avg_infrastructure_rating': 'Infrastructure',
                'avg_water_rating': 'Water Supply'
            }
            most_important_issue = issue_names.get(min_issue, "N/A")

    return render_template('home.html', 
                          total_feedback=total_feedback,
                          total_states=total_states,
                          total_constituencies=total_constituencies,
                          most_important_issue=most_important_issue,
                          selected_state=state,
                          selected_constituency=constituency)

@app.route('/feedback')
def feedback():
    return render_template('feedback.html')

@app.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    if request.method == 'POST':
        name = request.form.get('name')
        voter_id = request.form.get('voter_id')
        election_type = request.form.get('election_type')
        state = request.form.get('state')
        constituency = request.form.get('constituency')
        
        # Handle "Other" constituency
        if constituency == 'Other':
            constituency = request.form.get('constituency_other', '').strip()
        
        try:
           education = int(request.form.get('education_rating'))
           healthcare = int(request.form.get('healthcare_rating'))
           employment = int(request.form.get('employment_rating'))
           crime = int(request.form.get('crime_rating'))
           development = int(request.form.get('development_rating'))
           infrastructure = int(request.form.get('infrastructure_rating'))
           water = int(request.form.get('water_rating'))
           
           # New Issues
           electricity = int(request.form.get('electricity_rating'))
           transport = int(request.form.get('transport_rating'))
           womensafety = int(request.form.get('womensafety_rating'))
           agriculture = int(request.form.get('agriculture_rating'))
           housing = int(request.form.get('housing_rating'))
           
        except (ValueError, TypeError):
           flash('Invalid rating values.', 'danger')
           return redirect(url_for('feedback'))

        preferred_leader = request.form.get('preferred_leader')

        feedback_data = {
            "name": name,
            "voter_id": voter_id,
            "election_type": election_type,
            "state": state,
            "constituency": constituency,
            "education_rating": education,
            "healthcare_rating": healthcare,
            "employment_rating": employment,
            "crime_rating": crime,
            "development_rating": development,
            "infrastructure_rating": infrastructure,
            "water_rating": water,
            "electricity_rating": electricity,
            "transport_rating": transport,
            "womensafety_rating": womensafety,
            "agriculture_rating": agriculture,
            "housing_rating": housing,
            "preferred_leader": preferred_leader
        }

        try:
            feedback_collection.insert_one(feedback_data)
            flash('Your feedback has been successfully submitted!', 'success')
            return redirect(url_for('home'))
        except DuplicateKeyError:
            flash('Error: Duplicate Voter ID. This voter ID has already submitted feedback.', 'danger')
            return redirect(url_for('feedback'))

@app.route('/analytics')
def analytics():
    election_type = request.args.get('election_type')
    state = request.args.get('state')
    constituency = request.args.get('constituency')
    issue_filter = request.args.get('issue', 'all')
    
    query = {}
    
    if election_type:
        query["election_type"] = election_type
    if state and state != 'all':
        query["state"] = state
    if constituency and constituency != 'all':
        query["constituency"] = constituency
        
    cursor = feedback_collection.find(query)
    df = pd.DataFrame(list(cursor))
    
    if df.empty:
        return render_template('analytics.html', 
                               has_data=False,
                               total_feedback=0,
                               filters={'election_type': election_type, 'state': state, 'constituency': constituency, 'issue': issue_filter})

    # Total Feedback
    total_feedback = len(df)
    
    # Leader Distribution
    leader_counts = df['preferred_leader'].value_counts().to_dict()
    
    # Issue Averages
    issue_averages = {
        'Education': round(df['education_rating'].mean(), 2),
        'Healthcare': round(df['healthcare_rating'].mean(), 2),
        'Employment': round(df['employment_rating'].mean(), 2),
        'Crime': round(df['crime_rating'].mean(), 2),
        'Development': round(df['development_rating'].mean(), 2),
        'Infrastructure': round(df['infrastructure_rating'].mean(), 2),
        'Water': round(df['water_rating'].mean(), 2),
        'Electricity': round(df['electricity_rating'].mean(), 2),
        'Public Transport': round(df['transport_rating'].mean(), 2),
        'Women Safety': round(df['womensafety_rating'].mean(), 2),
        'Agriculture': round(df['agriculture_rating'].mean(), 2),
        'Housing': round(df['housing_rating'].mean(), 2)
    }
    
    # Deep Analytics: Rating Distribution & Satisfaction Index
    ratings_df = df[['education_rating', 'healthcare_rating', 'employment_rating', 'crime_rating', 'development_rating', 'infrastructure_rating', 'water_rating', 'electricity_rating', 'transport_rating', 'womensafety_rating', 'agriculture_rating', 'housing_rating']]
    rating_counts = ratings_df.melt(value_name='rating')['rating'].value_counts().sort_index().to_dict()
    rating_distribution = {i: int(rating_counts.get(i, 0)) for i in range(1, 6)}
    
    overall_mean = ratings_df.mean().mean()
    satisfaction_index = round((overall_mean / 5.0) * 100, 1) if not pd.isna(overall_mean) else 0
    
    # Issue-wise Rating Breakdown
    issue_names_mapping = {
        'education_rating': 'Education',
        'healthcare_rating': 'Healthcare',
        'employment_rating': 'Employment',
        'crime_rating': 'Crime',
        'development_rating': 'Development',
        'infrastructure_rating': 'Infrastructure',
        'water_rating': 'Water',
        'electricity_rating': 'Electricity',
        'transport_rating': 'Public Transport',
        'womensafety_rating': 'Women Safety',
        'agriculture_rating': 'Agriculture',
        'housing_rating': 'Housing'
    }
    issue_rating_breakdown = {}
    for col, name in issue_names_mapping.items():
        counts = df[col].value_counts().to_dict()
        issue_rating_breakdown[name] = {str(i): int(counts.get(i, 0)) for i in range(1, 6)}
    
    # Top and Bottom Issues
    sorted_issues = sorted(issue_averages.items(), key=lambda x: x[1])
    critical_issue = sorted_issues[0] if sorted_issues else ("N/A", 0)
    best_issue = sorted_issues[-1] if sorted_issues else ("N/A", 0)
    
    # Extra Analytics 1: Supporter Satisfaction Index
    leader_satisfaction = {}
    for leader in df['preferred_leader'].dropna().unique():
        leader_df = df[df['preferred_leader'] == leader]
        leader_ratings = leader_df[['education_rating', 'healthcare_rating', 'employment_rating', 'crime_rating', 'development_rating', 'infrastructure_rating', 'water_rating', 'electricity_rating', 'transport_rating', 'womensafety_rating', 'agriculture_rating', 'housing_rating']]
        leader_mean = leader_ratings.mean().mean()
        leader_satisfaction[leader] = round((leader_mean / 5.0) * 100, 1) if not pd.isna(leader_mean) else 0
        
    # Extra Analytics 2: Top 5 Engaging Constituencies
    top_constituencies = df['constituency'].value_counts().head(5).to_dict()
    
    if issue_filter and issue_filter != 'all':
        issue_averages = {k: v for k, v in issue_averages.items() if k == issue_filter}
        issue_rating_breakdown = {k: v for k, v in issue_rating_breakdown.items() if k == issue_filter}
        
    return render_template('analytics.html',
                           has_data=True,
                           total_feedback=total_feedback,
                           leader_counts=leader_counts,
                           issue_averages=issue_averages,
                           rating_distribution=rating_distribution,
                           satisfaction_index=satisfaction_index,
                           issue_rating_breakdown=issue_rating_breakdown,
                           critical_issue=critical_issue,
                           best_issue=best_issue,
                           leader_satisfaction=leader_satisfaction,
                           top_constituencies=top_constituencies,
                           filters={'election_type': election_type, 'state': state, 'constituency': constituency, 'issue': issue_filter})

@app.route('/api/general_stats')
def api_general_stats():
    state = request.args.get('state', 'all')
    constituency = request.args.get('constituency', 'all')

    query = {}
    if state and state != 'all':
        query["state"] = state
    if constituency and constituency != 'all':
        query["constituency"] = constituency

    # Return JSON data for frontend Chart.js rendering
    cursor = feedback_collection.find(query)
    df = pd.DataFrame(list(cursor))
    
    if df.empty:
         return jsonify({"has_data": False})
         
    # Leader Support Overall
    leader_counts = df['preferred_leader'].value_counts().to_dict()
    
    # Issue Averages Overall
    issue_averages = {
        'Education Quality': round(df['education_rating'].mean(), 2),
        'Healthcare Facilities': round(df['healthcare_rating'].mean(), 2),
        'Employment Opportunities': round(df['employment_rating'].mean(), 2),
        'Crime & Safety': round(df['crime_rating'].mean(), 2),
        'Local Development': round(df['development_rating'].mean(), 2),
        'Road & Infrastructure': round(df['infrastructure_rating'].mean(), 2),
        'Water Supply': round(df['water_rating'].mean(), 2),
        'Electricity & Power': round(df['electricity_rating'].mean(), 2),
        'Public Transport': round(df['transport_rating'].mean(), 2),
        'Women\'s Safety': round(df['womensafety_rating'].mean(), 2),
        'Agriculture & Farming': round(df['agriculture_rating'].mean(), 2),
        'Housing & Land': round(df['housing_rating'].mean(), 2)
    }
    
    ratings_df = df[['education_rating', 'healthcare_rating', 'employment_rating', 'crime_rating', 'development_rating', 'infrastructure_rating', 'water_rating', 'electricity_rating', 'transport_rating', 'womensafety_rating', 'agriculture_rating', 'housing_rating']]
    overall_mean = ratings_df.mean().mean()
    satisfaction_index = round((overall_mean / 5.0) * 100, 1) if not pd.isna(overall_mean) else 0
    rating_counts = ratings_df.melt(value_name='rating')['rating'].value_counts().sort_index().to_dict()
    rating_distribution = {i: int(rating_counts.get(i, 0)) for i in range(1, 6)}
    
    issue_names_mapping_api = {
        'education_rating': 'Education Quality',
        'healthcare_rating': 'Healthcare Facilities',
        'employment_rating': 'Employment Opportunities',
        'crime_rating': 'Crime & Safety',
        'development_rating': 'Local Development',
        'infrastructure_rating': 'Road & Infrastructure',
        'water_rating': 'Water Supply',
        'electricity_rating': 'Electricity & Power',
        'transport_rating': 'Public Transport',
        'womensafety_rating': 'Women\'s Safety',
        'agriculture_rating': 'Agriculture & Farming',
        'housing_rating': 'Housing & Land'
    }
    issue_rating_breakdown = {}
    for col, name in issue_names_mapping_api.items():
        counts = df[col].value_counts().to_dict()
        issue_rating_breakdown[name] = {str(i): int(counts.get(i, 0)) for i in range(1, 6)}
    
    return jsonify({
        "has_data": True,
        "leader_counts": leader_counts,
        "issue_averages": issue_averages,
        "satisfaction_index": satisfaction_index,
        "rating_distribution": rating_distribution,
        "issue_rating_breakdown": issue_rating_breakdown
    })

@app.route('/api/map_analytics_data')
def api_map_analytics_data():
    """
    Returns data for the Interactive Map Engine:
    - If no state provided: returns feedback counts per state for the India Map.
    - If state provided: returns list of constituencies in that state that have data.
    """
    state = request.args.get('state')
    
    if not state:
        # Phase 1: India Map (Need state-wise counts)
        pipeline = [
            {"$group": {"_id": "$state", "count": {"$sum": 1}}}
        ]
        result = list(feedback_collection.aggregate(pipeline))
        state_counts = {item['_id']: item['count'] for item in result if item['_id']}
        return jsonify({"level": "india", "data": state_counts})
    else:
        # Phase 2: State Grid (Need constituencies for the selected state)
        pipeline = [
            {"$match": {"state": state}},
            {"$group": {"_id": "$constituency", "count": {"$sum": 1}}}
        ]
        result = list(feedback_collection.aggregate(pipeline))
        # Sort constituencies alphabetically
        constituencies = sorted([{"name": item['_id'], "count": item['count']} for item in result if item['_id']], key=lambda x: x['name'])
        return jsonify({"level": "state", "state": state, "data": constituencies})

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        contact_data = {
            "name": name,
            "email": email,
            "message": message
        }
        contact_collection.insert_one(contact_data)
        
        flash('Thank you for contacting us. We have received your message.', 'success')
        return redirect(url_for('contact'))
        
    return render_template('contact.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
