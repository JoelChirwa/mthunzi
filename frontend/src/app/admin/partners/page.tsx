"use client";

import PageHeader from "@/components/admin/PageHeader";
import PartnersTable from "@/components/admin/partners/PartnersTable";

export default function PartnersPage() {
  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
      <PageHeader
        title="Partners"
        description="Manage strategic partners and sponsors shown on the home page"
      />
      <PartnersTable />
    </div>
  );
}