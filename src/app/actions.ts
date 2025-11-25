"use server";

import { findMatchesFlow } from "@/ai/matching";
import { User } from "@/lib/data";

// This is a Server Action that calls the Genkit flow
export async function generateMatchesAction(
  students: any[], 
  teachers: any[], 
  criteria: { location: string[], availability: string[] }
) {
  try {
    const result = await findMatchesFlow({
      students,
      teachers,
      criteria
    });
    return result;
  } catch (error) {
    console.error("Genkit matching failed:", error);
    // Fallback to empty list or throw
    return [];
  }
}
