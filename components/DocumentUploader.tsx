import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import type { Program, DocumentType, RequiredDocument, IdentificationResult } from '../types';
import { identifyDocumentType } from '../services/geminiService';
import LoadingSpinner from './icons/LoadingSpinner';
import UploadIcon from './icons/UploadIcon';
import DocumentIcon from './icons/DocumentIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import XIcon from './icons/XIcon';


interface DocumentUploaderProps {
    program: Program;
    onFilesReady: (files: Map<DocumentType, File>) => void;
    onBack: () => void;
    error?: string;
}

type IdentificationStatus = 'pending' | 'identifying' | 'identified' | 'error' | 'unknown';

interface DocumentSlot extends RequiredDocument {
    status: IdentificationStatus;
    file: File | null;
    errorMsg?: string;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ program, onFilesReady, onBack, error }) => {
    const [documentSlots, setDocumentSlots] = useState<DocumentSlot[]>(() =>
        program.requiredDocuments.map(doc => ({ ...doc, status: 'pending', file: null }))
    );

    const [isProcessing, setIsProcessing] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setIsProcessing(true);

        for (const file of acceptedFiles) {
            const result: IdentificationResult = await identifyDocumentType(file);

            setDocumentSlots(prevSlots => {
                const newSlots = [...prevSlots];
                if (result.type !== 'UNKNOWN') {
                    const targetSlotIndex = newSlots.findIndex(slot => slot.type === result.type && slot.status !== 'identified');
                    if (targetSlotIndex !== -1) {
                         newSlots[targetSlotIndex] = { ...newSlots[targetSlotIndex], status: 'identified', file: file, errorMsg: undefined };
                    } else {
                        // Handle case where a document of this type is already uploaded
                        console.warn(`Document type ${result.type} already identified.`);
                    }
                } else {
                    // Handle UNKNOWN case
                    const emptySlotIndex = newSlots.findIndex(slot => slot.status === 'pending');
                    if (emptySlotIndex !== -1) {
                        const errorMessage = result.summary
                            ? `Could not classify. Content seems to be: "${result.summary}"`
                            : "Could not identify this document. Please ensure it's clear.";
                        newSlots[emptySlotIndex] = { ...newSlots[emptySlotIndex], status: 'unknown', file, errorMsg: errorMessage };
                    } else {
                         console.warn("All document slots are full, cannot place unidentified document.");
                    }
                }
                return newSlots;
            });
        }
        setIsProcessing(false);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }
    });
    
    const allDocumentsUploaded = useMemo(() =>
        documentSlots.every(slot => slot.status === 'identified' && slot.file),
        [documentSlots]
    );

    const handleProcessClick = () => {
        if (!allDocumentsUploaded) return;
        const fileMap = new Map<DocumentType, File>();
        documentSlots.forEach(slot => {
            if (slot.file) { // This check is redundant due to allDocumentsUploaded but good for type safety
                fileMap.set(slot.type, slot.file);
            }
        });
        onFilesReady(fileMap);
    };

    const handleRemoveFile = (type: DocumentType) => {
        setDocumentSlots(prevSlots => prevSlots.map(slot => 
            slot.type === type ? { ...slot, status: 'pending', file: null, errorMsg: undefined } : slot
        ));
    }

    return (
        <div style={{ fontFamily: 'Epilogue, sans-serif' }} className="bg-white p-8 rounded-lg shadow-xl animate-fade-in">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-brand-primary font-semibold mb-4 hover:underline">
                <ArrowLeftIcon />
                Back to Program Selection
            </button>
            <h2 className="text-3xl font-bold text-center mb-2">{program.name}</h2>
            <p className="text-center text-gray-600 mb-8">Upload the required documents below.</p>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-brand-primary bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}>
                <input {...getInputProps()} />
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-600 font-semibold">Drop documents here, or click to select files</p>
                <p className="text-xs text-gray-500">Supports PDF, JPG, PNG</p>
                {isProcessing && <p className="text-sm text-brand-primary mt-2">Identifying documents...</p>}
            </div>

            <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold">Required Documents:</h3>
                {documentSlots.map((slot) => (
                    <div key={slot.type} className={`p-4 rounded-lg border flex items-center justify-between transition-all ${slot.status === 'identified' ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-4">
                           {slot.status === 'identified' 
                                ? <CheckCircleIcon className="h-8 w-8 text-green-500" />
                                : <DocumentIcon className="h-8 w-8 text-gray-400" />
                            }
                            <div>
                                <p className="font-semibold text-brand-dark">{slot.name}</p>
                                <p className="text-sm text-gray-500">{slot.file ? slot.file.name : slot.description}</p>
                                {slot.status === 'unknown' && <p className="text-xs text-red-500 mt-1">{slot.errorMsg}</p>}
                            </div>
                        </div>
                        {slot.file && (
                             <button onClick={() => handleRemoveFile(slot.type)} className="text-gray-400 hover:text-red-500 p-1 rounded-full">
                                <XIcon className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <button
                    onClick={handleProcessClick}
                    disabled={!allDocumentsUploaded}
                    className="w-full sm:w-auto px-10 py-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-brand-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Process Documents
                </button>
            </div>
        </div>
    );
};

export default DocumentUploader;