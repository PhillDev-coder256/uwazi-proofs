import React, { useState, useMemo, useEffect } from 'react';
import type { RecentProof } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';
import QrCodeIcon from './icons/QrCodeIcon';
import LoadingSpinner from './icons/LoadingSpinner';

const VerifierPage: React.FC<{ proofs: RecentProof[] }> = ({ proofs }) => {
  const [inputHash, setInputHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<'valid-eligible' | 'valid-ineligible' | 'invalid' | 'idle'>('idle');
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedProof, setSelectedProof] = useState<RecentProof | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const proofsByHash = useMemo(() => new Map(proofs.map(p => [p.hash, p])), [proofs]);

  const handleVerify = () => {
    const trimmedHash = inputHash.trim();
    if (!trimmedHash) {
      setVerificationResult('idle');
      return;
    }
    
    setIsVerifying(true);
    // Simulate a brief delay for UX
    setTimeout(() => {
      const foundProof = proofsByHash.get(trimmedHash);
      if (foundProof) {
        setSelectedProof(foundProof);
        setVerificationResult(foundProof.isEligible ? 'valid-eligible' : 'valid-ineligible');
      } else {
        setSelectedProof(null);
        setVerificationResult('invalid');
      }
      setIsVerifying(false);
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputHash(e.target.value);
    if (verificationResult !== 'idle') {
      setVerificationResult('idle');
      setSelectedProof(null);
    }
  };
  
  const handleCardClick = (proof: RecentProof) => {
    setSelectedProof(proof);
    setIsModalOpen(true);
  };
  
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProof(null);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
        handleModalClose();
       }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div style={{ fontFamily: 'Epilogue, sans-serif' }}  className="container mx-auto max-w-6xl">
      <div className="grid lg:grid-cols-5 gap-8">
        
        {/* Left Column: Manual Verification */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-lg shadow-lg sticky top-8">
            <h2 className="text-2xl font-bold text-center mb-2">Verify Proof</h2>
            <p className="text-center text-gray-600 mb-6">Enter a proof hash to verify eligibility.</p>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <QrCodeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={inputHash}
                  onChange={handleInputChange}
                  placeholder="Paste proof hash here..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="px-6 py-3 flex items-center justify-center border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-brand-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400"
              >
                {isVerifying ? <LoadingSpinner className="animate-spin h-5 w-5 text-white" /> : 'Verify'}
              </button>
            </div>

            <div className="mt-6 h-40">
              {isVerifying ? (
                <div className="flex justify-center items-center h-full">
                    <LoadingSpinner className="animate-spin h-8 w-8 text-brand-primary" />
                </div>
              ) : verificationResult !== 'idle' && (
                <div className="p-4 border rounded-lg animate-fade-in">
                  <h3 className="text-md font-semibold mb-2">Verification Result</h3>
                  {verificationResult === 'valid-eligible' && (
                    <div className="bg-green-100 text-green-800 p-2 rounded-md flex items-center gap-2">
                      <CheckIcon className="h-5 w-5" />
                      <p className="font-bold">Proof Valid & Eligible</p>
                    </div>
                  )}
                  {verificationResult === 'valid-ineligible' && (
                    <div className="bg-orange-100 text-orange-800 p-2 rounded-md flex items-center gap-2">
                      <XIcon className="h-5 w-5" />
                      <p className="font-bold">Proof Valid & Not Eligible</p>
                    </div>
                  )}
                   {verificationResult === 'invalid' && (
                      <div className="bg-red-100 text-red-800 p-2 rounded-md flex items-center gap-2">
                          <XIcon className="h-5 w-5" />
                          <p className="font-bold">Proof Invalid</p>
                      </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column: Recent Applications */}
        <div className="lg:col-span-3">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Recent Applications</h3>
          {proofs.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {proofs.map((proof) => (
                <div key={proof.hash} onClick={() => handleCardClick(proof)} className="bg-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
                  <div className={`p-4 flex justify-between items-center ${proof.isEligible ? 'bg-green-500' : 'bg-red-500'}`}>
                    <h4 className="font-bold text-white text-lg">
                        {proof.isEligible ? 'Eligible' : 'Not Eligible'}
                    </h4>
                    {proof.isEligible ? <CheckIcon className="h-6 w-6 text-white" /> : <XIcon className="h-6 w-6 text-white" />}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500">Generated:</p>
                    <p className="text-sm text-gray-700 mb-2">{new Date(proof.timestamp).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Proof Hash:</p>
                    <p className="font-mono text-xs text-brand-dark break-all truncate">{proof.hash}</p>
                    <button className="text-sm font-semibold text-brand-primary mt-3 hover:underline">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-20 bg-white rounded-lg shadow-md">
                <p className="font-semibold">No applications in this session.</p>
                <p className="text-sm mt-1">Go to the Applicant page to generate one.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal for Proof Details */}
      {isModalOpen && selectedProof && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={handleModalClose}>
              <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                  <div className="p-6 border-b flex justify-between items-center">
                      <h3 className="text-xl font-bold">Application Details</h3>
                      <button onClick={handleModalClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                  </div>
                  <div className="p-6 max-h-[70vh] overflow-y-auto">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2 border-b pb-1">Extracted Data</h4>
                            <div className="space-y-1 text-sm">
                            {Object.entries(selectedProof.extractedData).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                <span className="font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                <span className="text-gray-800 font-semibold">{value !== null ? String(value) : 'N/A'}</span>
                                </div>
                            ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2 border-b pb-1">Eligibility Checks</h4>
                             <ul className="space-y-2">
                                {selectedProof.eligibilityChecks.map(check => (
                                    <li key={check.criterion} className="flex items-start text-sm">
                                        {check.isMet 
                                            ? <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" /> 
                                            : <XIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                        }
                                        <div>
                                            <span className="font-semibold">{check.criterion}: </span>
                                            <span className={check.isMet ? 'text-green-700' : 'text-red-700'}>{check.isMet ? 'Met' : 'Not Met'}</span>
                                            <div className="text-xs text-gray-500">
                                                (Value: {check.value ?? 'N/A'} | Required: {check.requirement})
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                      </div>
                       <div className="mt-6 pt-4 border-t">
                            <h4 className="font-semibold text-gray-700 mb-1">Proof Hash</h4>
                            <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">{selectedProof.hash}</p>
                       </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default VerifierPage;
