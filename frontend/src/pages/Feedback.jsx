import React, { useState, useEffect } from 'react';
import { getStates, getConstituencies, submitFeedback } from '../services/api';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const FeedbackForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        voter_id: '',
        election_type: 'Parliament',
        state: '',
        constituency: '',
        ratings: {
            education: { rating: 5, text: '' },
            public_services: { rating: 5, text: '' },
            crime: { rating: 5, text: '' },
            local_dev: { rating: 5, text: '' },
            safety: { rating: 5, text: '' }
        }
    });

    const [states, setStates] = useState([]);
    const [constituencies, setConstituencies] = useState([]);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        getStates().then(res => setStates(res.data));
    }, []);

    useEffect(() => {
        if (formData.state && formData.election_type) {
            getConstituencies(formData.state, formData.election_type).then(res => setConstituencies(res.data));
        }
    }, [formData.state, formData.election_type]);

    const handleRatingChange = (category, field, value) => {
        setFormData(prev => ({
            ...prev,
            ratings: {
                ...prev.ratings,
                [category]: {
                    ...prev.ratings[category],
                    [field]: value
                }
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Submitting...' });
        try {
            await submitFeedback(formData);
            setStatus({ type: 'success', message: 'Feedback submitted successfully!' });
            // Reset crucial fields
            setFormData(prev => ({ ...prev, voter_id: '', ratings: { ...prev.ratings } }));
        } catch (err) {
            console.error(err);
            let msg = 'Submission failed. Please try again.';
            if (err.response && err.response.data && err.response.data.error) {
                msg = err.response.data.error;
            } else if (err.message === 'Network Error') {
                msg = 'Cannot connect to server. Please ensure the backend is running.';
            }
            setStatus({ type: 'error', message: msg });
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-maroon-600 px-8 py-6 text-white">
                <h2 className="text-2xl font-bold">Submit Your Feedback</h2>
                <p className="text-yellow-200 mt-1">Make your voice heard for a better democracy.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {status.message && (
                    <div className={`p-4 rounded-lg flex items-center ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {status.type === 'success' ? <CheckCircle className="mr-2" /> : <AlertCircle className="mr-2" />}
                        {status.message}
                    </div>
                )}

                {/* Personal & Location Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-maroon-600 outline-none"
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Voter ID</label>
                        <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-maroon-600 outline-none"
                            value={formData.voter_id} onChange={e => setFormData({ ...formData, voter_id: e.target.value })} placeholder="Ex: ABC1234567" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Election Type</label>
                        <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-maroon-600 outline-none"
                            value={formData.election_type} onChange={e => setFormData({ ...formData, election_type: e.target.value })}>
                            <option value="Parliament">Parliament (Paaralumandram)</option>
                            <option value="Assembly">Assembly (Sattamandram)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <select required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-maroon-600 outline-none"
                            value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })}>
                            <option value="">Select State</option>
                            {states.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Constituency</label>
                        <select required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-maroon-600 outline-none"
                            value={formData.constituency} onChange={e => setFormData({ ...formData, constituency: e.target.value })} disabled={!formData.state}>
                            <option value="">Select Constituency</option>
                            {constituencies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Ratings */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800">Rate Governance Issues</h3>
                    {Object.keys(formData.ratings).map(cat => (
                        <div key={cat} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <span className="font-semibold text-gray-700 capitalize w-48">{cat.replace('_', ' ')}</span>
                                <div className="flex items-center space-x-4">
                                    <label className="text-sm text-gray-500">Rating:</label>
                                    <input type="range" min="1" max="5" className="w-32 h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer accent-maroon-600"
                                        value={formData.ratings[cat].rating} onChange={e => handleRatingChange(cat, 'rating', parseInt(e.target.value))} />
                                    <span className={`font-bold text-lg ${formData.ratings[cat].rating < 3 ? 'text-red-500' : 'text-green-500'}`}>{formData.ratings[cat].rating}/5</span>
                                </div>
                                <input type="text" placeholder="Optional comments..." className="flex-grow px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-maroon-600"
                                    value={formData.ratings[cat].text} onChange={e => handleRatingChange(cat, 'text', e.target.value)} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Preferred CM Poll */}
                <div className="bg-maroon-50 p-6 rounded-xl border border-maroon-100">
                    <h3 className="text-xl font-bold text-maroon-800 mb-4">Who is your preferred next Chief Minister?</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['TVK', 'DMK', 'ADMK', 'NTK'].map(party => (
                            <div key={party}
                                onClick={() => setFormData({ ...formData, preferred_cm: party })}
                                className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all transform hover:scale-105 ${formData.preferred_cm === party ? 'border-maroon-600 bg-yellow-100 shadow-md' : 'border-gray-200 bg-white hover:border-yellow-300'}`}>
                                <div className="h-20 w-20 mx-auto bg-gray-200 rounded-full mb-3 flex items-center justify-center text-gray-500 font-bold overflow-hidden">
                                    {/* Placeholder for Party Image */}
                                    {party}
                                </div>
                                <p className="font-bold text-gray-800">{party}</p>
                            </div>
                        ))}
                    </div>
                    {!formData.preferred_cm && <p className="text-sm text-red-500 mt-2">* Please select an option.</p>}
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-maroon-600 hover:bg-maroon-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg flex items-center transition transform hover:scale-105"
                        disabled={!formData.preferred_cm}>
                        <Send className="mr-2 h-5 w-5" /> Submit Feedback
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FeedbackForm;
