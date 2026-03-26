"use client";

import * as React from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "~/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "~/components/ui/pagination";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

import { type AdminCompanyItem } from "~/APIs/features/admin";
import { useUpdateCompanyStatus } from "~/APIs/hooks/useAdmin";

interface CompaniesTableSectionProps {
  companies: AdminCompanyItem[];
  onStatusChanged?: () => unknown;
  onEditCompany?: (company: AdminCompanyItem) => void;
  onDeleteCompany?: (company: AdminCompanyItem) => void;
  isDeletingCompany?: boolean;
}

const PAGE_SIZE = 5;

function JobsBadge({ n }: { n?: number }) {
  return (
    <span className="inline-flex min-w-[40px] justify-center rounded-full bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700">
      {n ?? 0}
    </span>
  );
}

export default function CompaniesTableSection({
  companies,
  onStatusChanged,
  onEditCompany,
  onDeleteCompany,
  isDeletingCompany = false,
}: CompaniesTableSectionProps) {
  const [page, setPage] = React.useState(1);
  const [companyToDelete, setCompanyToDelete] =
    React.useState<AdminCompanyItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const totalCompanies = companies.length;
  const totalPages = Math.max(1, Math.ceil(totalCompanies / PAGE_SIZE));

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedCompanies = React.useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return companies.slice(startIndex, endIndex);
  }, [companies, page]);

  const startCount = totalCompanies === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endCount = Math.min(page * PAGE_SIZE, totalCompanies);

  const { mutate: updateCompanyStatus, isPending: isUpdatingStatus } =
    useUpdateCompanyStatus({
      onSuccess: async () => {
        await onStatusChanged?.();
      },
    });

  const handleToggleStatus = (company: AdminCompanyItem) => {
    const currentStatus = company.status?.toLowerCase();
    const nextStatus = currentStatus === "active" ? "inactive" : "active";

    updateCompanyStatus({
      companyId: company._id,
      status: nextStatus,
    });
  };

  if (!companies.length) {
    return (
      <section className="w-full">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          No companies found.
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-800">
                Company
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-800">
                Industry
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-800">
                Location
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-800">
                Size
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-800">
                Jobs Posted
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-800">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-800">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedCompanies.map((company) => (
              <TableRow key={company._id} className="border-gray-200">
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src="/images/job-profile.png"
                        alt={company.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-gray-900">
                        {company.name}
                      </div>
                      <div className="truncate text-sm text-gray-500">
                        ID: {company._id}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-5 text-sm text-gray-800">
                  {company.industry || "-"}
                </TableCell>

                <TableCell className="px-6 py-5 text-sm text-gray-800">
                  {company.location || "-"}
                </TableCell>

                <TableCell className="px-6 py-5 text-sm text-gray-800">
                  {company.size || "-"}
                </TableCell>

                <TableCell className="px-6 py-5">
                  <JobsBadge n={company.jobsPosted || 0} />
                </TableCell>

                <TableCell className="px-6 py-5">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(company)}
                    disabled={isUpdatingStatus}
                    aria-label={`Toggle status for ${company.name}`}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      company.status?.toLowerCase() === "active"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                        company.status?.toLowerCase() === "active"
                          ? "translate-x-5"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </TableCell>

                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-5">
                    <button
                      type="button"
                      className="text-gray-600 transition hover:text-gray-900"
                      aria-label="Edit"
                      title="Edit"
                      onClick={() => onEditCompany?.(company)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      className="text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label="Delete"
                      title="Delete"
                      disabled={isDeletingCompany}
                      onClick={() => {
                        setCompanyToDelete(company);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          Showing {startCount}-{endCount} of {totalCompanies} companies
        </p>

        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prev) => Math.max(1, prev - 1));
                }}
                className={
                  page === 1 ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;

              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={page === pageNumber}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prev) => Math.min(totalPages, prev + 1));
                }}
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setCompanyToDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {companyToDelete?.name}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setCompanyToDelete(null);
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              disabled={isDeletingCompany}
              onClick={() => {
                if (companyToDelete) {
                  onDeleteCompany?.(companyToDelete);
                }
                setIsDeleteDialogOpen(false);
                setCompanyToDelete(null);
              }}
            >
              {isDeletingCompany ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}