"use client";

import { Filter, Plus, Search } from "lucide-react";
import React from "react";
import CompaniesTableSection from "~/_components/admin/CompaniesTableSection";
import Container from "~/_components/global/Container";

function CompaniesPage() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");
  return (
    <Container>
        <section className="w-full">
      <p className="mb-4 text-md text-gray-600">
        Manage all registered companies
      </p>

      <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full md:flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Right controls */}
          <div className="flex items-center justify-end gap-3">

            {/* Status dropdown */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 min-w-[120px] rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 outline-none transition hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="blocked">Blocked</option>
            </select>

            {/* Add Company */}
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <Plus className="h-5 w-5" />
              Add Company
            </button>
          </div>
        </div>
      </div>
    </section>
    <section className="mt-4  mb-10">
        <CompaniesTableSection />
    </section>
    </Container>
  );
}

export default CompaniesPage;
