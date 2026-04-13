export const SKILL_KEYWORDS = [
  "javascript",
  "typescript",
  "react",
  "next.js",
  "node.js",
  "express",
  "postgresql",
  "prisma",
  "rest api",
  "graphql",
  "aws",
  "azure",
  "docker",
  "kubernetes",
  "redis",
  "testing",
  "jest",
  "cypress",
  "ci/cd",
  "tailwind css",
  "machine learning",
  "openai",
  "prompt engineering",
  "system design",
  "microservices",
  "agile",
  "leadership",
  "communication",
  "sql",
  "python",
] as const;

export type CandidateProfileForScoring = {
  skills: string[];
  experiences: {
    role: string;
    bulletPoints: string[];
  }[];
};

export function normalize(input: string) {
  return input.toLowerCase().trim();
}

export function extractRequiredKeywords(jobDescription: string) {
  const text = normalize(jobDescription);
  const found = SKILL_KEYWORDS.filter((keyword) => text.includes(keyword));
  return [...new Set(found)].slice(0, 20);
}

export function buildCandidateKeywordSet(profile: CandidateProfileForScoring) {
  const keywords = new Set<string>();

  profile.skills.forEach((item) => keywords.add(normalize(item)));

  profile.experiences.forEach((experience) => {
    keywords.add(normalize(experience.role));
    experience.bulletPoints.forEach((bullet) => {
      const lower = normalize(bullet);
      SKILL_KEYWORDS.forEach((skill) => {
        if (lower.includes(skill)) {
          keywords.add(skill);
        }
      });
    });
  });

  return keywords;
}

export function createSuggestions(missingSkills: string[]) {
  if (missingSkills.length === 0) {
    return [
      "Your profile aligns well with this role. Prioritize tailoring bullet points with role-specific keywords.",
      "Quantify your achievements in the first two experience entries for stronger recruiter impact.",
    ];
  }

  return missingSkills.slice(0, 5).map((skill) => {
    return `Add evidence for ${skill} through a project bullet, certification, or quantified achievement in your resume.`;
  });
}
