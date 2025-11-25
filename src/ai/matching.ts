
import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const ai = genkit({
  plugins: [googleAI()],
  model: "googleai/gemini-1.5-flash",
});

const StudentSchema = z.object({
  id: z.string(),
  name: z.string(),
  ageGroup: z.string(),
  preferredSubject: z.string(),
  preferredDay: z.string().optional(),
  preferredTimeSlot: z.string().optional(),
});

const TeacherSchema = z.object({
  id: z.string(),
  name: z.string(),
  gender: z.string().optional(),
  preferredLocations: z.array(z.string()),
  availableDays: z.array(z.string()).optional(),
  preferredTimeslots: z.array(z.string()).optional(),
  preferredSyllabus: z.array(z.string()).optional(),
  preferredAudience: z.array(z.string()).optional(),
});

const MatchResultSchema = z.object({
  teacherId: z.string(),
  score: z.number().describe("A score from 0 to 100 indicating the quality of the match."),
  reasoning: z.string().describe("A brief explanation of why this teacher is a good match for the student."),
});

export const findMatchesFlow = ai.defineFlow(
  {
    name: 'findMatches',
    inputSchema: z.object({
      students: z.array(StudentSchema),
      teachers: z.array(TeacherSchema),
      criteria: z.object({
        location: z.array(z.string()).optional(),
        availability: z.array(z.string()).optional(),
      }).optional(),
    }),
    outputSchema: z.array(MatchResultSchema),
  },
  async ({ students, teachers, criteria }) => {
    // We will process the match for the first student in the list for now, 
    // or we could iterate if we wanted to match a group.
    // For this specific flow, let's assume we are matching the GROUP of students 
    // to a single teacher (as per the UI flow).
    
    const prompt = `
      You are an expert educational coordinator. Your task is to find the best teacher for a group of students.
      
      Here is the group of students:
      ${JSON.stringify(students, null, 2)}
      
      Here is the pool of available teachers:
      ${JSON.stringify(teachers, null, 2)}
      
      ${criteria ? `Additional Criteria provided by Admin: ${JSON.stringify(criteria, null, 2)}` : ''}
      
      Logic for matching:
      1. **Availability**: The teacher MUST be available on the days/times preferred by the students (or the admin criteria).
      2. **Location**: The teacher MUST be willing to teach in the location (if specified).
      3. **Syllabus**: The teacher's preferred syllabus should match the student's needs (e.g., Quran Reading vs. Basic Knowledge).
      4. **Audience**: The teacher should be comfortable with the age group of the students.
      5. **Gender**: Consider cultural sensitivities (e.g., female teacher for female adults if possible, though not strictly required unless specified).
      
      Return a list of the top 3 teachers who are the best fit. 
      Calculate a score (0-100) based on how many criteria they meet.
      Provide a concise reasoning for each.
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      output: { schema: z.array(MatchResultSchema) },
    });

    if (!output) {
      throw new Error("Failed to generate matches");
    }

    return output;
  }
);
