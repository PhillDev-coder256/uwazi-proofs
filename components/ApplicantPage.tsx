import React, { useState } from 'react';
import type { ExtractedData, EligibilityResult, RecentProof, Program, DocumentType } from '../types';
import { extractDataFromDocuments } from '../services/geminiService';
import { generateSha256, generateQrCode } from '../services/proofService';

import LoadingSpinner from './icons/LoadingSpinner';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';
import ProgramSelection from './ProgramSelection';
import DocumentUploader from './DocumentUploader';
import { AVAILABLE_PROGRAMS } from '../programs';

interface ApplicantPageProps {
  addProof: (
    hash: string,
    isEligible: boolean,
    extractedData: ExtractedData,
    eligibilityChecks: EligibilityResult['checks']
  ) => void;
}

type Stage = 'selection' | 'upload' | 'processing' | 'results';

const ApplicantPage: React.FC<ApplicantPageProps> = ({ addProof }) => {
  const [stage, setStage] = useState<Stage>('selection');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [identifiedFiles, setIdentifiedFiles] = useState<Map<DocumentType, File>>(new Map());

  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
  const [proofHash, setProofHash] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleProgramSelect = (program: Program) => {
    setSelectedProgram(program);
    setStage('upload');
  };
  
  const handleBackToSelection = () => {
      resetState();
  };

  const handleFilesReady = (files: Map<DocumentType, File>) => {
    setIdentifiedFiles(files);
    processDocuments(files);
  };
  
  const processDocuments = async (filesToProcess: Map<DocumentType, File>) => {
    if (!selectedProgram) {
      setError("No program selected.");
      return;
    }
    setStage('processing');
    setError('');

    try {
      const data = await extractDataFromDocuments(filesToProcess, selectedProgram.dataExtractionSchema);
      if (!data) {
        throw new Error("Failed to extract data from documents. The documents might be unclear or missing information.");
      }
      setExtractedData(data);

      const eligibility = selectedProgram.checkEligibility(data);
      setEligibilityResult(eligibility);

      const proofPayload = { data, eligibility };
      const hash = await generateSha256(proofPayload);
      setProofHash(hash);

      const qrUrl = await generateQrCode(hash);
      setQrCodeUrl(qrUrl);
      
      addProof(hash, eligibility.isEligible, data, eligibility.checks);
      setStage('results');

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during processing.');
      setStage('upload'); // Go back to upload stage on error
    }
  };

  const resetState = () => {
    setStage('selection');
    setSelectedProgram(null);
    setIdentifiedFiles(new Map());
    setExtractedData(null);
    setEligibilityResult(null);
    setProofHash('');
    setQrCodeUrl('');
    setError('');
  };

  const renderContent = () => {
    switch (stage) {
      case 'selection':
        return <ProgramSelection programs={AVAILABLE_PROGRAMS} onSelect={handleProgramSelect} />;
      
      case 'upload':
        if (!selectedProgram) return null; // Should not happen
        return (
            <DocumentUploader
                program={selectedProgram}
                onFilesReady={handleFilesReady}
                onBack={handleBackToSelection}
                error={error}
            />
        );

      case 'processing':
        return (
          <div style={{ fontFamily: 'Epilogue, sans-serif !important' }} className="text-center p-10 bg-white rounded-lg shadow-xl">
            <LoadingSpinner className="animate-spin h-12 w-12 text-brand-primary mx-auto" />
            <h2 className="mt-4 text-2xl font-semibold text-gray-700">Analyzing Your Documents...</h2>
            <p className="mt-2 text-gray-500">Using AI to securely extract information. Please wait.</p>
          </div>
        );

      case 'results':
        return (
          <div style={{ fontFamily: 'Epilogue, sans-serif !important' }} className="bg-white p-8 rounded-lg shadow-xl animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-6">Verification Complete</h2>
            <div style={{ fontFamily: 'Epilogue, sans-serif !important' }} className="grid md:grid-cols-2 gap-8">
              
              {/* Left Column: Extracted Data & Eligibility */}
              <div style={{ fontFamily: 'Epilogue, sans-serif !important' }}>
                <h3 className="text-xl font-semibold mb-3 border-b pb-2">Extracted Information</h3>
                <div className="space-y-2 text-gray-700">
                  {extractedData && Object.entries(extractedData).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span>{value !== null ? String(value) : 'Not Found'}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-3 border-b pb-2">Eligibility Status - {eligibilityResult?.isEligible ? 'Eligible' : 'Not Eligible'}</h3>
                {eligibilityResult && (
                  <div className={`p-4 rounded-md flex items-center gap-3 ${eligibilityResult.isEligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {eligibilityResult.isEligible ? <CheckIcon className="h-6 w-6" /> : <XIcon className="h-6 w-6" />}
                    <span className="font-bold text-lg">{eligibilityResult.isEligible ? 'Eligible' : 'Not Eligible'}</span>
                  </div>
                )}
              </div>

              {/* Right Column: Proof */}
              <div className="text-center bg-gray-50 p-6 rounded-lg">
                 <h3 className="text-xl font-semibold mb-2">Your Private Proof</h3>
                 <p className="text-sm text-gray-500 mb-4">This QR code represents your eligibility. It does not contain your personal data.</p>
                {qrCodeUrl ? <img src={qrCodeUrl} alt="Eligibility Proof QR Code" className="mx-auto border-4 border-white shadow-lg" /> : <p>Generating QR Code...</p>}
                <p className="font-mono text-xs break-all mt-4 p-2 bg-gray-200 rounded">{proofHash}</p>
              </div>

            </div>
             <div className="text-center mt-8">
                <button
                    onClick={resetState}
                    className="px-8 py-3 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-brand-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                >
                    Start New Application
                </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ fontFamily: 'Epilogue, sans-serif' }} className="container mx-auto max-w-5xl">
      {renderContent()}
    </div>
  );
};

export default ApplicantPage;