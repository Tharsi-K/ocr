import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function AdminPanel() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="p-5 w-full md:w-1/4 border-b-2 md:border-r-2 md:min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">Admin Navigation</h2>
        <nav className="flex flex-col gap-4">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              isActive ? 'text-blue-500 font-semibold' : 'text-gray-700'
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="manage-users"
            className={({ isActive }) =>
              isActive ? 'text-blue-500 font-semibold' : 'text-gray-700'
            }
          >
            Manage Users
          </NavLink>
          <NavLink
            to="manage-books"
            className={({ isActive }) =>
              isActive ? 'text-blue-500 font-semibold' : 'text-gray-700'
            }
          >
            Manage Books
          </NavLink>
          <NavLink
            to="settings"
            className={({ isActive }) =>
              isActive ? 'text-blue-500 font-semibold' : 'text-gray-700'
            }
          >
            Settings
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-7">
        <Outlet />
      </div>
    </div>
  );
}