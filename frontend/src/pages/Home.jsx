import React, { useEffect, useState } from 'react';
import { getSummary } from '../services/api';
import StatsCard from '../components/StatsCard';
import { Users, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Home = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSummary()
            .then(res => setSummary(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    if (!summary) return <div className="text-center text-red-500">Failed to load data.</div>;

    const barData = {
        labels: Object.keys(summary.avg_ratings || {}),
        datasets: [{
            label: 'Average Rating (1-5)',
            data: Object.values(summary.avg_ratings || {}),
            backgroundColor: 'rgba(128, 0, 0, 0.7)',
            borderColor: 'rgb(128, 0, 0)',
            borderWidth: 1
        }]
    };

    // Top issues logic (lowest rated)
    const criticalLabels = Object.keys(summary.critical_issues || {});
    const criticalData = Object.values(summary.critical_issues || {});

    const pieData = {
        labels: criticalLabels,
        datasets: [{
            data: criticalData,
            backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#6366F1', '#8B5CF6'],
        }]
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-maroon-700 mb-2">Dashboard Overview</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">Real-time insights into election feedback and governance issues across constituencies.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Feedback" value={summary.total_feedback} icon={Users} color="blue" />
                <StatsCard title="States Covered" value={Object.keys(summary.state_counts || {}).length} icon={TrendingUp} color="green" />
                <StatsCard title="Critical Issues" value="3" icon={AlertTriangle} color="red" />
                <StatsCard title="Avg Engagement" value="High" icon={FileText} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Issue Rating Distribution</h3>
                    <div className="h-64">
                        <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 5 } } }} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Critical Concerns (Lowest Rated)</h3>
                    <div className="h-64 flex justify-center">
                        <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
