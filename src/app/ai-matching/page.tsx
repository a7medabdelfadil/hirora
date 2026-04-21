"use client";

import { useState } from "react";
import Container from "~/_components/global/Container";

const ENDPOINT =
    "https://jobai.sell-io.app/match";

type ApiResponse = {
    mode?: string;
    scores?: number[];
};

type RankedJobItem = {
    originalIndex: number;
    jobText: string;
    score: number;
    percentage: number;
};

export default function MatchPage() {
    const [cvText, setCvText] = useState(
        "I am a Senior Backend Developer specializing in Python, FastAPI, and PostgreSQL. I have extensive experience with Microservices architecture, Docker, and Kubernetes. I also work with Redis for caching and RabbitMQ for messaging."
    );

    const [jobDescriptions, setJobDescriptions] = useState<string[]>([
        "Seeking a Backend Engineer: Expertise in Python/Django, database optimization, and cloud infrastructure (AWS/Azure).",
        "Frontend Developer position: Required skills in React.js, Tailwind CSS, and TypeScript. Must have an eye for UI/UX design.",
        "DevOps Engineer: Focus on CI/CD pipelines, Terraform, and managing Kubernetes clusters in production.",
        "Data Scientist: Looking for someone with experience in Machine Learning, Pandas, and Scikit-learn to build predictive models.",
        "Administrative Assistant: Handling office schedules and answering phone calls.",
    ]);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ApiResponse | null>(null);
    const [rankedResults, setRankedResults] = useState<RankedJobItem[]>([]);
    const [error, setError] = useState<string>("");

    const handleJobChange = (index: number, value: string) => {
        setJobDescriptions((prev) => {
            const copy = [...prev];
            copy[index] = value;
            return copy;
        });
    };

    const addJob = () => {
        setJobDescriptions((prev) => [...prev, ""]);
    };

    const removeJob = (index: number) => {
        setJobDescriptions((prev) => prev.filter((_, i) => i !== index));
    };

    const buildRankedResults = (
        jobs: string[],
        response: ApiResponse
    ): RankedJobItem[] => {
        const scores = Array.isArray(response.scores) ? response.scores : [];

        const merged = jobs.map((jobText, index) => {
            const score = typeof scores[index] === "number" ? scores[index] : 0;

            return {
                originalIndex: index,
                jobText,
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
            const cleanedJobs = jobDescriptions.map((job) => job.trim()).filter(Boolean);

            if (!cvText.trim()) {
                throw new Error("CV text is required.");
            }

            if (cleanedJobs.length === 0) {
                throw new Error("At least one job description is required.");
            }

            const response = await fetch(ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cv_text: cvText.trim(),
                    job_descriptions: cleanedJobs,
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

            const ranked = buildRankedResults(cleanedJobs, data);
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
                <div className="max-w-5xl mx-auto">
                    <div className="rounded-2xl bg-white shadow-md border p-6 md:p-8">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">
                            CV / Job Matching
                        </h1>
                        <p className="text-gray-600 mb-8">
                            أدخل نص الـ CV وأضف أي عدد من الـ job descriptions ثم اضغط Match.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <label className="block font-medium mb-2">CV Text</label>
                                <textarea
                                    value={cvText}
                                    onChange={(e) => setCvText(e.target.value)}
                                    rows={8}
                                    className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Paste CV text here..."
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block font-medium">Job Descriptions</label>
                                    <button
                                        type="button"
                                        onClick={addJob}
                                        className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
                                    >
                                        + Add Job
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {jobDescriptions.map((job, index) => (
                                        <div key={index} className="rounded-xl border p-4 bg-gray-50">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium">Job #{index + 1}</span>
                                                {jobDescriptions.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeJob(index)}
                                                        className="text-red-600 text-sm hover:underline"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>

                                            <textarea
                                                value={job}
                                                onChange={(e) => handleJobChange(index, e.target.value)}
                                                rows={4}
                                                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder={`Enter job description #${index + 1}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="rounded-xl bg-green-600 text-white px-6 py-3 font-medium hover:bg-green-700 disabled:opacity-60"
                                >
                                    {loading ? "Matching..." : "Match CV"}
                                </button>
                            </div>

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
                                    <h2 className="text-2xl font-bold mb-4">Matching Result</h2>

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
                                                            Original Job #{item.originalIndex + 1}
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
                                                    <p className="text-sm font-semibold mb-2">
                                                        Job Description
                                                    </p>
                                                    <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                                                        {item.jobText}
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