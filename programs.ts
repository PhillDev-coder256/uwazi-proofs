import { Type } from '@google/genai';
import type { Program, ExtractedData, EligibilityResult } from './types';
import ScholarshipIcon from './components/icons/ScholarshipIcon';
import HousingIcon from './components/icons/HousingIcon';

export const AVAILABLE_PROGRAMS: Program[] = [
  // Merit Scholarship Program
  {
    id: 'merit-scholarship',
    name: 'Merit Scholarship',
    description: 'A scholarship for students who demonstrate high academic achievement. Requires a recent academic transcript and proof of identity.',
    icon: ScholarshipIcon,
    requiredDocuments: [
      { type: 'TRANSCRIPT', name: 'Academic Transcript', description: 'Your most recent official transcript.' },
      { type: 'NATIONAL_ID', name: 'National ID', description: 'A government-issued identification card.' },
    ],
    dataExtractionSchema: {
      studentName: { type: Type.STRING, description: "The full name of the student." },
      dateOfBirth: { type: Type.STRING, description: "The student's date of birth in YYYY-MM-DD format." },
      gpa: { type: Type.NUMBER, description: "The student's Grade Point Average (GPA) on a 4.0 scale." },
      graduationDate: { type: Type.STRING, description: "The student's expected or actual graduation date in YYYY-MM-DD format." },
    },
    checkEligibility: (data: ExtractedData): EligibilityResult => {
      const checks = [];
      const gpa = typeof data.gpa === 'number' ? data.gpa : 0;

      const isGpaMet = gpa >= 3.5;
      checks.push({
        criterion: 'Minimum GPA',
        isMet: isGpaMet,
        value: gpa,
        requirement: '>= 3.5',
      });
      
      const isEligible = checks.every(check => check.isMet);
      
      return { isEligible, checks };
    },
  },
  // Housing Assistance Program
  {
    id: 'housing-assistance',
    name: 'Housing Assistance',
    description: 'Provides rental assistance to low-income individuals and families. Requires proof of income and a current lease agreement.',
    icon: HousingIcon,
    requiredDocuments: [
      { type: 'INCOME_STATEMENT', name: 'Income Statement', description: 'e.g., Recent Pay Stubs or a Tax Return.' },
      { type: 'LEASE_AGREEMENT', name: 'Lease Agreement', description: 'Your current signed lease agreement.' },
      { type: 'NATIONAL_ID', name: 'National ID', description: 'A government-issued identification card.' },
    ],
    dataExtractionSchema: {
      applicantName: { type: Type.STRING, description: "The full name of the primary applicant." },
      monthlyIncome: { type: Type.NUMBER, description: "The applicant's total gross monthly income." },
      monthlyRent: { type: Type.NUMBER, description: "The applicant's total monthly rent payment." },
      householdSize: { type: Type.INTEGER, description: "The number of people in the applicant's household." },
    },
    checkEligibility: (data: ExtractedData): EligibilityResult => {
      const checks = [];
      const monthlyIncome = typeof data.monthlyIncome === 'number' ? data.monthlyIncome : 0;
      const monthlyRent = typeof data.monthlyRent === 'number' ? data.monthlyRent : 0;

      // Rule: Rent should not be more than 50% of income.
      const isRentBurdenMet = monthlyRent <= (monthlyIncome * 0.5);
      checks.push({
        criterion: 'Rent-to-Income Ratio',
        isMet: isRentBurdenMet,
        value: monthlyIncome > 0 ? `${((monthlyRent / monthlyIncome) * 100).toFixed(1)}%` : 'N/A',
        requirement: '<= 50%',
      });

      // Rule: Income must be below a certain threshold (e.g., 3000/month).
      const isIncomeMet = monthlyIncome < 3000;
      checks.push({
          criterion: 'Maximum Monthly Income',
          isMet: isIncomeMet,
          value: monthlyIncome,
          requirement: '< $3000',
      });
      
      const isEligible = checks.every(check => check.isMet);

      return { isEligible, checks };
    },
  },
  // Startup Grant Program
  {
    id: 'startup-grant',
    name: 'Startup Grant',
    description: 'A grant for early-stage startups to support business development. Requires a business plan and proof of incorporation.',
    icon: HousingIcon,
    requiredDocuments: [
      { type: 'BUSINESS_PLAN', name: 'Business Plan', description: 'A detailed business plan outlining your startup idea.' },
      { type: 'INCORPORATION_CERTIFICATE', name: 'Incorporation Certificate', description: 'Official certificate proving your business is legally incorporated.' },
      { type: 'NATIONAL_ID', name: 'National ID', description: 'A government-issued identification card.' },
    ],
    dataExtractionSchema: {
      founderName: { type: Type.STRING, description: "The full name of the startup founder." },
      businessName: { type: Type.STRING, description: "The official name of the startup." },
      incorporationDate: { type: Type.STRING, description: "The date the business was incorporated in YYYY-MM-DD format." },
      businessSector: { type: Type.STRING, description: "The primary sector or industry of the business." },
    },
    checkEligibility: (data: ExtractedData): EligibilityResult => {
      const checks = [];
      const incorporationDateStr = typeof data.incorporationDate === 'string' ? data.incorporationDate : null;
      let isIncorporationDateMet = false;

      if (incorporationDateStr) {
        const incorporationDate = new Date(incorporationDateStr);
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        isIncorporationDateMet = incorporationDate >= oneYearAgo && incorporationDate <= now;
      }

      checks.push({
        criterion: 'Incorporation Date Within Last Year',
        isMet: isIncorporationDateMet,
      });

      const isEligible = checks.every(check => check.isMet);

      return { isEligible, checks };
    },
  },
  // MTN Graduate Trainee Program
  {
    id: 'mtn-graduate-trainee',
    name: 'MTN Graduate Trainee Program',
    description: 'A competitive program for recent graduates to kickstart their careers. Requires a CV and academic transcript.',
    icon: ScholarshipIcon,
    requiredDocuments: [
      { type: 'CV', name: 'Curriculum Vitae', description: 'Your updated CV or resume.' },
      { type: 'TRANSCRIPT', name: 'Academic Transcript', description: 'Your most recent official transcript.' },
      { type: 'NATIONAL_ID', name: 'National ID', description: 'A government-issued identification card.' },
    ],
    dataExtractionSchema: {
      graduateName: { type: Type.STRING, description: "The full name of the graduate." },
      dateOfBirth: { type: Type.STRING, description: "The graduate's date of birth in YYYY-MM-DD format." },
      gpa: { type: Type.NUMBER, description: "The graduate's Grade Point Average (GPA) on a 4.0 scale." },
      graduationDate: { type: Type.STRING, description: "The graduate's graduation date in YYYY-MM-DD format." },
    },
    checkEligibility: (data: ExtractedData): EligibilityResult => {
      const checks = [];
      const gpa = typeof data.gpa === 'number' ? data.gpa : 0;

      const isGpaMet = gpa >= 3.0;
      checks.push({
        criterion: 'Minimum GPA',
        isMet: isGpaMet,
        value: gpa,
        requirement: '>= 3.0',
      });
      
      const isEligible = checks.every(check => check.isMet);
      
      return { isEligible, checks };
    },
  },
  // Mandela Washington Fellowship
  {
    id: 'mandela-washington-fellowship',
    name: 'Mandela Washington Fellowship',
    description: 'A prestigious fellowship for young African leaders. Requires a CV, letter of recommendation, and proof of leadership experience.',
    icon: ScholarshipIcon,
    requiredDocuments: [
      { type: 'CV', name: 'Curriculum Vitae', description: 'Your updated CV or resume.' },
      { type: 'LETTER_OF_RECOMMENDATION', name: 'Letter of Recommendation', description: 'A letter from a professional or academic reference.' },
      { type: 'PROOF_OF_LEADERSHIP', name: 'Proof of Leadership Experience', description: 'Documents showcasing your leadership roles and achievements.' },
      { type: 'NATIONAL_ID', name: 'National ID', description: 'A government-issued identification card.' },
    ],
    dataExtractionSchema: {
      fellowName: { type: Type.STRING, description: "The full name of the fellow." },
      dateOfBirth: { type: Type.STRING, description: "The fellow's date of birth in YYYY-MM-DD format." },
      leadershipExperienceYears: { type: Type.INTEGER, description: "Number of years of leadership experience." },
      recommendationStrength: { type: Type.STRING, description: "Strength of the letter of recommendation (e.g., 'strong', 'moderate', 'weak')." },
    },
    checkEligibility: (data: ExtractedData): EligibilityResult => {
      const checks = [];
      const leadershipExperienceYears = typeof data.leadershipExperienceYears === 'number' ? data.leadershipExperienceYears : 0;
      const recommendationStrength = typeof data.recommendationStrength === 'string' ? data.recommendationStrength.toLowerCase() : '';

      const isLeadershipExperienceMet = leadershipExperienceYears >= 2;
      checks.push({
        criterion: 'Minimum Leadership Experience',
        isMet: isLeadershipExperienceMet,
        value: leadershipExperienceYears,
        requirement: '>= 2 years',
      });

      const isRecommendationMet = ['strong', 'moderate'].includes(recommendationStrength);
      checks.push({
        criterion: 'Letter of Recommendation Strength',
        isMet: isRecommendationMet,
        value: recommendationStrength || 'N/A',
        requirement: 'Strong or Moderate',
      });
      
      const isEligible = checks.every(check => check.isMet);
      
      return { isEligible, checks };
    },
  },
  // BillGates Foundation Scholarship
  {
    id: 'billgates-foundation-scholarship',
    name: 'BillGates Foundation Scholarship',
    description: 'A scholarship for students from low-income families who demonstrate leadership and academic excellence. Requires an essay, academic transcript, and proof of income.',
    icon: ScholarshipIcon,
    requiredDocuments: [
      { type: 'ESSAY', name: 'Scholarship Essay', description: 'An essay outlining your goals and why you deserve the scholarship.' },
      { type: 'TRANSCRIPT', name: 'Academic Transcript', description: 'Your most recent official transcript.' },
      { type: 'INCOME_STATEMENT', name: 'Income Statement', description: 'e.g., Recent Pay Stubs or a Tax Return.' },
      { type: 'NATIONAL_ID', name: 'National ID', description: 'A government-issued identification card.' },
    ],
    dataExtractionSchema: {
      studentName: { type: Type.STRING, description: "The full name of the student." },
      dateOfBirth: { type: Type.STRING, description: "The student's date of birth in YYYY-MM-DD format." },
      gpa: { type: Type.NUMBER, description: "The student's Grade Point Average (GPA) on a 4.0 scale." },
      familyIncome: { type: Type.NUMBER, description: "The total annual income of the student's family." },
    },
    checkEligibility: (data: ExtractedData): EligibilityResult => {
      const checks = [];
      const gpa = typeof data.gpa === 'number' ? data.gpa : 0;
      const familyIncome = typeof data.familyIncome === 'number' ? data.familyIncome : Infinity;

      const isGpaMet = gpa >= 3.7;
      checks.push({
        criterion: 'Minimum GPA',
        isMet: isGpaMet,
        value: gpa,
        requirement: '>= 3.7',
      });

      const isIncomeMet = familyIncome < 60000;
      checks.push({
        criterion: 'Maximum Family Income',
        isMet: isIncomeMet,
        value: familyIncome,
        requirement: '< $60,000',
      });
      
      const isEligible = checks.every(check => check.isMet);
      
      return { isEligible, checks };
    },
  }

]