// src/types/index.ts
import type { Type } from '@google/genai';
import type { FC } from 'react';

/**
 * App view modes.
 */
export type View = 'applicant' | 'verifier';

/**
 * Supported document types for eligibility verification.
 */
export type DocumentType =
  | 'TRANSCRIPT'
  | 'NATIONAL_ID'
  | 'INCOME_STATEMENT'
  | 'LEASE_AGREEMENT'
  | 'UNKNOWN' 
  | 'BACHELOR_DEGREE'
  | 'ADMISSION_LETTER'
  | 'FINANCIAL_PLAN'
  | 'WORK_EXPERIENCE'
  | 'REFERENCES'
  | 'OFFER_LETTER'
  | 'PROOF_OF_ENROLLMENT'
  | 'MEDICAL_REPORT'
  | 'PRESCRIPTION'
  | 'BILLS'
  | 'PAY_STUB'
  | 'TAX_RETURN'
  | 'CERTIFICATION'
  | 'WORK_EXPERIENCE_PROOF'
  | 'PASSPORT'
  ;


/**
 * Category of a social-safety-net program (for UI grouping / filtering).
 */
export type ProgramCategory =
  | 'Education'
  | 'Healthcare'
  | 'Housing'
  | 'Financial Aid'
  | 'Other';

/**
 * Document required for a given program.
 */
export interface RequiredDocument {
  readonly type: DocumentType;
  readonly name: string;
  readonly description: string;
}

/**
 * Data extracted by the AI from submitted documents.
 * Values can be string, number, boolean or null if missing.
 */
export interface ExtractedData {
  readonly [key: string]: string | number | boolean | null;
}

/**
 * Result of checking a single eligibility criterion.
 */
export interface EligibilityCheck {
  readonly criterion: string;
  readonly isMet: boolean;
  readonly value: string | number | boolean | null;
  readonly requirement: string;
}

/**
 * Final eligibility result after evaluating all criteria.
 */
export interface EligibilityResult {
  readonly isEligible: boolean;
  readonly checks: EligibilityCheck[];
}

/**
 * Program definition that drives the UI and business logic.
 */
export interface Program {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category?: ProgramCategory;
  readonly requiredDocuments: RequiredDocument[];

  /**
   * Schema guiding Gemini’s structured data extraction.
   */
  readonly dataExtractionSchema: Record<
    string,
    { type: Type; description?: string }
  >;
  /**
   * Business rule function to determine eligibility.
   */
  readonly checkEligibility: (data: ExtractedData) => EligibilityResult;
  /**
   * Icon component for visual representation.
   */
  readonly icon: FC<{ className?: string }>;
  /**
   * Category of the program (for UI grouping / filtering).
   */
  // readonly category?: ProgramCategory;

}

/**
 * A recent zero-knowledge proof result stored for auditing.
 */
export interface RecentProof {
  readonly hash: string;
  readonly isEligible: boolean;
  readonly timestamp: string; // ISO date string
  readonly extractedData: ExtractedData;
  readonly eligibilityChecks: EligibilityCheck[];
}

/**
 * AI identification result for a single uploaded document.
 */
export interface IdentificationResult {
  readonly type: DocumentType;
  readonly summary: string;
}
