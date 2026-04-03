"use client";

import { useMockData } from "@/components/MockDataContext";
import SummaryCards from "@/components/SummaryCards";
import AccountChart from "../_components/account-chart";
import TransactionTable from "../_components/transaction-table";
import { DashboardInsights } from "../../dashboard/_components/dashboard-insights";
import { Info } from "lucide-react";
import Link from "next/link";

export default function DemoAccountPage() {
  const { mockTransactions, mockAccounts } = useMockData();
  const account = mockAccounts[0];

  const totalIncome = mockTransactions
    .filter((t) => t.transactionType === "INCOME")
    .reduce((s, t) => s + t.totalAmount, 0);

  const totalExpense = mockTransactions
    .filter((t) => t.transactionType === "EXPENSE")
    .reduce((s, t) => s + t.totalAmount, 0);

  return (
    <div className="space-y-8 px-5">
      {/* Demo banner */}
      {/* <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300">
        <Info className="h-4 w-4 shrink-0" />
        <span>
          You are viewing a demo account.{" "}
          <Link href="/sign-in" className="underline font-medium">Sign in</Link>{" "}
          to manage your real finances.
        </span>
      </div> */}

      {/* Account header */}
      <div className="md:flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold gradient-title capitalize">
            {account?.name}
          </h1>
          <p className="text-muted-foreground">
            {account?.type?.charAt(0) + account?.type?.slice(1).toLowerCase()} Account
          </p>
        </div>
        <div className="text-right pb-2">
          <div className="text-3xl font-bold">
            ₹ {account?.balance?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-sm text-muted-foreground">
            {mockTransactions.length} Transactions
          </p>
        </div>
      </div>

      <SummaryCards transactions={mockTransactions} />

      <DashboardInsights transactions={mockTransactions} />

      <AccountChart transactions={mockTransactions} />

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">All Transactions</h2>
        <TransactionTable transactions={mockTransactions} isMock />
      </div>
    </div>
  );
}
