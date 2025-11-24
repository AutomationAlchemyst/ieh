import { User, users } from "@/lib/data";

export interface MatchingCriteria {
  location: string[];
  availability: string[];
}

export interface MatchResult {
  teacher: User;
  score: number;
  reasoning: string;
}

export async function findMatches(criteria: MatchingCriteria): Promise<MatchResult[]> {
  // Simulate network delay for "AI Processing"
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const teachers = users.filter((u) => u.role === "teacher");

  const results = teachers.map((teacher) => {
    let score = 0;
    const reasons: string[] = [];

    // Location Matching (High Weight)
    const matchedLocations = teacher.preferredLocations?.filter(l => criteria.location.includes(l)) || [];
    if (matchedLocations.length > 0) {
      score += 40;
      reasons.push(`Matches location preference (${matchedLocations.join(", ")}).`);
    }

    // Availability Matching (High Weight)
    const matchedAvailability = teacher.availableDays?.filter(d => criteria.availability.includes(d)) || [];
    if (matchedAvailability.length > 0) {
      score += 40;
      reasons.push(`Available on requested days (${matchedAvailability.join(", ")}).`);
    }

    // Base Score for being an active teacher
    if (teacher.status === 'Active') {
        score += 10;
    }

    // Normalize Score
    score = Math.min(score, 100);

    // Generate "AI" Reasoning
    let reasoning = "";
    if (score >= 80) {
        reasoning = `Excellent match! ${teacher.name} is a strong candidate because they ${reasons.join(" ")}`;
    } else if (score >= 50) {
        reasoning = `Good potential match. ${teacher.name} ${reasons.join(" ")}`;
    } else {
        reasoning = `Low match probability. ${teacher.name} does not align well with the requested criteria.`;
    }

    return {
      teacher,
      score,
      reasoning,
    };
  });

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}
