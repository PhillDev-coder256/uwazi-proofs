
import React from 'react';
import type { View } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const commonButtonClasses = "px-4 py-2 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary";
  const activeButtonClasses = "bg-brand-primary text-white";
  const inactiveButtonClasses = "bg-white text-gray-700 hover:bg-gray-100";

  return (
    <header style={{ fontFamily: 'Epilogue, sans-serif' }}  className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold text-xl">U</div>
            <h1 className="text-2xl font-bold text-brand-dark">Uwazi Proofs</h1>
          </div>
          <p className="text-gray-500 mt-1">Transparent Eligibility – Private Data</p>
        </div>
        <nav className="flex items-center gap-2 bg-gray-200 p-1 rounded-lg">
          <button
            onClick={() => setView('applicant')}
            className={`${commonButtonClasses} ${currentView === 'applicant' ? activeButtonClasses : inactiveButtonClasses}`}
          >
            Applicant
          </button>
          <button
            onClick={() => setView('verifier')}
            className={`${commonButtonClasses} ${currentView === 'verifier' ? activeButtonClasses : inactiveButtonClasses}`}
          >
            Verifier
          </button>
        </nav>
      </div>
       <div style={{ backgroundColor: '#FEFCE8', borderLeft: '4px solid #FBBF24', color: '#B45309', padding: '16px', margin: '16px 50px', fontFamily: 'Epilogue, sans-serif', display: 'none' }} role="alert">
        <p className="font-bold">Demonstration Notice</p>
        <p>This is a DEMO – Gemini API currently processes your documents. In a production system, extraction and proof generation would run fully on the user's device for maximum privacy.</p>
      </div>
    </header>
  );
};

export default Header;
   