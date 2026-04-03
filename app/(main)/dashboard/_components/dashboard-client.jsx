"use client";
import { useMockData } from "@/components/MockDataContext";
import SummaryCards from "@/components/SummaryCards";
import BalanceTrendChart from "@/components/BalanceTrendChart";
import { DashboardInsights } from "./dashboard-insights";
import DashboardOverview from "./transaction-overview";
import TransactionTable from "../../account/_components/transaction-table";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRole } from "@/components/RoleContext";
import AccountCard from "./account-card";

const DashboardClient = () => {
  const { mockTransactions, mockAccounts } = useMockData();
  const { isAdmin } = useRole();

  return (
    <div className="space-y-6">
      <SummaryCards transactions={mockTransactions} />

      <DashboardInsights transactions={mockTransactions} />

      <BalanceTrendChart transactions={mockTransactions} title="Balance Trend" />

      <DashboardOverview accounts={mockAccounts} transactions={mockTransactions} />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {isAdmin && (
          <Link href="/transaction/new">
            <Card className="hover:shadow-md hover:scale-105 transition-shadow cursor-pointer border-dashed min-h-[120px]">
              <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                <Plus className="h-10 w-10 mb-2" />
                <p className="text-sm font-medium">Add Transaction</p>
              </CardContent>
            </Card>
          </Link>
        )}
        {mockAccounts.map((account) => (
          <AccountCard key={account.id} account={account} isMock />
        ))}
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">All Transactions</h2>
        <TransactionTable transactions={mockTransactions} isMock />
      </div>
    </div>
  );
};

export default DashboardClient;
