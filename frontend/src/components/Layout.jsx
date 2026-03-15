import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Vote, BarChart2, MessageSquare, Home } from 'lucide-react';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-maroon-600 text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Vote className="h-8 w-8 text-gold-400 mr-2" />
                            <span className="font-bold text-xl tracking-tight text-white">Election Analytics</span>
                        </div>
                        <div className="flex space-x-4">
                            <Link to="/" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gold-400 hover:text-maroon-800 transition">
                                <Home className="h-4 w-4 mr-2" /> Home
                            </Link>
                            <Link to="/feedback" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gold-400 hover:text-maroon-800 transition">
                                <MessageSquare className="h-4 w-4 mr-2" /> Give Feedback
                            </Link>
                            <Link to="/analytics" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gold-400 hover:text-maroon-800 transition">
                                <BarChart2 className="h-4 w-4 mr-2" /> View Analytics
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <Outlet />
            </main>
            <footer className="bg-gray-800 text-white py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm text-gray-400">© 2026 Election Analytics System. Final Year Project.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
