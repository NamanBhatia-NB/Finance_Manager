import React, { Suspense } from 'react'
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getDashboardData, getUserAccounts } from '@/actions/dashboard';
import { getCurrentBudget } from '@/actions/budget';
import AccountCard from './_components/account-card';
import CreateAccountDrawer from '@/components/create-account-drawer';
import InvestmentProgress from './_components/investment-progress';
import DashboardOverview from './_components/transaction-overview';
import { DashboardInsights } from './_components/dashboard-insights';
import { auth } from '@clerk/nextjs/server';
import SummaryCards from '@/components/SummaryCards';
import BalanceTrendChart from '@/components/BalanceTrendChart';
import DashboardClient from './_components/dashboard-client';

async function DashboardPage() {
  const { userId } = await auth();

  let accounts = [];
  let transactions = [];
  let budgetData = null;

  if (userId) {
    try {
      accounts = await getUserAccounts();
      const defaultAccount = accounts?.find((a) => a.isDefault);
      if (defaultAccount) {
        budgetData = await getCurrentBudget(defaultAccount.id);
      }
      transactions = await getDashboardData();
    } catch (e) {
      // User record may not exist yet on first sign-in; checkUser in layout handles creation
      console.error("Dashboard data fetch error:", e.message);
    }
  }

  const defaultAccount = accounts?.find((a) => a.isDefault);

  // For logged-out users, data comes from MockDataContext via DashboardClient
  if (!userId) {
    return <DashboardClient />;
  }

  return (
    <div className='space-y-6'>
      <SummaryCards transactions={transactions} />

      {defaultAccount && (
        <InvestmentProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      )}

      <DashboardInsights transactions={transactions} />

      <BalanceTrendChart transactions={transactions} title="Balance Trend" />

      <Suspense fallback={<p className="text-muted-foreground text-sm">Loading overview...</p>}>
        <DashboardOverview accounts={accounts} transactions={transactions || []} />
      </Suspense>

      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        <CreateAccountDrawer>
          <Card className="hover:shadow-md hover:scale-105 transition-shadow cursor-pointer border-dashed min-h-[120px]">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className='h-10 w-10 mb-2' />
              <p className='text-sm font-medium'>Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>
        {accounts.length > 0 && accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  )
}

export default DashboardPage;
