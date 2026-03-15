import React, { useState, useEffect } from 'react';
import { getStates, getConstituencies, getConstituencyAnalytics } from '../services/api';
import StatsCard from '../components/StatsCard';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Search } from 'lucide-react';

const Analytics = () => {
    const [selection, setSelection] = useState({ state: '', type: 'Parliament', constituency: '' });
    const [states, setStates] = useState([]);
    const [constituencies, setConstituencies] = useState([]);
    const [data, setData] = useState(null);

    useEffect(() => {
        getStates().then(res => setStates(res.data));
    }, []);

    useEffect(() => {
        if (selection.state) {
            getConstituencies(selection.state, selection.type).then(res => setConstituencies(res.data));
        }
    }, [selection.state, selection.type]);

    const handleSearch = () => {
        if (selection.constituency) {
            getConstituencyAnalytics(selection.constituency).then(res => setData(res.data)).catch(() => setData(null));
        }
    };

    const chartData = data ? {
        labels: Object.keys(data.avg_ratings),
        datasets: [{
            label: 'Average Score',
            data: Object.values(data.avg_ratings),
            backgroundColor: 'rgba(16, 185, 129, 0.6)'
        }]
    } : null;

    const pollData = data && data.cm_poll ? {
        labels: Object.keys(data.cm_poll),
        datasets: [{
            data: Object.values(data.cm_poll),
            backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#6366F1'],
        }]
    } : null;

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <select className="w-full px-3 py-2 border rounded-lg"
                            value={selection.state} onChange={e => setSelection({ ...selection, state: e.target.value })}>
                            <option value="">Select State</option>
                            {states.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Election Type</label>
                        <select className="w-full px-3 py-2 border rounded-lg"
                            value={selection.type} onChange={e => setSelection({ ...selection, type: e.target.value })}>
                            <option value="Parliament">Parliament</option>
                            <option value="Assembly">Assembly</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Constituency</label>
                        <select className="w-full px-3 py-2 border rounded-lg"
                            value={selection.constituency} onChange={e => setSelection({ ...selection, constituency: e.target.value })} disabled={!selection.state}>
                            <option value="">Select Constituency</option>
                            {constituencies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
                <button onClick={handleSearch} className="bg-maroon-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-maroon-700 flex items-center">
                    <Search className="mr-2 h-4 w-4" /> Analyze
                </button>
            </div>

            {data ? (
                <div className="space-y-6 animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-800">Analytics for {selection.constituency}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatsCard title="Total Feedback" value={data.total} color="blue" />
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Performance Metrics</h3>
                        <div className="h-80">
                            <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true, max: 5 } } }} />
                        </div>
                    </div>

                    {pollData && (
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-lg font-bold mb-4">Preferred Next CM Poll</h3>
                            <div className="h-80 flex justify-center">
                                <Doughnut data={pollData} options={{ responsive: true, maintainAspectRatio: false }} />
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                    <p className="text-gray-400">Select a constituency and click Analyze to view data.</p>
                </div>
            )}
        </div>
    );
};

export default Analytics;
