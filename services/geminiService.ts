import { GoogleGenAI, Type } from "@google/genai";
import type { DocumentType, ExtractedData, IdentificationResult } from '../types';

// Initialize the Google Gemini API client.
// The API key is sourced from the environment variables as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a GoogleGenAI.Part object for use with the Gemini API.
 * This function reads the file as a Data URL, extracts the base64 content, and returns
 * it in the format required for inline data in the Gemini API.
 * @param file The File object to convert.
 * @returns A promise that resolves to a Part object.
 */
const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: {
            data: await base64EncodedDataPromise,
            mimeType: file.type,
        },
    };
};

/**
 * Identifies the type of a document using the Gemini API.
 * It sends the document to the model and asks for classification and a summary,
 * expecting a JSON response.
 * @param file The file to identify.
 * @returns A promise that resolves to an IdentificationResult.
 */
export const identifyDocumentType = async (file: File): Promise<IdentificationResult> => {
    const model = 'gemini-2.5-flash';
    const imagePart = await fileToGenerativePart(file);

    const documentTypes: DocumentType[] = ['TRANSCRIPT', 'NATIONAL_ID', 'INCOME_STATEMENT', 'LEASE_AGREEMENT'];
    
    const prompt = `You are an expert document classifier. Analyze the provided document and identify its type.
The possible types are: ${documentTypes.join(', ')}.
Here are some hints:
- TRANSCRIPT: Should contain course names, grades, and GPA.
- NATIONAL_ID: A government-issued photo ID with a name and date of birth.
- INCOME_STATEMENT: Look for terms like "pay stub," "earnings statement," "W-2," or tax forms. It must contain detailed financial data like gross pay, taxes, and deductions. A simple bank statement is NOT an income statement.
- LEASE_AGREEMENT: A formal contract for renting property, mentioning landlord, tenant, rent amount, and lease term.

If the document does not clearly match one of these, classify it as UNKNOWN. Also provide a brief, one-sentence summary of the document's content. Respond in JSON format.`;

    // Define the expected JSON schema for the model's response.
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            documentType: {
                type: Type.STRING,
                description: `The identified document type. Must be one of: ${documentTypes.join(', ')}, UNKNOWN.`,
            },
            summary: {
                type: Type.STRING,
                description: "A brief, one-sentence summary of the document's content.",
            }
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        const docType = result.documentType as string;

        if (documentTypes.includes(docType as DocumentType)) {
            return {
                type: docType as DocumentType,
                summary: result.summary,
            };
        }

        return {
            type: 'UNKNOWN',
            summary: result.summary || "Could not determine document type.",
        };
    } catch (e) {
        console.error("Error identifying document type:", e);
        return {
            type: 'UNKNOWN',
            summary: 'An error occurred during AI analysis.',
        };
    }
};

/**
 * Extracts structured data from a set of documents based on a provided schema.
 * It combines all documents into a single prompt for the Gemini API and requests
 * the data in a structured JSON format.
 * @param files A map of DocumentType to File objects.
 * @param schema The schema to guide data extraction.
 * @returns A promise that resolves to ExtractedData or null if an error occurs.
 */
export const extractDataFromDocuments = async (
    files: Map<DocumentType, File>,
    schema: Record<string, { type: Type; description?: string; }>
): Promise<ExtractedData | null> => {
    const model = 'gemini-2.5-flash';

    const parts: any[] = [{
        text: `You are an expert data extraction AI. Analyze the following documents and extract the information requested in the provided JSON schema. Pay close attention to formatting requirements (like YYYY-MM-DD for dates). If a piece of information cannot be found in any of the documents, return null for that field.
IMPORTANT: For financial data like 'monthlyIncome', if only weekly or bi-weekly pay is listed, calculate the monthly equivalent (assume 4.33 weeks per month). For 'householdSize', look for this information on tax forms if available.`
    }];

    // Add each file to the prompt parts array
    for (const [docType, file] of files.entries()) {
        parts.push({ text: `\n--- START OF DOCUMENT: ${docType} ---` });
        parts.push(await fileToGenerativePart(file));
        parts.push({ text: `--- END OF DOCUMENT: ${docType} ---` });
    }

    const responseSchema = {
        type: Type.OBJECT,
        properties: schema,
    };
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: { parts: parts },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const jsonString = response.text.trim();
        const extractedData = JSON.parse(jsonString);
        
        return extractedData as ExtractedData;

    } catch (e) {
        console.error("Error extracting data from documents:", e);
        return null;
    }
};