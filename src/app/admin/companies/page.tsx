"use client";

import { Plus, Search } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";
import CompaniesTableSection from "~/_components/admin/CompaniesTableSection";
import Container from "~/_components/global/Container";
import {
  useAdminCompanies,
  useAdminEmployers,
  useCreateCompany,
  useDeleteCompany,
  useUpdateCompany,
} from "~/APIs/hooks/useAdmin";
import { type AdminCompanyItem } from "~/APIs/features/admin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Skeleton } from "~/components/ui/skeleton";

function CompaniesPage() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [editingCompany, setEditingCompany] =
    React.useState<AdminCompanyItem | null>(null);

  const [formData, setFormData] = React.useState({
    name: "",
    industry: "",
    location: "",
    size: "",
    owner: "",
  });

  const isEditMode = !!editingCompany;

  const resetForm = React.useCallback(() => {
    setFormData({
      name: "",
      industry: "",
      location: "",
      size: "",
      owner: "",
    });
    setEditingCompany(null);
  }, []);

  const {
    data: companies = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminCompanies();

  const {
    data: employers = [],
    isLoading: employersLoading,
    isError: employersError,
  } = useAdminEmployers();

  const { mutate: createCompany, isPending: isCreatingCompany } =
    useCreateCompany({
      onSuccess: async () => {
        toast.success("Company created successfully.");
        setOpenCreateDialog(false);
        resetForm();
        await refetch();
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message || "Failed to create company.",
        );
      },
    });

  const { mutate: updateCompany, isPending: isUpdatingCompany } =
    useUpdateCompany({
      onSuccess: async () => {
        toast.success("Company updated successfully.");
        setOpenCreateDialog(false);
        resetForm();
        await refetch();
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message || "Failed to update company.",
        );
      },
    });

  const { mutate: deleteCompany, isPending: isDeletingCompany } =
    useDeleteCompany({
      onSuccess: async (data) => {
        toast.success("Company deleted successfully.");
        await refetch();
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message || "Failed to delete company.",
        );
      },
    });

  const filteredCompanies = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return companies.filter((company) => {
      const matchesSearch =
        normalizedQuery === "" ||
        company.name?.toLowerCase().includes(normalizedQuery) ||
        company.industry?.toLowerCase().includes(normalizedQuery) ||
        company.location?.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        status === "all" ||
        company.status?.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [companies, query, status]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpenCreateDialog(true);
  };

  const handleEditCompany = (company: AdminCompanyItem) => {
    setEditingCompany(company);
    setFormData({
      name: company.name ?? "",
      industry: company.industry ?? "",
      location: company.location ?? "",
      size: company.size ?? "",
      owner: company.owner?._id ?? "",
    });
    setOpenCreateDialog(true);
  };

  const handleDeleteCompany = (company: AdminCompanyItem) => {
    deleteCompany({
      companyId: company._id,
    });
  };

  const handleDialogChange = (open: boolean) => {
    setOpenCreateDialog(open);

    if (!open) {
      resetForm();
    }
  };

  const handleSubmitCompany = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.industry.trim() ||
      !formData.location.trim() ||
      !formData.size.trim() ||
      !formData.owner.trim()
    ) {
      return;
    }

    const payload = {
      name: formData.name.trim(),
      industry: formData.industry.trim(),
      location: formData.location.trim(),
      size: formData.size.trim(),
      owner: formData.owner,
    };

    if (editingCompany) {
      updateCompany({
        companyId: editingCompany._id,
        ...payload,
      });
      return;
    }

    createCompany(payload);
  };

  const isSubmitting =
    isCreatingCompany || isUpdatingCompany || isDeletingCompany;

  return (
    <Container>
      <section className="w-full">
        <p className="mb-4 text-md text-gray-600">
          Manage all registered companies
        </p>

        <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search companies..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-11 min-w-[120px] rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 outline-none transition hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <Plus className="h-5 w-5" />
                Add Company
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10 mt-4">
        {isLoading ? (
          <div className="w-full">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-white">
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left">
                        <Skeleton className="h-4 w-[90px]" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <Skeleton className="h-4 w-[70px]" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <Skeleton className="h-4 w-[70px]" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <Skeleton className="h-4 w-[40px]" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <Skeleton className="h-4 w-[90px]" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <Skeleton className="h-4 w-[55px]" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <Skeleton className="h-4 w-[60px]" />
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div className="min-w-0 space-y-2">
                              <Skeleton className="h-4 w-[160px]" />
                              <Skeleton className="h-3 w-[110px]" />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <Skeleton className="h-4 w-[90px]" />
                        </td>
                        <td className="px-6 py-5">
                          <Skeleton className="h-4 w-[110px]" />
                        </td>
                        <td className="px-6 py-5">
                          <Skeleton className="h-4 w-[70px]" />
                        </td>
                        <td className="px-6 py-5">
                          <Skeleton className="h-8 w-[44px] rounded-full" />
                        </td>
                        <td className="px-6 py-5">
                          <Skeleton className="h-6 w-[50px] rounded-full" />
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-4 w-4 rounded-sm" />
                            <Skeleton className="h-4 w-4 rounded-sm" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Skeleton className="h-4 w-[180px]" />
              <div className="flex items-center gap-2 self-end">
                <Skeleton className="h-9 w-20 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-20 rounded-md" />
              </div>
            </div>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <p className="text-sm font-medium text-red-700">
              Failed to load companies.
            </p>
            <p className="mt-1 text-sm text-red-600">
              {error instanceof Error ? error.message : "Something went wrong."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <CompaniesTableSection
            companies={filteredCompanies}
            onStatusChanged={refetch}
            onEditCompany={handleEditCompany}
            onDeleteCompany={handleDeleteCompany}
            isDeletingCompany={isDeletingCompany}
          />
        )}
      </section>

      <Dialog open={openCreateDialog} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Company" : "Create Company"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update company information."
                : "Add a new company and assign an employer as the owner."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitCompany} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter company name"
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Industry
              </label>
              <input
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                placeholder="Enter industry"
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location"
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Size
              </label>
              <input
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                placeholder="Example: 50-100"
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Owner
              </label>
              <select
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                disabled={employersLoading || employersError}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 outline-none transition hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value="">
                  {employersLoading
                    ? "Loading employers..."
                    : employersError
                      ? "Failed to load employers"
                      : "Select owner"}
                </option>

                {employers.map((employer) => (
                  <option key={employer._id} value={employer._id}>
                    {employer.name} - {employer.email}
                  </option>
                ))}
              </select>
            </div>

            <DialogFooter className="pt-2">
              <button
                type="button"
                onClick={() => handleDialogChange(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  employersLoading ||
                  !formData.name.trim() ||
                  !formData.industry.trim() ||
                  !formData.location.trim() ||
                  !formData.size.trim() ||
                  !formData.owner.trim()
                }
                className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                    ? "Update Company"
                    : "Create Company"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default CompaniesPage;