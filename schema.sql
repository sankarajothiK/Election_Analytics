DROP TABLE IF EXISTS feedback;

CREATE TABLE feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    election_type TEXT NOT NULL,
    state TEXT NOT NULL,
    constituency TEXT NOT NULL,
    voter_name TEXT NOT NULL,
    voter_id TEXT NOT NULL,
    rating_education INTEGER NOT NULL,
    rating_employment INTEGER NOT NULL,
    rating_development INTEGER NOT NULL,
    rating_safety INTEGER NOT NULL,
    rating_healthcare INTEGER NOT NULL,
    preferred_party TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
