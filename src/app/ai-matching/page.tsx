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
        `I am a Senior Backend Developer with 5+ years of experience building scalable and high-performance systems.

Technical Skills:
- Programming Languages: Python (Expert)
- Frameworks: FastAPI, Django
- Databases: PostgreSQL, MongoDB
- Architecture: Microservices, RESTful APIs
- DevOps & Cloud: Docker, Kubernetes, CI/CD, AWS (EC2, S3)
- Messaging & Caching: Redis, RabbitMQ
- Tools: Git, GitHub, Linux, Nginx

Experience:
- Designed and developed scalable backend systems using FastAPI and Django
- Built microservices architecture handling high traffic applications
- Optimized PostgreSQL queries, improving performance by up to 40%
- Implemented caching strategies using Redis
- Integrated messaging queues using RabbitMQ
- Deployed applications using Docker and Kubernetes on AWS
- Built and maintained CI/CD pipelines for automated deployments

Projects:
- E-commerce Backend System (FastAPI + PostgreSQL + Redis)
- Real-time Notification Service using RabbitMQ
- Scalable SaaS platform with microservices architecture

Soft Skills:
- Problem solving
- System design thinking
- Team collaboration
- Agile/Scrum experience

Education:
- BSc in Computer Science`
    );

    const [jobDescriptions, setJobDescriptions] = useState<string[]>([
        `Backend Engineer Role:
We are looking for a Backend Engineer with strong experience in Python frameworks such as Django or FastAPI.

Responsibilities:
- Design and develop scalable backend services
- Optimize database queries and performance
- Work with cloud platforms like AWS or Azure
- Build and maintain RESTful APIs

Requirements:
- Python (Django or FastAPI)
- PostgreSQL or similar databases
- Experience with cloud infrastructure
- Understanding of microservices architecture

Preferred:
- Docker, Kubernetes
- Messaging systems like RabbitMQ
- Caching tools like Redis`,

        `Frontend Developer Position:
Seeking a Frontend Developer to build modern and responsive user interfaces.

Responsibilities:
- Develop UI using React.js and Tailwind CSS
- Write clean and maintainable TypeScript code
- Collaborate with designers to implement UI/UX
- Integrate APIs and manage frontend state

Requirements:
- React.js
- Tailwind CSS
- TypeScript
- API integration

Preferred:
- Next.js
- Performance optimization
- UI/UX design experience`,

        `DevOps Engineer:
Looking for a DevOps Engineer to manage infrastructure and deployment pipelines.

Responsibilities:
- Build and maintain CI/CD pipelines
- Manage Kubernetes clusters in production
- Use Terraform for infrastructure as code
- Monitor system performance and reliability

Requirements:
- CI/CD tools (GitHub Actions, Jenkins)
- Kubernetes
- Terraform
- Cloud platforms (AWS, GCP, or Azure)

Preferred:
- Docker
- Logging & monitoring tools
- Security best practices`,

        `Data Scientist Role:
We are hiring a Data Scientist to analyze data and build predictive models.

Responsibilities:
- Analyze large datasets
- Build machine learning models
- Use Python libraries for data processing
- Communicate insights to stakeholders

Requirements:
- Python
- Pandas, NumPy
- Scikit-learn
- Data visualization

Preferred:
- Deep learning frameworks
- SQL knowledge
- Experience with real-world datasets`,

        `Administrative Assistant:
We are looking for an Administrative Assistant to support daily office operations.

Responsibilities:
- Manage schedules and appointments
- Handle phone calls and emails
- Organize files and documents
- Assist with administrative tasks

Requirements:
- Good communication skills
- Basic computer skills
- Organization and time management

Preferred:
- Experience in office environments
- Familiarity with Microsoft Office tools`
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