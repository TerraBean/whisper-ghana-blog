// app/admin/page.tsx

import React from 'react';
import Link from 'next/link';

const AdminDashboardPage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
                </div>
            </header>
            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Dashboard Navigation (Top Navigation for now) */}
                    <nav className="mb-4">
                        <ul className="flex space-x-4">
                            <li>
                                <Link href="/admin" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-block">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/create-post" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block">
                                    Create New Post
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/manage-posts" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-block">
                                    Manage Posts
                                </Link>
                            </li>
                            {/* Add more navigation links here in the future */}
                        </ul>
                    </nav>

                    {/* Main Dashboard Content Area */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to the Admin Dashboard!</h2>
                        <p className="text-gray-700">
                            Use the navigation above to manage your blog content.  Currently, only &quot;Create New Post&quot; is functional, but &quot;Manage Posts&quot; and other features will be added in future steps.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;