'use client';

import React from 'react';
import AdminTabsLayout from '../AdminTabsLayout';

// A demo admin dashboard with no authentication requirements for testing only
export default function AdminDemoPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Demo</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <p className="mb-4">This is a demo admin page for testing tab navigation.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Demo Content Cards */}
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 shadow">
            <h3 className="font-bold text-lg text-blue-700 dark:text-blue-300">Create Post</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Create new blog content.</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6 shadow">
            <h3 className="font-bold text-lg text-green-700 dark:text-green-300">Manage Posts</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Edit and delete existing posts.</p>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-6 shadow">
            <h3 className="font-bold text-lg text-amber-700 dark:text-amber-300">Manage Users</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Add or remove user accounts.</p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <h2>Tab Navigation Instructions</h2>
          <p>
            This demo page includes the new AdminTabsLayout component which adds 
            persistent tabs at the top of admin pages. The tabs should remain visible
            when navigating between different admin sections.
          </p>
          <ul>
            <li>Click on different tabs to test navigation</li>
            <li>Tabs should stay visible across page transitions</li>
            <li>Active tab should be highlighted</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
