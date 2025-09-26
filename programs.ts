import { Type } from '@google/genai';
import type { Program, ExtractedData, EligibilityResult } from './types';
import ScholarshipIcon from './components/icons/ScholarshipIcon';
import HousingIcon from './components/icons/HousingIcon';
import IndabaXIcon from './components/icons/IndabaXIcon';
import BankIcon from './components/icons/BankIcon';

export const AVAILABLE_PROGRAMS: Program[] = [
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
  },
  // Merit Scholarship Program
  {
    id: 'akdn-international-scholarship',
    name: 'Aga Khan Foundation International Scholarship Programme (AKF ISP)',
    description: `Postgraduate scholarships for outstanding scholars from selected countries who have no other means of financing their studies.
Established in 1969 by His Highness the Aga Khan, the programme has supported over 1,000 students worldwide.`,
    icon: ScholarshipIcon,
    requiredDocuments: [
      { type: 'BACHELOR_DEGREE', name: 'Bachelor’s Degree Certificate', description: 'Evidence of an earned undergraduate degree or equivalent ' },
      { type: 'ADMISSION_LETTER', name: 'Postgraduate Admission Letter', description: 'Official proof of admission to a reputable postgraduate institution (Masters or PhD).' },
      { type: 'FINANCIAL_PLAN', name: 'Multi-source Funding Plan', description: 'A thoughtful plan demonstrating multiple sources of funding and genuine financial need.' },
      { type: 'NATIONAL_ID', name: 'National ID / Passport', description: 'Government-issued identification document.' },
    ],
    dataExtractionSchema: {
      applicantName: { type: Type.STRING, description: "Full name of the applicant." },
      dateOfBirth: { type: Type.STRING, description: "Date of birth in YYYY-MM-DD format." },
      countryOfResidence: { type: Type.STRING, description: "Country where the applicant currently resides." },
      intendedDegree: { type: Type.STRING, description: "Postgraduate degree type (Master’s or PhD)." },
      admissionConfirmed: { type: Type.BOOLEAN, description: "Whether the applicant has confirmed admission to a reputable postgraduate institution." },
      annualFamilyIncome: { type: Type.NUMBER, description: "Total annual family income in USD." },
      age: { type: Type.INTEGER, description: "Applicant’s age in years." }
    },
    checkEligibility: (data: ExtractedData): EligibilityResult => {
      const checks = [];

      // Must hold a bachelor’s degree (assume provided if admission is confirmed)
      const hasAdmission = !!data.admissionConfirmed;
      checks.push({
        criterion: 'Confirmed admission to a reputable postgraduate programme',
        isMet: hasAdmission,
        value: hasAdmission ? 'Yes' : 'No',
        requirement: 'Admission confirmed'
      });

      // Preferably under 30
      const age = typeof data.age === 'number' ? data.age : 99;
      const isAgePreferred = age < 30;
      checks.push({
        criterion: 'Preferred age under 30',
        isMet: isAgePreferred,
        value: age,
        requirement: '< 30 (preference, not strict)'
      });

      // Genuine financial need: family income should be relatively low (< $60k as a proxy)
      const familyIncome = typeof data.annualFamilyIncome === 'number' ? data.annualFamilyIncome : Infinity;
      const isFinancialNeed = familyIncome < 60000;
      checks.push({
        criterion: 'Demonstrates genuine financial need',
        isMet: isFinancialNeed,
        value: familyIncome,
        requirement: '< $60,000 annual family income (indicative)'
      });

      const isEligible = checks.every(check => check.isMet);
      return { isEligible, checks };
    },
  },
  {
    id: 'chevening-scholarship',
    // ProgramCategory: 'Scholarship',
    name: 'Chevening Scholarship – Afghanistan 2025-2026 Cycle (UK)  ',
    description: `The UK government’s prestigious international scholarships programme, funded by the Foreign, Commonwealth and Development Office (FCDO) and partner organisations. 
Fully funded for one-year master’s study in the UK. 
Applications for the 2025–2026 cycle are open until 7 October 2025 at 12:00 (UTC).`,
    icon: ScholarshipIcon,
    requiredDocuments: [
      { type: 'BACHELOR_DEGREE', name: 'Undergraduate Degree Certificate', description: 'Proof of completion of a bachelor’s level qualification (or equivalent) required for admission to a UK master’s degree.' },
      { type: 'OFFER_LETTER', name: 'UK University Offer Letter', description: 'Unconditional offer from a UK university for a one-year master’s programme.' },
      { type: 'REFERENCES', name: 'Two References', description: 'Two professional or academic references, submitted via the Chevening online system.' },
      { type: 'PASSPORT', name: 'Passport / National ID', description: 'Valid travel document for visa and travel arrangements.' },
    ],
    dataExtractionSchema: {
      applicantName: { type: Type.STRING, description: "Full name of the applicant." },
      dateOfBirth: { type: Type.STRING, description: "Date of birth in YYYY-MM-DD format." },
      workExperienceYears: { type: Type.NUMBER, description: "Total years of eligible work experience." },
      hasBachelorDegree: { type: Type.BOOLEAN, description: "Whether the applicant has an undergraduate degree (or equivalent)." },
      universityOfferConfirmed: { type: Type.BOOLEAN, description: "Whether an unconditional UK university offer has been secured." },
      referencesProvided: { type: Type.BOOLEAN, description: "Whether two valid references have been submitted." },
    },
    checkEligibility: (data: ExtractedData): EligibilityResult => {
      const checks = [];

      // Must hold a bachelor’s degree or equivalent
      const hasBachelor = !!data.hasBachelorDegree;
      checks.push({
        criterion: 'Bachelor’s degree or equivalent',
        isMet: hasBachelor,
        value: hasBachelor ? 'Yes' : 'No',
        requirement: 'Undergraduate qualification required'
      });

      // Minimum two years of work experience
      const workYears = typeof data.workExperienceYears === 'number' ? data.workExperienceYears : 0;
      const isWorkMet = workYears >= 2;
      checks.push({
        criterion: 'Minimum work experience',
        isMet: isWorkMet,
        value: workYears,
        requirement: '≥ 2 years'
      });

      // Two references required
      const refs = !!data.referencesProvided;
      checks.push({
        criterion: 'Two valid references submitted',
        isMet: refs,
        value: refs ? 'Yes' : 'No',
        requirement: '2 references'
      });

      // Must secure a UK university offer
      const offer = !!data.universityOfferConfirmed;
      checks.push({
        criterion: 'Unconditional UK university offer',
        isMet: offer,
        value: offer ? 'Yes' : 'No',
        requirement: 'Offer confirmed'
      });

      const isEligible = checks.every(check => check.isMet);
      return { isEligible, checks };
    },
  },
  {
    id: 'mtn-senior-manager-forensics',
      // ProgramCategory: 'Job',
    name: 'MTN Uganda – Senior Manager Forensics (Internal Audit & Forensics)',
    description: `Leads and reports on internal investigations by analysing and interpreting physical and digital evidence in accordance with professional standards (ACFE etc.). Oversees fraud investigations, strengthens internal controls and provides expert testimony to safeguard MTN Uganda’s operations.`,
    icon: HousingIcon, // or create a custom icon if you prefer
    requiredDocuments: [
      { type: 'BACHELOR_DEGREE', name: 'Bachelor’s Degree Certificate', description: 'Accounting, Statistics, Law or related field.' },
      { type: 'PROFESSIONAL_CERT', name: 'Professional Forensics/Info-Sec Certification', description: 'e.g. CFE, CHFI, GCFA, CISM, CISA or CEH.' },
      { type: 'WORK_EXPERIENCE_PROOF', name: 'Evidence of 5–8 Years Fraud Investigation Experience', description: 'Letters or contracts showing fraud detection and investigation roles.' },
      { type: 'LEADERSHIP_EXPERIENCE', name: 'Evidence of ≥5 Years in Senior Leadership/Management', description: 'Documented proof of senior management responsibilities.' },
      { type: 'NATIONAL_ID', name: 'National ID / Passport', description: 'Government-issued identification document.' }
    ],
    dataExtractionSchema: {
      applicantName: { type: Type.STRING, description: 'Full name of the applicant.' },
      hasBachelorDegree: { type: Type.BOOLEAN, description: 'Holds a bachelor’s degree in Accounting, Statistics, Law or related field.' },
      professionalCertification: { type: Type.BOOLEAN, description: 'Holds at least one relevant professional certification (CFE, CHFI, GCFA, CISM, CISA, CEH).' },
      fraudInvestigationYears: { type: Type.NUMBER, description: 'Total years of experience in fraud detection, prevention and investigations.' },
      seniorLeadershipYears: { type: Type.NUMBER, description: 'Total years in senior leadership/management roles.' }
    },
    checkEligibility: (data: ExtractedData): EligibilityResult => {
      const checks = [];

      const hasDegree = !!data.hasBachelorDegree;
      checks.push({
        criterion: 'Bachelor’s degree in relevant field',
        isMet: hasDegree,
        value: hasDegree ? 'Yes' : 'No',
        requirement: 'Bachelor’s degree required'
      });

      const hasCert = !!data.professionalCertification;
      checks.push({
        criterion: 'Relevant professional certification',
        isMet: hasCert,
        value: hasCert ? 'Yes' : 'No',
        requirement: 'At least one of CFE/CHFI/GCFA/CISM/CISA/CEH'
      });

      const fraudYears = typeof data.fraudInvestigationYears === 'number' ? data.fraudInvestigationYears : 0;
      const fraudOk = fraudYears >= 5;
      checks.push({
        criterion: 'Fraud investigations experience',
        isMet: fraudOk,
        value: fraudYears,
        requirement: '≥ 5 years (preferably 5–8)'
      });

      const leadYears = typeof data.seniorLeadershipYears === 'number' ? data.seniorLeadershipYears : 0;
      const leadOk = leadYears >= 5;
      checks.push({
        criterion: 'Senior leadership/management experience',
        isMet: leadOk,
        value: leadYears,
        requirement: '≥ 5 years'
      });

      const isEligible = checks.every(c => c.isMet);
      return { isEligible, checks };
    
    }
  },
  {
    id: 'indabax-uganda-2025',
    name: 'Deep Learning Indaba𝕏 Uganda 2025 Conference',
    description: `The premier Deep Learning & AI conference in Uganda. Join us 10–14 November 2025 at Silver Springs Hotel, Bugolobi – Kampala. Mission: Strengthen Ugandan Machine Learning and AI by building communities, creating leadership, and recognising excellence in research and applications.`,
    icon: IndabaXIcon,
    requiredDocuments: [
      { type: 'REGISTRATION_FORM', name: 'Online Registration Form', description: 'Completed conference registration form.' },
      { type: 'MOTIVATION_STATEMENT', name: 'Motivation Statement', description: 'Brief (≤500 characters) reason for attending.' },
      { type: 'NATIONAL_ID', name: 'National ID / Passport', description: 'Government-issued ID for entry to the venue.' },
    ],
    dataExtractionSchema: {
      applicantName: { type: Type.STRING, description: 'Full name of the applicant.' },
      email: { type: Type.STRING, description: 'Valid email address for conference communication.' },
      hasSubmittedMotivation: { type: Type.BOOLEAN, description: 'Whether the motivation statement has been provided.' },
    },
    checkEligibility: (data: ExtractedData): EligibilityResult => {
      const checks = [];

      const hasMotivation = !!data.hasSubmittedMotivation;
      checks.push({
        criterion: 'Motivation statement submitted',
        isMet: hasMotivation,
        value: hasMotivation ? 'Yes' : 'No',
        requirement: 'Motivation statement is required'
      });

      const isEligible = checks.every(c => c.isMet);
      return { isEligible, checks };
    },

  },
  {
    id: 'bou-examiner-it-cybersecurity',
      // ProgramCategory: 'Job',
    name: 'Bank of Uganda – Examiner: IT & Cyber Security (CBs & NBFIs)',
    description: `Assesses, monitors and enforces compliance with IT governance,
cybersecurity and digital banking risk standards in Commercial Banks
and Non-Bank Financial Institutions. Ensures secure, resilient and
compliant technology environments to safeguard the financial system
and protect customer data.`,
    icon: BankIcon,
    requiredDocuments: [
      { type: 'BACHELOR_DEGREE', name: 'Bachelor’s Degree Certificate', description: 'IT, Computer Science, Information Systems, Cybersecurity or related field.' },
      { type: 'CERTIFICATION', name: 'Professional Cybersecurity Certification', description: 'At least one of CISA, CISSP, OSCP, CRISC, ISO 27001 Lead Auditor or CompTIA Security+.' },
      { type: 'WORK_EXPERIENCE_PROOF', name: 'Proof of 5 Years Relevant Experience', description: 'Evidence of IT audit/cybersecurity/risk management experience.' },
      { type: 'NATIONAL_ID', name: 'National ID / Passport', description: 'Government-issued identification document.' }
    ],
    dataExtractionSchema: {
      applicantName: { type: Type.STRING, description: 'Full name of the applicant.' },
      age: { type: Type.INTEGER, description: 'Age in years.' },
      hasBachelorDegree: { type: Type.BOOLEAN, description: 'Holds a bachelor’s degree in the listed fields.' },
      hasRequiredCertification: { type: Type.BOOLEAN, description: 'Has at least one of the required professional certifications.' },
      relevantExperienceYears: { type: Type.NUMBER, description: 'Years of IT audit/cybersecurity/risk management experience.' },
    },
    checkEligibility: (data: ExtractedData): EligibilityResult => {
      const checks = [];

      const degree = !!data.hasBachelorDegree;
      checks.push({
        criterion: 'Bachelor’s degree in relevant field',
        isMet: degree,
        value: degree ? 'Yes' : 'No',
        requirement: 'Required'
      });

      const cert = !!data.hasRequiredCertification;
      checks.push({
        criterion: 'At least one required professional certification',
        isMet: cert,
        value: cert ? 'Yes' : 'No',
        requirement: 'CISA / CISSP / OSCP / CRISC / ISO 27001 LA / CompTIA Security+'
      });

      const exp = typeof data.relevantExperienceYears === 'number' ? data.relevantExperienceYears : 0;
      const expOk = exp >= 5;
      checks.push({
        criterion: 'Minimum 5 years relevant experience',
        isMet: expOk,
        value: exp,
        requirement: '≥ 5 years'
      });

      const age = typeof data.age === 'number' ? data.age : 99;
      const ageOk = age >= 30 && age <= 37;
      checks.push({
        criterion: 'Age between 30 and 37',
        isMet: ageOk,
        value: age,
        requirement: '30 – 37 years'
      });

      return { isEligible: checks.every(c => c.isMet), checks };
    }
  },

  {
    id: 'bou-officer-information-systems-audit',
      // ProgramCategory: 'Job',
    name: 'Bank of Uganda – Officer, Information Systems Audit',
    description: `Conducts audits and investigations across the Bank’s IT environment,
evaluating the effectiveness of information systems, infrastructure and
related processes to ensure robust IT governance, security and
regulatory compliance.`,
    icon: BankIcon,
    requiredDocuments: [
      { type: 'BACHELOR_DEGREE', name: 'Bachelor’s Degree Certificate', description: 'Computer Science, IT, Information Systems or Cybersecurity.' },
      { type: 'CERTIFICATION', name: 'Professional IT Audit/Security Certification', description: 'Any of CISA, CGEIT, CDPSE, CISM, CEH, CHFI, ISO27001.' },
      { type: 'WORK_EXPERIENCE_PROOF', name: 'Proof of 5 Years IT Audit Experience', description: 'Letters/contracts demonstrating IT audit or IT security experience.' },
      { type: 'NATIONAL_ID', name: 'National ID / Passport', description: 'Government-issued identification document.' }
    ],
    dataExtractionSchema: {
      applicantName: { type: Type.STRING, description: 'Full name of the applicant.' },
      age: { type: Type.INTEGER, description: 'Age in years.' },
      hasBachelorDegree: { type: Type.BOOLEAN, description: 'Holds a bachelor’s degree in the listed IT fields.' },
      hasRequiredCertification: { type: Type.BOOLEAN, description: 'Has at least one of the required professional certifications.' },
      relevantExperienceYears: { type: Type.NUMBER, description: 'Years of IT audit/IT security experience.' },
    },
    checkEligibility: (data: ExtractedData): EligibilityResult => {
      const checks = [];

      const degree = !!data.hasBachelorDegree;
      checks.push({
        criterion: 'Bachelor’s degree in relevant field',
        isMet: degree,
        value: degree ? 'Yes' : 'No',
        requirement: 'Required'
      });

      const cert = !!data.hasRequiredCertification;
      checks.push({
        criterion: 'At least one required professional certification',
        isMet: cert,
        value: cert ? 'Yes' : 'No',
        requirement: 'CISA / CGEIT / CDPSE / CISM / CEH / CHFI / ISO27001'
      });

      const exp = typeof data.relevantExperienceYears === 'number' ? data.relevantExperienceYears : 0;
      const expOk = exp >= 5;
      checks.push({
        criterion: 'Minimum 5 years relevant experience',
        isMet: expOk,
        value: exp,
        requirement: '≥ 5 years'
      });

      const age = typeof data.age === 'number' ? data.age : 99;
      const ageOk = age >= 30 && age <= 37;
      checks.push({
        criterion: 'Age between 30 and 37',
        isMet: ageOk,
        value: age,
        requirement: '30 – 37 years'
      });

      return { isEligible: checks.every(c => c.isMet), checks };
    }
  },

]