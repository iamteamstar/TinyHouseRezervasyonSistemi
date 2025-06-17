import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getRoleName } from '../utils/helpers';
import { User, Mail, UserCheck, Calendar, Home, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES, DEFAULT_AVATAR } from '../utils/constants';

const ProfilePage = () => {
  const { currentUser, logout, isAdmin, isHouseOwner, isTenant } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Profile</h1>
          <p className="text-slate-600">Manage your account details and settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Profile Information */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 text-slate-800">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary-50 rounded-full">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Full Name</h3>
                  <p className="mt-1 text-slate-900">{currentUser.fullName}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary-50 rounded-full">
                  <Mail className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Email Address</h3>
                  <p className="mt-1 text-slate-900">{currentUser.email}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary-50 rounded-full">
                  <UserCheck className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Account Type</h3>
                  <p className="mt-1 text-slate-900">{getRoleName(currentUser.roleId)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-slate-800">Account Settings</h2>
            
            <div className="space-y-4">
              <div className="p-4 border border-slate-200 rounded-md">
                <h3 className="font-medium text-slate-800 mb-1">Account Security</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Manage your account password and security settings
                </p>
                <button className="btn btn-outline">Change Password</button>
              </div>
              
              <div className="p-4 border border-slate-200 rounded-md">
                <h3 className="font-medium text-slate-800 mb-1">Notification Preferences</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Manage how and when you receive notifications
                </p>
                <button className="btn btn-outline">Update Preferences</button>
              </div>
              
              <div className="p-4 border border-error-100 rounded-md">
                <h3 className="font-medium text-error-600 mb-1">Danger Zone</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Actions here can't be undone
                </p>
                <button className="btn btn-danger" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col items-center">
              <img
                src={DEFAULT_AVATAR}
                alt={currentUser.fullName}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h3 className="text-lg font-semibold text-slate-900">{currentUser.fullName}</h3>
              <p className="text-sm text-slate-600 mb-4">{getRoleName(currentUser.roleId)}</p>
              <button className="btn btn-outline w-full text-sm">Edit Profile</button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-primary-50 border-b border-primary-100">
              <h3 className="font-medium text-primary-800">Quick Actions</h3>
            </div>
            
            <div className="p-4">
              <nav className="space-y-2">
                <Link
                  to={ROUTES.DASHBOARD}
                  className="flex items-center px-3 py-2 text-sm rounded-md text-slate-700 hover:bg-primary-50 hover:text-primary-700"
                >
                  <Home className="w-4 h-4 mr-3" />
                  Dashboard
                </Link>
                
                {isTenant && (
                  <Link
                    to={ROUTES.RESERVATIONS}
                    className="flex items-center px-3 py-2 text-sm rounded-md text-slate-700 hover:bg-primary-50 hover:text-primary-700"
                  >
                    <Calendar className="w-4 h-4 mr-3" />
                    My Reservations
                  </Link>
                )}
                
                {isHouseOwner && (
                  <>
                    <Link
                      to={ROUTES.ADD_HOUSE}
                      className="flex items-center px-3 py-2 text-sm rounded-md text-slate-700 hover:bg-primary-50 hover:text-primary-700"
                    >
                      <Home className="w-4 h-4 mr-3" />
                      Add House
                    </Link>
                    <Link
                      to={ROUTES.OWNER_RESERVATIONS}
                      className="flex items-center px-3 py-2 text-sm rounded-md text-slate-700 hover:bg-primary-50 hover:text-primary-700"
                    >
                      <Calendar className="w-4 h-4 mr-3" />
                      Bookings
                    </Link>
                  </>
                )}
                
                {isAdmin && (
                  <Link
                    to={ROUTES.ADMIN_RESERVATIONS}
                    className="flex items-center px-3 py-2 text-sm rounded-md text-slate-700 hover:bg-primary-50 hover:text-primary-700"
                  >
                    <Calendar className="w-4 h-4 mr-3" />
                    All Reservations
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;