import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import VerifierPage from './components/VerifierPage';
import ProgramSelection from './components/ProgramSelection';
import DocumentUploader from './components/DocumentUploader';
import LoadingSpinner from './components/icons/LoadingSpinner';
import CheckIcon from './components/icons/CheckIcon';
import XIcon from './components/icons/XIcon';
import type { View, RecentProof, ExtractedData, EligibilityResult, Program, DocumentType } from './types';
import { AVAILABLE_PROGRAMS } from './programs';
import { extractDataFromDocuments } from './services/geminiService';
import { generateSha256, generateQrCode } from './services/proofService';

type Stage = 'selection' | 'upload' | 'processing' | 'results';

const App: React.FC = () => {
  // View state
  const [view, setView] = useState<View>('applicant');
  
  // Shared state for proofs
  const [proofs, setProofs] = useState<RecentProof[]>([]);

  // State for the applicant workflow
  const [stage, setStage] = useState<Stage>('selection');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
  const [proofHash, setProofHash] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [error, setError] = useState<string>('');


  // Load proofs from localStorage on initial render
  useEffect(() => {
    try {
      const storedProofs = localStorage.getItem('uwazi-proofs');
      if (storedProofs) {
        setProofs(JSON.parse(storedProofs));
      }
    } catch (error) {
      console.error("Failed to load proofs from localStorage", error);
      // localStorage.removeItem('uwazi-proofs');
    }
  }, []);

  // Save proofs to localStorage whenever they change
  useEffect(() => {
    try {
        localStorage.setItem('uwazi-proofs', JSON.stringify(proofs));
    } catch (error) {
      console.error("Failed to save proofs to localStorage", error);
    }
  }, [proofs]);

  // Function to add a new proof to the shared list
  const addProof = useCallback((
    hash: string, 
    isEligible: boolean,
    extractedData: ExtractedData,
    eligibilityChecks: EligibilityResult['checks']
    ) => {
    setProofs(prevProofs => {
      const newProof: RecentProof = { 
        hash, 
        isEligible, 
        timestamp: new Date().toISOString(),
        extractedData,
        eligibilityChecks
      };
      if (prevProofs.some(p => p.hash === hash)) return prevProofs;
      const updatedProofs = [newProof, ...prevProofs];
      return updatedProofs.slice(0, 10);
    });
  }, []);

  // --- Applicant Workflow Handlers ---

  const handleProgramSelect = (program: Program) => {
    setSelectedProgram(program);
    setStage('upload');
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
        throw new Error("Failed to extract data. Documents might be unclear or missing key information.");
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
      setStage('upload');
    }
  };

  const resetApplicantState = () => {
    setStage('selection');
    setSelectedProgram(null);
    setExtractedData(null);
    setEligibilityResult(null);
    setProofHash('');
    setQrCodeUrl('');
    setError('');
  };

  // --- Content Rendering ---

  const renderApplicantContent = () => {
    switch (stage) {
      case 'selection':
        return <ProgramSelection programs={AVAILABLE_PROGRAMS} onSelect={handleProgramSelect} />;
      
      case 'upload':
        if (!selectedProgram) return null;
        return (
            <DocumentUploader
                program={selectedProgram}
                onFilesReady={processDocuments}
                onBack={resetApplicantState}
                error={error}
            />
        );

      case 'processing':
        return (
          <div className="text-center p-10 bg-white rounded-lg shadow-xl">
            <LoadingSpinner className="animate-spin h-12 w-12 text-brand-primary mx-auto" />
            <h2 className="mt-4 text-2xl font-semibold text-gray-700">Analyzing Your Documents...</h2>
            <p className="mt-2 text-gray-500">Using AI to securely extract information. Please wait.</p>
          </div>
        );

      case 'results':
        return (
          <div className="bg-white p-8 rounded-lg shadow-xl animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-6">Verification Complete</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 border-b pb-2">Extracted Information</h3>
                <div className="space-y-2 text-gray-700">
                  {extractedData && Object.entries(extractedData).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span>{value !== null ? String(value) : 'Not Found'}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-3 border-b pb-2">Eligibility Status</h3>
                {eligibilityResult && (
                  <div className={`p-4 rounded-md flex items-center gap-3 ${eligibilityResult.isEligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {eligibilityResult.isEligible ? <CheckIcon className="h-6 w-6" /> : <XIcon className="h-6 w-6" />}
                    <span className="font-bold text-lg">{eligibilityResult.isEligible ? 'Eligible' : 'Not Eligible'}</span>
                  </div>
                )}
              </div>

              <div className="text-center bg-gray-50 p-6 rounded-lg">
                 <h3 className="text-xl font-semibold mb-2">Your Private Proof</h3>
                 <p className="text-sm text-gray-500 mb-4">This QR code represents your eligibility. It does not contain your personal data.</p>
                {qrCodeUrl ? <img src={qrCodeUrl} alt="Eligibility Proof QR Code" className="mx-auto border-4 border-white shadow-lg" /> : <p>Generating QR Code...</p>}
                <p className="font-mono text-xs break-all mt-4 p-2 bg-gray-200 rounded">{proofHash}</p>
              </div>
            </div>
             <div className="text-center mt-8">
                <button
                    onClick={resetApplicantState}
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
    <div className="min-h-screen bg-gray-50 font-sans text-brand-dark">
      <Header currentView={view} setView={setView} />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-5xl">
          {view === 'applicant' ? renderApplicantContent() : <VerifierPage proofs={proofs} />}
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Uwazi Proofs Demo. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;