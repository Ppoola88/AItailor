import type { JobListingDTO } from "@/lib/validation/jobs";

const FETCH_TIMEOUT_MS = 7000;
const REMOTIVE_URL = "https://remotive.com/api/remote-jobs";
const ARBEITNOW_URL = "https://www.arbeitnow.com/api/job-board-api";

const mockJobs: JobListingDTO[] = [
  {
    id: "job_1",
    title: "Frontend Engineer (Next.js)",
    company: "Northstar Labs",
    location: "Remote",
    description:
      "Build accessible, high-performance UI with Next.js and TypeScript. Collaborate with design and backend teams.",
    applyLink: "https://example.com/jobs/job_1",
    postedAt: "2026-04-03",
    source: "mock-board",
  },
  {
    id: "job_2",
    title: "Full Stack Engineer",
    company: "CloudRiver Tech",
    location: "New York, NY",
    description:
      "Develop end-to-end product features across React, Node.js, and PostgreSQL. Own architecture and delivery quality.",
    applyLink: "https://example.com/jobs/job_2",
    postedAt: "2026-04-02",
    source: "mock-board",
  },
  {
    id: "job_3",
    title: "AI Product Engineer",
    company: "ResumeForge",
    location: "San Francisco, CA",
    description:
      "Integrate LLM APIs to generate personalized content, evaluate model output quality, and ship production-grade AI workflows.",
    applyLink: "https://example.com/jobs/job_3",
    postedAt: "2026-04-01",
    source: "mock-board",
  },
  {
    id: "job_4",
    title: "Backend Engineer (Node.js)",
    company: "HireStack",
    location: "Austin, TX",
    description:
      "Design scalable APIs, implement auth and rate limiting, and optimize PostgreSQL queries for SaaS workloads.",
    applyLink: "https://example.com/jobs/job_4",
    postedAt: "2026-03-30",
    source: "mock-board",
  },
  {
    id: "job_5",
    title: "Platform Engineer",
    company: "TalentOps",
    location: "Remote",
    description:
      "Improve CI/CD, observability, and reliability for a multi-tenant SaaS platform running on modern cloud infrastructure.",
    applyLink: "https://example.com/jobs/job_5",
    postedAt: "2026-03-29",
    source: "mock-board",
  },
  {
    id: "job_6",
    title: "QA Engineer",
    company: "Verity Systems",
    location: "Remote",
    description:
      "Own manual and automated test plans, execute regression suites, and partner with developers to improve release quality.",
    applyLink: "https://example.com/jobs/job_6",
    postedAt: "2026-03-28",
    source: "mock-board",
  },
  {
    id: "job_7",
    title: "Senior Quality Assurance Engineer",
    company: "BlueOrbit",
    location: "Dallas, TX",
    description:
      "Design quality strategy, build test automation using Playwright, and drive defect prevention across web releases.",
    applyLink: "https://example.com/jobs/job_7",
    postedAt: "2026-03-27",
    source: "mock-board",
  },
  {
    id: "job_8",
    title: "SDET",
    company: "SparkCommerce",
    location: "Bangalore, IN",
    description:
      "Build API and UI automation frameworks, improve CI test reliability, and track product quality metrics.",
    applyLink: "https://example.com/jobs/job_8",
    postedAt: "2026-03-26",
    source: "mock-board",
  },
  {
    id: "job_9",
    title: "Software Test Engineer",
    company: "Nexa Health",
    location: "Hyderabad, IN",
    description:
      "Create test cases for healthcare workflows, perform exploratory testing, and maintain Selenium-based suites.",
    applyLink: "https://example.com/jobs/job_9",
    postedAt: "2026-03-25",
    source: "mock-board",
  },
  {
    id: "job_10",
    title: "Automation QA Analyst",
    company: "FinEdge",
    location: "Pune, IN",
    description:
      "Automate critical payment flows, validate release candidates, and collaborate with product and engineering on acceptance criteria.",
    applyLink: "https://example.com/jobs/job_10",
    postedAt: "2026-03-24",
    source: "mock-board",
  },
  {
    id: "job_11",
    title: "Mobile QA Engineer",
    company: "QuickCab",
    location: "Remote",
    description:
      "Test iOS and Android app releases, run smoke and compatibility suites, and automate high-value mobile journeys.",
    applyLink: "https://example.com/jobs/job_11",
    postedAt: "2026-03-23",
    source: "mock-board",
  },
  {
    id: "job_12",
    title: "Manual Tester",
    company: "LedgerLoop",
    location: "Chennai, IN",
    description:
      "Perform feature validation, reproduce production defects, and document clear defect reports for web applications.",
    applyLink: "https://example.com/jobs/job_12",
    postedAt: "2026-03-22",
    source: "mock-board",
  },
];

const querySynonyms: Record<string, string[]> = {
  qa: ["quality assurance", "test", "tester", "sdet", "automation"],
  testing: ["test", "tester", "quality assurance", "qa"],
  tester: ["test", "testing", "qa", "quality assurance"],
  sdet: ["qa", "test automation", "quality assurance", "automation"],
};

const locationSynonyms: Record<string, string[]> = {
  usa: ["us", "united states", "new york", "san francisco", "austin", "dallas", "tx", "ny", "ca"],
  us: ["usa", "united states", "new york", "san francisco", "austin", "dallas", "tx", "ny", "ca"],
  uk: ["united kingdom", "england", "scotland", "wales", "london", "manchester"],
  india: ["in", "bangalore", "hyderabad", "pune", "chennai", "mumbai", "delhi"],
};

type RemotiveJob = {
  id: number;
  title: string;
  company_name: string;
  candidate_required_location: string;
  description: string;
  url: string;
  publication_date: string;
};

type ArbeitnowJob = {
  slug?: string;
  title?: string;
  company_name?: string;
  location?: string;
  description?: string;
  url?: string;
  created_at?: string | number;
  remote?: boolean;
};

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function truncate(input: string, max: number) {
  if (input.length <= max) {
    return input;
  }
  return `${input.slice(0, max - 3)}...`;
}

function parsePublishedDate(input: string | number | undefined) {
  if (input === undefined || input === null) {
    return null;
  }

  if (typeof input === "number") {
    const millis = input < 1_000_000_000_000 ? input * 1000 : input;
    const parsedFromNumber = new Date(millis);
    return Number.isNaN(parsedFromNumber.getTime()) ? null : parsedFromNumber;
  }

  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return null;
  }

  if (/^\d+$/.test(trimmed)) {
    const numeric = Number(trimmed);
    if (!Number.isNaN(numeric)) {
      const millis = numeric < 1_000_000_000_000 ? numeric * 1000 : numeric;
      const parsedFromNumericString = new Date(millis);
      return Number.isNaN(parsedFromNumericString.getTime()) ? null : parsedFromNumericString;
    }
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeDate(input: string | number | undefined) {
  const parsed = parsePublishedDate(input);
  return (parsed ?? new Date()).toISOString().slice(0, 10);
}

function getSixMonthsAgo() {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 6);
  return cutoff;
}

function isRecentJob(postedAt: string, cutoff: Date) {
  const parsed = parsePublishedDate(postedAt);
  if (!parsed) {
    return false;
  }
  return parsed >= cutoff;
}

async function fetchJsonWithTimeout<T>(url: string): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchRemotiveJobs(query: string, limit: number) {
  const search = query.trim();
  const url = search.length > 0 ? `${REMOTIVE_URL}?search=${encodeURIComponent(search)}` : REMOTIVE_URL;

  const payload = await fetchJsonWithTimeout<{ jobs?: RemotiveJob[] }>(url);
  const jobs = payload?.jobs ?? [];

  return jobs.slice(0, limit).map((job) => ({
    id: `remotive_${job.id}`,
    title: job.title,
    company: job.company_name,
    location: job.candidate_required_location || "Remote",
    description: truncate(stripHtml(job.description ?? ""), 700),
    applyLink: job.url,
    postedAt: normalizeDate(job.publication_date),
    source: "remotive",
  }));
}

async function fetchArbeitnowJobs(query: string, limit: number) {
  const payload = await fetchJsonWithTimeout<{ data?: ArbeitnowJob[] }>(ARBEITNOW_URL);
  const jobs = payload?.data ?? [];

  const normalized = jobs.map((job, index) => ({
    id: `arbeitnow_${job.slug ?? index}`,
    title: job.title ?? "Untitled role",
    company: job.company_name ?? "Unknown company",
    location: job.remote ? "Remote" : job.location ?? "Unspecified",
    description: truncate(stripHtml(job.description ?? ""), 700),
    applyLink: job.url ?? "https://www.arbeitnow.com/",
    postedAt: normalizeDate(job.created_at),
    source: "arbeitnow",
  }));

  if (query.trim().length === 0) {
    return normalized.slice(0, limit);
  }

  return normalized.filter((job) => matchesJobQuery(job, query)).slice(0, limit);
}

function dedupeJobs(jobs: JobListingDTO[]) {
  const seen = new Set<string>();
  const result: JobListingDTO[] = [];

  for (const job of jobs) {
    const key = `${job.title.toLowerCase()}|${job.company.toLowerCase()}|${job.applyLink.toLowerCase()}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(job);
  }

  return result;
}

async function fetchFreeJobs(options?: { q?: string; location?: string; limit?: number }) {
  const q = options?.q?.trim() ?? "";
  const limit = Math.max(options?.limit ?? 25, 1);
  const sixMonthsAgo = getSixMonthsAgo();

  const [remotiveJobs, arbeitnowJobs] = await Promise.all([
    fetchRemotiveJobs(q, limit),
    fetchArbeitnowJobs(q, limit),
  ]);

  const merged = dedupeJobs([...remotiveJobs, ...arbeitnowJobs]);
  return merged.filter((job) => isRecentJob(job.postedAt, sixMonthsAgo)).sort((a, b) => b.postedAt.localeCompare(a.postedAt));
}

function includesCaseInsensitive(base: string, query: string) {
  return base.toLowerCase().includes(query.toLowerCase());
}

function tokenizeQuery(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}

function expandQueryTokens(tokens: string[]) {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    const synonyms = querySynonyms[token];
    if (!synonyms) {
      continue;
    }
    for (const synonym of synonyms) {
      expanded.add(synonym);
    }
  }
  return [...expanded];
}

function matchesByTokens(text: string, tokens: string[]) {
  const normalized = text.toLowerCase();
  return tokens.some((token) => containsToken(normalized, token));
}

function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsToken(text: string, token: string) {
  const normalizedToken = token.trim().toLowerCase();
  if (normalizedToken.length === 0) {
    return false;
  }

  const pattern = `(^|[^a-z0-9])${escapeRegExp(normalizedToken)}([^a-z0-9]|$)`;
  return new RegExp(pattern, "i").test(text);
}

function expandLocationTokens(tokens: string[]) {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    const synonyms = locationSynonyms[token];
    if (!synonyms) {
      continue;
    }

    for (const synonym of synonyms) {
      expanded.add(synonym);
    }
  }

  return [...expanded];
}

function matchesLocationQuery(jobLocation: string, query: string) {
  const trimmed = query.trim();
  if (trimmed.length === 0) {
    return true;
  }

  const normalizedLocation = jobLocation.toLowerCase();
  if (includesCaseInsensitive(normalizedLocation, trimmed)) {
    return true;
  }

  const tokens = expandLocationTokens(tokenizeQuery(trimmed));
  if (tokens.length === 0) {
    return true;
  }

  return tokens.some((token) => containsToken(normalizedLocation, token));
}

function matchesJobQuery(job: JobListingDTO, q: string) {
  const trimmed = q.trim();
  if (trimmed.length === 0) {
    return true;
  }

  if (
    includesCaseInsensitive(job.title, trimmed) ||
    includesCaseInsensitive(job.company, trimmed) ||
    includesCaseInsensitive(job.description, trimmed) ||
    includesCaseInsensitive(job.location, trimmed)
  ) {
    return true;
  }

  const tokens = expandQueryTokens(tokenizeQuery(trimmed));
  if (tokens.length === 0) {
    return true;
  }

  const haystack = `${job.title} ${job.company} ${job.location} ${job.description}`;
  return matchesByTokens(haystack, tokens);
}

export async function aggregateJobs(options?: { q?: string; location?: string; limit?: number }) {
  const liveJobs = await fetchFreeJobs(options);
  let items = liveJobs.length > 0 ? liveJobs : [...mockJobs];
  const source = liveJobs.length > 0 ? "free-apis" : "mock";
  const sixMonthsAgo = getSixMonthsAgo();

  items = items.filter((job) => isRecentJob(job.postedAt, sixMonthsAgo));

  if (options?.q) {
    const q = options.q.trim();
    if (q.length > 0) {
      items = items.filter((job) => matchesJobQuery(job, q));
    }
  }

  if (options?.location) {
    const location = options.location.trim();
    if (location.length > 0) {
      items = items.filter((job) => matchesLocationQuery(job.location, location));
    }
  }

  if (typeof options?.limit === "number" && options.limit > 0) {
    items = items.slice(0, options.limit);
  }

  return {
    source,
    count: items.length,
    jobs: items,
  };
}
