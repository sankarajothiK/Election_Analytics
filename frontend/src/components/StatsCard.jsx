import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        red: 'bg-red-100 text-red-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        purple: 'bg-purple-100 text-purple-600'
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className={`p-3 rounded-full ${colorClasses[color] || colorClasses.blue}`}>
                {Icon && <Icon className="h-6 w-6" />}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
};

export default StatsCard;
