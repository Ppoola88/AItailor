import { describe, expect, it } from "vitest";

import {
  buildCandidateKeywordSet,
  createSuggestions,
  extractRequiredKeywords,
} from "./match-score-utils";

describe("match-score-utils", () => {
  it("extracts known job keywords from description", () => {
    const keywords = extractRequiredKeywords(
      "Looking for a TypeScript, React, Node.js engineer with PostgreSQL and Docker experience.",
    );

    expect(keywords).toContain("typescript");
    expect(keywords).toContain("react");
    expect(keywords).toContain("node.js");
    expect(keywords).toContain("postgresql");
    expect(keywords).toContain("docker");
  });

  it("builds candidate keyword set from skills and bullets", () => {
    const set = buildCandidateKeywordSet({
      skills: ["TypeScript", "React"],
      experiences: [
        {
          role: "Full Stack Engineer",
          bulletPoints: ["Built REST API endpoints and CI/CD pipelines"],
        },
      ],
    });

    expect(set.has("typescript")).toBe(true);
    expect(set.has("react")).toBe(true);
    expect(set.has("rest api")).toBe(true);
    expect(set.has("ci/cd")).toBe(true);
  });

  it("returns targeted suggestions for missing skills", () => {
    const suggestions = createSuggestions(["docker", "kubernetes"]);

    expect(suggestions.length).toBe(2);
    expect(suggestions[0]).toContain("docker");
  });
});
