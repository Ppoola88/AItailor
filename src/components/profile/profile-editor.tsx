"use client";

import { useState } from "react";

import type { ProfileDTO } from "@/lib/validation/profile";

type ProfileEditorProps = {
  initialProfile: ProfileDTO;
};

function emptyExperience() {
  return {
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    bulletPoints: [],
  };
}

function emptyEducation() {
  return {
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
  };
}

type SaveProfileErrorResponse = {
  error?: string;
  issues?: {
    formErrors?: string[];
    fieldErrors?: Record<string, string[] | undefined>;
  };
};

export function ProfileEditor({ initialProfile }: ProfileEditorProps) {
  const [profile, setProfile] = useState<ProfileDTO>(initialProfile);
  const [skillsInput, setSkillsInput] = useState(initialProfile.skills.join(", "));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function saveProfile() {
    setSaving(true);
    setError(null);
    setMessage(null);

    const payload = {
      ...profile,
      skills: skillsInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as SaveProfileErrorResponse | null;
      const formError = body?.issues?.formErrors?.[0];
      const fieldError = body?.issues?.fieldErrors
        ? Object.values(body.issues.fieldErrors).flat().find(Boolean)
        : null;

      setError(formError ?? fieldError ?? body?.error ?? "Unable to save profile.");
      return;
    }

    setProfile(payload);
    setMessage("Profile saved successfully.");
  }

  async function resetProfile() {
    if (!confirm("Delete your current profile data?")) {
      return;
    }

    setError(null);
    setMessage(null);

    const response = await fetch("/api/profile", {
      method: "DELETE",
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "Unable to reset profile.");
      return;
    }

    const cleared: ProfileDTO = {
      ...profile,
      phone: "",
      linkedIn: "",
      professionalSummary: "",
      skills: [],
      experiences: [],
      educations: [],
    };

    setProfile(cleared);
    setSkillsInput("");
    setMessage("Profile data deleted.");
  }

  return (
    <div className="space-y-8">
      {message ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>
      ) : null}
      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <section className="space-y-4 rounded-lg border border-zinc-200 p-5">
        <h2 className="text-xl font-semibold">Basic information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Full name</label>
            <input
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
              value={profile.fullName}
              onChange={(event) => setProfile({ ...profile, fullName: event.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
              type="email"
              value={profile.email}
              onChange={(event) => setProfile({ ...profile, email: event.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <input
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
              value={profile.phone}
              onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">LinkedIn URL</label>
            <input
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
              value={profile.linkedIn}
              onChange={(event) => setProfile({ ...profile, linkedIn: event.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Professional summary</label>
          <textarea
            rows={4}
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
            value={profile.professionalSummary}
            onChange={(event) => setProfile({ ...profile, professionalSummary: event.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Skills (comma separated)</label>
          <input
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
            value={skillsInput}
            onChange={(event) => setSkillsInput(event.target.value)}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-zinc-200 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Work experience</h2>
          <button
            type="button"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100"
            onClick={() => setProfile({ ...profile, experiences: [...profile.experiences, emptyExperience()] })}
          >
            Add experience
          </button>
        </div>

        {profile.experiences.length === 0 ? <p className="text-sm text-zinc-600">No experience added yet.</p> : null}

        {profile.experiences.map((experience, index) => (
          <div key={`exp-${index}`} className="space-y-3 rounded-md border border-zinc-200 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="rounded-md border border-zinc-300 px-3 py-2"
                placeholder="Company"
                value={experience.company}
                onChange={(event) => {
                  const next = [...profile.experiences];
                  next[index] = { ...next[index], company: event.target.value };
                  setProfile({ ...profile, experiences: next });
                }}
              />
              <input
                className="rounded-md border border-zinc-300 px-3 py-2"
                placeholder="Role"
                value={experience.role}
                onChange={(event) => {
                  const next = [...profile.experiences];
                  next[index] = { ...next[index], role: event.target.value };
                  setProfile({ ...profile, experiences: next });
                }}
              />
              <input
                type="date"
                className="rounded-md border border-zinc-300 px-3 py-2"
                value={experience.startDate}
                onChange={(event) => {
                  const next = [...profile.experiences];
                  next[index] = { ...next[index], startDate: event.target.value };
                  setProfile({ ...profile, experiences: next });
                }}
              />
              <input
                type="date"
                className="rounded-md border border-zinc-300 px-3 py-2"
                value={experience.endDate}
                disabled={experience.isCurrent}
                onChange={(event) => {
                  const next = [...profile.experiences];
                  next[index] = { ...next[index], endDate: event.target.value };
                  setProfile({ ...profile, experiences: next });
                }}
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={experience.isCurrent}
                onChange={(event) => {
                  const next = [...profile.experiences];
                  next[index] = {
                    ...next[index],
                    isCurrent: event.target.checked,
                    endDate: event.target.checked ? "" : next[index].endDate,
                  };
                  setProfile({ ...profile, experiences: next });
                }}
              />
              Current role
            </label>

            <textarea
              rows={4}
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
              placeholder="Bullet points (one per line)"
              value={experience.bulletPoints.join("\n")}
              onChange={(event) => {
                const next = [...profile.experiences];
                next[index] = {
                  ...next[index],
                  bulletPoints: event.target.value
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean),
                };
                setProfile({ ...profile, experiences: next });
              }}
            />

            <button
              type="button"
              className="text-sm font-medium text-red-700 hover:underline"
              onClick={() => {
                const next = profile.experiences.filter((_, rowIndex) => rowIndex !== index);
                setProfile({ ...profile, experiences: next });
              }}
            >
              Remove experience
            </button>
          </div>
        ))}
      </section>

      <section className="space-y-4 rounded-lg border border-zinc-200 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Education</h2>
          <button
            type="button"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100"
            onClick={() => setProfile({ ...profile, educations: [...profile.educations, emptyEducation()] })}
          >
            Add education
          </button>
        </div>

        {profile.educations.length === 0 ? <p className="text-sm text-zinc-600">No education added yet.</p> : null}

        {profile.educations.map((education, index) => (
          <div key={`edu-${index}`} className="space-y-3 rounded-md border border-zinc-200 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="rounded-md border border-zinc-300 px-3 py-2"
                placeholder="Institution"
                value={education.institution}
                onChange={(event) => {
                  const next = [...profile.educations];
                  next[index] = { ...next[index], institution: event.target.value };
                  setProfile({ ...profile, educations: next });
                }}
              />
              <input
                className="rounded-md border border-zinc-300 px-3 py-2"
                placeholder="Degree"
                value={education.degree}
                onChange={(event) => {
                  const next = [...profile.educations];
                  next[index] = { ...next[index], degree: event.target.value };
                  setProfile({ ...profile, educations: next });
                }}
              />
              <input
                className="rounded-md border border-zinc-300 px-3 py-2"
                placeholder="Field of study"
                value={education.fieldOfStudy}
                onChange={(event) => {
                  const next = [...profile.educations];
                  next[index] = { ...next[index], fieldOfStudy: event.target.value };
                  setProfile({ ...profile, educations: next });
                }}
              />
              <div />
              <input
                type="date"
                className="rounded-md border border-zinc-300 px-3 py-2"
                value={education.startDate}
                onChange={(event) => {
                  const next = [...profile.educations];
                  next[index] = { ...next[index], startDate: event.target.value };
                  setProfile({ ...profile, educations: next });
                }}
              />
              <input
                type="date"
                className="rounded-md border border-zinc-300 px-3 py-2"
                value={education.endDate}
                onChange={(event) => {
                  const next = [...profile.educations];
                  next[index] = { ...next[index], endDate: event.target.value };
                  setProfile({ ...profile, educations: next });
                }}
              />
            </div>

            <button
              type="button"
              className="text-sm font-medium text-red-700 hover:underline"
              onClick={() => {
                const next = profile.educations.filter((_, rowIndex) => rowIndex !== index);
                setProfile({ ...profile, educations: next });
              }}
            >
              Remove education
            </button>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={saveProfile}
          className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Saving..." : "Save profile"}
        </button>
        <button
          type="button"
          onClick={resetProfile}
          className="rounded-md border border-red-300 px-4 py-2 font-medium text-red-700 hover:bg-red-50"
        >
          Delete profile data
        </button>
      </div>
    </div>
  );
}
