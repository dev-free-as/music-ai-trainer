'use client';

import { useState } from 'react';
import { User, Settings, LogOut, Upload, Download, Calendar } from 'lucide-react';

const ProfileCard = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 overflow-hidden">
      {/* Profile Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Profile Navigation */}
      <div className="flex border-b border-gray-700">
        {['overview', 'history', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 font-medium capitalize transition-colors ${
              activeTab === tab 
                ? 'text-purple-400 border-b-2 border-purple-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Profile Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-400">Audio Files</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                <Download className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <p className="text-2xl font-bold">48</p>
                <p className="text-sm text-gray-400">Analyses Completed</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <p className="text-2xl font-bold">14</p>
                <p className="text-sm text-gray-400">Days Active</p>
              </div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Recent Activity</h4>
              <ul className="space-y-2">
                {[
                  'Pitch analysis completed for "Bohemian Rhapsody"',
                  'Breathing point detection for "Shape of You"',
                  'Lyrics sync for "Rolling in the Deep"'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h4 className="font-medium mb-3">Analysis History</h4>
            <div className="bg-gray-800/50 rounded-lg overflow-hidden">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0">
                  <div>
                    <p className="font-medium">Song Analysis #{item}</p>
                    <p className="text-sm text-gray-400">2 hours ago</p>
                  </div>
                  <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Account Settings</h4>
              <div className="bg-gray-800/50 p-4 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;