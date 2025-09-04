import React, { useEffect, useRef, useState, useCallback } from 'react';
import { User } from '../../types';

// Make TypeScript aware of the Google Identity Services library
declare global {
  interface Window {
    google: any;
    tokenClient: any;
  }
}

interface LoginScreenProps {
  onLogin: (user: User, accessToken: string) => void;
}

const CalendarIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const GoogleIcon: React.FC = () => (
    <svg className="w-5 h-5 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8 0 120.3 109.8 8 244 8c66.8 0 126 25.5 170.2 67.7L345 151.4c-25.2-24.4-59-39.7-91-39.7-68.5 0-124.2 55.7-124.2 124.2s55.7 124.2 124.2 124.2c76.1 0 104.4-54.3 108.8-82.7H244v-64.8h243.2c1.3 12.8 2 25.8 2 39.8z"/>
    </svg>
);


const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [isGsiLoaded, setIsGsiLoaded] = useState(false);

    const handleLoginClick = useCallback(() => {
        if (!isGsiLoaded) {
            console.error("Google script not loaded yet.");
            return;
        }

        // Request an access token from the user
        window.tokenClient.requestAccessToken();
    }, [isGsiLoaded]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => setIsGsiLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (isGsiLoaded) {
            // Initialize a token client for authZ (getting an access token)
            window.tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: '414916084027-outt2175obnkjcnmie8kp40971hhk31v.apps.googleusercontent.com', // IMPORTANT: Replace with your actual Google Client ID
                scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.events',
                callback: async (tokenResponse: any) => {
                    if (tokenResponse && tokenResponse.access_token) {
                        // Got the access token, now fetch user profile
                        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                        });
                        
                        if (userInfoResponse.ok) {
                            const userObject = await userInfoResponse.json();
                            const user: User = {
                                name: userObject.name,
                                email: userObject.email,
                                avatarUrl: userObject.picture,
                            };
                            onLogin(user, tokenResponse.access_token);
                        } else {
                            console.error("Failed to fetch user info from Google.");
                        }
                    }
                },
            });
        }
    }, [isGsiLoaded, onLogin]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-2xl shadow-2xl text-center">
        <div>
            <div className="flex justify-center mb-4">
                <CalendarIcon />
            </div>
          <h2 className="text-3xl font-extrabold text-white">
            AI Calendar Assistant
          </h2>
          <p className="mt-2 text-slate-400">
            Sign in to manage your schedule intelligently.
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center pt-8">
            <button 
                onClick={handleLoginClick}
                disabled={!isGsiLoaded}
                className="w-full flex items-center justify-center py-3 px-4 bg-white text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white transition duration-150 disabled:opacity-50"
            >
                <GoogleIcon />
                Sign in with Google
            </button>
            <p className="mt-6 text-xs text-slate-500 max-w-xs mx-auto">
                We'll ask for permission to view and manage your calendar events.
            </p>
        </div>

      </div>
    </div>
  );
};

export default LoginScreen;
