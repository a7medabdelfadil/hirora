"use client";

import { useState } from "react";
import Container from "~/_components/global/Container";

const ENDPOINT =
  "https://jobai.sell-io.app/rank-cvs";

type ApiResponse = {
  mode?: string;
  scores?: number[];
};

type RankedCvItem = {
  originalIndex: number;
  cvText: string;
  score: number;
  percentage: number;
};

export default function RankCvsPage() {
  const [jobDescription, setJobDescription] = useState(
    `Senior Python Developer Role:

We are looking for a Senior Python Developer to design and build scalable backend systems and services.

Responsibilities:
- Develop high-performance backend systems using Python (FastAPI, Django, Flask)
- Design and build RESTful APIs for web applications
- Work with PostgreSQL and optimize database performance
- Deploy and maintain applications on Linux servers
- Collaborate with data teams to deploy machine learning models
- Containerize applications using Docker and manage deployments

Requirements:
- Strong experience in Python
- Experience with FastAPI, Django, or Flask
- PostgreSQL or similar relational databases
- Linux server management
- REST API development

Preferred:
- Docker and containerization
- Experience with machine learning model deployment
- Knowledge of cloud platforms (AWS, GCP)
- Understanding of microservices architecture`
  );

  const [cvList, setCvList] = useState<string[]>([
    `Junior Frontend Developer:

Skills:
- HTML, CSS, JavaScript
- Basic React.js

Experience:
- Built a personal portfolio website
- Practicing responsive design and UI development

Goals:
- Learning modern frontend frameworks
- Interested in improving UI/UX skills`,

    `Senior Backend Engineer:

Technical Skills:
- Python (5+ years)
- Frameworks: FastAPI, Flask, Django
- Databases: PostgreSQL
- Tools: Git, Linux, Docker

Experience:
- Built scalable REST APIs using FastAPI and Flask
- Designed backend systems handling high traffic
- Optimized PostgreSQL queries and database performance
- Deployed applications on Linux servers
- Worked with Docker for containerization

Projects:
- API platform for SaaS product
- Microservices-based backend system`,

    `Mechanical Engineer:

Skills:
- CAD Design (AutoCAD, SolidWorks)
- Thermal systems analysis
- Manufacturing processes

Experience:
- Designed mechanical components for industrial systems
- Worked on heat transfer and thermal efficiency projects

Goals:
- Seeking opportunities in manufacturing or automotive industries`
  ]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [rankedResults, setRankedResults] = useState<RankedCvItem[]>([]);
  const [error, setError] = useState("");

  const handleCvChange = (index: number, value: string) => {
    setCvList((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const addCv = () => {
    setCvList((prev) => [...prev, ""]);
  };

  const removeCv = (index: number) => {
    setCvList((prev) => prev.filter((_, i) => i !== index));
  };

  const buildRankedResults = (
    cvs: string[],
    response: ApiResponse
  ): RankedCvItem[] => {
    const scores = Array.isArray(response.scores) ? response.scores : [];

    const merged = cvs.map((cvText, index) => {
      const score = typeof scores[index] === "number" ? scores[index] : 0;

      return {
        originalIndex: index,
        cvText,
        score,
        percentage: Number((score * 100).toFixed(2)),
      };
    });

    merged.sort((a, b) => b.score - a.score);

    return merged;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setRankedResults([]);

    try {
      const cleanedCvs = cvList.map((cv) => cv.trim()).filter(Boolean);

      if (!jobDescription.trim()) {
        throw new Error("Job description is required.");
      }

      if (cleanedCvs.length === 0) {
        throw new Error("At least one CV is required.");
      }

      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_description: jobDescription.trim(),
          cv_list: cleanedCvs,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `Request failed: ${response.status} ${response.statusText}${text ? ` - ${text}` : ""
          }`
        );
      }

      const data: ApiResponse = await response.json();
      setResult(data);

      const ranked = buildRankedResults(cleanedCvs, data);
      setRankedResults(ranked);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const getProgressWidth = (percentage: number) => {
    const safeValue = Math.max(0, Math.min(percentage, 100));
    return `${safeValue}%`;
  };

  return (
    <Container>
      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl bg-white shadow-md border p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Rank CVs Against Job Description
            </h1>

            <div className="space-y-6">
              <div>
                <label className="block font-medium mb-2">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste job description here..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block font-medium">CV List</label>
                  <button
                    type="button"
                    onClick={addCv}
                    className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
                  >
                    + Add CV
                  </button>
                </div>

                <div className="space-y-4">
                  {cvList.map((cv, index) => (
                    <div key={index} className="rounded-xl border p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">CV #{index + 1}</span>
                        {cvList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCv(index)}
                            className="text-red-600 text-sm hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <textarea
                        value={cv}
                        onChange={(e) => handleCvChange(index, e.target.value)}
                        rows={5}
                        className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter CV #${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-xl bg-green-600 text-white px-6 py-3 font-medium hover:bg-green-700 disabled:opacity-60"
              >
                {loading ? "Ranking..." : "Rank CVs"}
              </button>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                  {error}
                </div>
              )}
            </div>
          </div>

          {result && (
            <div className="mt-8 space-y-6">
              <div className="rounded-2xl bg-white border shadow-sm p-6">
                <h2 className="text-xl font-bold mb-3">API Response</h2>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Mode:</span>{" "}
                    {result.mode || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Scores Count:</span>{" "}
                    {result.scores?.length ?? 0}
                  </p>
                </div>
              </div>

              {rankedResults.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Ranking Result</h2>

                  <div className="space-y-4">
                    {rankedResults.map((item, index) => (
                      <div
                        key={`${item.originalIndex}-${index}`}
                        className={`rounded-2xl border p-5 shadow-sm ${index === 0
                            ? "bg-green-50 border-green-300"
                            : "bg-white border-gray-200"
                          }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-lg font-bold">
                              Rank #{index + 1}
                              {index === 0 && (
                                <span className="ml-2 text-green-700 text-sm font-semibold">
                                  Best Match
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Original CV #{item.originalIndex + 1}
                            </p>
                          </div>

                          <div className="text-left md:text-right">
                            <p className="text-sm text-gray-500">Match Score</p>
                            <p className="text-2xl font-bold text-blue-700">
                              {item.percentage}%
                            </p>
                          </div>
                        </div>

                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-300"
                            style={{ width: getProgressWidth(item.percentage) }}
                          />
                        </div>

                        <div className="rounded-xl bg-gray-50 border p-4">
                          <p className="text-sm font-semibold mb-2">CV Text</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                            {item.cvText}
                          </p>
                        </div>

                        <div className="mt-4 text-sm text-gray-600">
                          Raw score: <span className="font-medium">{item.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </Container>
  );
}