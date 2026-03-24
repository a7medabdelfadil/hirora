"use client";

import { useMemo, useState } from "react";

export default function CvToTextPage() {
  const [fileName, setFileName] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const textLength = useMemo(() => extractedText.trim().length, [extractedText]);

  const extractTextFromPdf = async (file: File) => {
    setLoading(true);
    setError("");
    setExtractedText("");

    try {
      const pdfjsLib = await import("pdfjs-dist");

      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = "";

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item: any) => ("str" in item ? item.str : ""))
          .join(" ");

        fullText += `\n\n===== Page ${pageNumber} =====\n${pageText}`;
      }

      setExtractedText(fullText.trim());
    } catch (err) {
      console.error(err);
      setError(
        "Failed to read the PDF. Make sure the file is a real text-based PDF, not a scanned image."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      setFileName("");
      setExtractedText("");
      return;
    }

    setFileName(file.name);
    await extractTextFromPdf(file);
  };

  const handleCopy = async () => {
    if (!extractedText) return;
    await navigator.clipboard.writeText(extractedText);
  };

  const handleClear = () => {
    setFileName("");
    setExtractedText("");
    setError("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-200 bg-slate-900 px-6 py-8 text-white sm:px-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-slate-200">
                  CV PDF Extractor
                </p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Convert CV PDF to Text
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                  Upload a CV in PDF format and extract all readable text so you can send it to your AI endpoint.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                <p className="font-medium">Supported input</p>
                <p className="mt-1 text-slate-300">Text-based PDF files</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-lg font-semibold text-slate-900">Upload PDF</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Choose the CV file, and the page will extract the readable text from all pages.
                </p>

                <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-10 text-center transition hover:border-slate-500 hover:bg-slate-50">
                  <div className="mb-4 rounded-full bg-slate-100 p-4">
                    <svg
                      className="h-8 w-8 text-slate-700"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16V4m0 0-4 4m4-4 4 4M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1"
                      />
                    </svg>
                  </div>

                  <span className="text-sm font-semibold text-slate-900">
                    Click to upload PDF
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    Only .pdf files are allowed
                  </span>

                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {fileName && (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Selected file
                    </p>
                    <p className="mt-2 break-all text-sm font-semibold text-slate-800">
                      {fileName}
                    </p>
                  </div>
                )}

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Status
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-800">
                      {loading
                        ? "Extracting text..."
                        : extractedText
                        ? "Extraction completed"
                        : "Waiting for upload"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Characters count
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-800">
                      {textLength}
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Extracted Text</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      The extracted CV content will appear here.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleCopy}
                      disabled={!extractedText}
                      className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Copy text
                    </button>

                    <button
                      onClick={handleClear}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="mt-5">
                  <textarea
                    value={extractedText}
                    readOnly
                    placeholder="Extracted text will appear here after uploading the PDF..."
                    className="min-h-[500px] w-full rounded-2xl border border-slate-300 bg-slate-50 p-4 text-sm leading-7 text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-400"
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}