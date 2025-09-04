
import React from 'react';
import { User } from '../../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const CalendarIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-8 w-8 text-indigo-400"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LogoutIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm shadow-md z-10">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <CalendarIcon />
            <span className="ml-3 text-2xl font-bold text-white tracking-wider">
              AI Calendar
            </span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt="User avatar" />
              <div className="ml-3 text-right">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs font-medium text-slate-400">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-slate-300 bg-slate-700 hover:bg-red-700/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500 transition duration-150"
            >
             <LogoutIcon />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
