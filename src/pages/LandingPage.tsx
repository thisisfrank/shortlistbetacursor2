import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-shadowforce">
      <Header />
      <main className="flex-grow">
        <div className="min-h-screen bg-gradient-to-br from-shadowforce via-shadowforce-dark to-black flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-anton text-white-knight mb-6 uppercase tracking-wide">
              Get
              <span className="block text-supernova">Candidates</span>
              Fast
            </h1>
            <p className="text-xl text-guardian mb-8 font-jakarta">
              Submit your job requirements and receive qualified candidates within 24-48 hours.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-anton text-white-knight mb-2 uppercase tracking-wide">
                  I'm a Client
                </h3>
                <button 
                  className="bg-supernova text-shadowforce px-6 py-3 rounded-lg font-jakarta font-semibold mr-4"
                  onClick={() => window.location.href = '/login'}
                >
                  Sign In
                </button>
                <button 
                  className="bg-transparent border-2 border-supernova text-supernova px-6 py-3 rounded-lg font-jakarta font-semibold"
                  onClick={() => window.location.href = '/signup'}
                >
                  Create Account
                </button>
              </div>
              <div>
                <h3 className="text-xl font-anton text-white-knight mb-2 uppercase tracking-wide">
                  I'm a Sourcer
                </h3>
                <button 
                  className="bg-supernova text-shadowforce px-6 py-3 rounded-lg font-jakarta font-semibold mr-4"
                  onClick={() => window.location.href = '/login'}
                >
                  Sign In
                </button>
                <button 
                  className="bg-transparent border-2 border-supernova text-supernova px-6 py-3 rounded-lg font-jakarta font-semibold"
                  onClick={() => window.location.href = '/signup'}
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};