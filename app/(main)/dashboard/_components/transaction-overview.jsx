"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { defaultCategories } from '@/data/categories';
import { format, subDays, startOfDay, startOfMonth, endOfDay } from 'date-fns';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ["#4e79a7","#f28e2b","#e15759","#76b7b2","#59a14f","#edc948","#b07aa1","#ff9da7","#9c755f","#bab0ab"];

const categoryNameMap = defaultCategories.reduce((acc, c) => { acc[c.id] = c.name; return acc; }, {});

const PIE_RANGES = {
  "this-month": { label: "This Month" },
  "30d":        { label: "Last 30 Days", days: 30 },
  "90d":        { label: "Last 3 Months", days: 90 },
  "180d":       { label: "Last 6 Months", days: 180 },
  "all":        { label: "All Time" },
};

const DashboardOverview = ({ accounts, transactions }) => {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );
  const [pieRange, setPieRange] = useState("90d");

  const accountTransactions = transactions.filter((t) => t.accountId === selectedAccountId);
  const recentTransactions = [...accountTransactions]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  // Compute pie chart date window
  const now = new Date();
  const getPieStart = () => {
    if (pieRange === "this-month") return startOfMonth(now);
    if (pieRange === "all") return new Date(0);
    return startOfDay(subDays(now, PIE_RANGES[pieRange].days));
  };

  const pieStart = getPieStart();
  const pieEnd = endOfDay(now);

  const filteredExpenses = accountTransactions.filter((t) => {
    const d = new Date(t.timestamp);
    return t.transactionType === "EXPENSE" && d >= pieStart && d <= pieEnd;
  });

  const expensesByCategory = filteredExpenses.reduce((acc, t) => {
    const key = t.category || "other-expense";
    acc[key] = (acc[key] || 0) + Number(t.totalAmount);
    return acc;
  }, {});

  const pieChartData = (() => {
    const sorted = Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, value]) => ({ name: categoryNameMap[cat] || cat, value }));

    if (sorted.length <= 5) return sorted;

    const top5 = sorted.slice(0, 5);
    const othersValue = sorted.slice(5).reduce((sum, item) => sum + item.value, 0);
    return [...top5, { name: "Others", value: othersValue }];
  })();

  const [showLabel, setShowLabel] = useState(true);
  useEffect(() => {
    const handleResize = () => setShowLabel(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      {/* Recent Transactions */}
      <Card>
        <CardHeader className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4'>
          <CardTitle className='text-base font-normal'>Recent Transactions</CardTitle>
          {accounts.length > 1 && (
            <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {recentTransactions.length === 0 ? (
              <p className='text-center text-muted-foreground py-4'>No recent transactions</p>
            ) : (
              recentTransactions.map((t) => (
                <div key={t.id} className='flex items-center justify-between gap-2'>
                  <div className='space-y-0.5 min-w-0'>
                    <p className='text-sm font-medium leading-none truncate'>{t.assetName || "Untitled"}</p>
                    <p className='text-xs text-muted-foreground'>{format(new Date(t.timestamp), "PP")}</p>
                  </div>
                  <div className={cn("flex items-center text-sm font-medium shrink-0", t.transactionType === "EXPENSE" ? "text-red-500" : "text-green-500")}>
                    {t.transactionType === "EXPENSE"
                      ? <ArrowDownRight className="mr-1 h-4 w-4" />
                      : <ArrowUpRight className="mr-1 h-4 w-4" />}
                    ₹ {Number(t.totalAmount).toLocaleString("en-IN")}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Spending Breakdown */}
      <Card>
        <CardHeader className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2'>
          <CardTitle className='text-base font-normal'>Spending Breakdown</CardTitle>
          <Select value={pieRange} onValueChange={setPieRange}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PIE_RANGES).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className='p-0 pb-4'>
          {pieChartData.length === 0 ? (
            <p className='text-center text-muted-foreground py-8'>No expenses for this period</p>
          ) : (
            <div className='h-[300px]'>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="45%"
                    outerRadius={85}
                    dataKey="value"
                    label={showLabel ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : false}
                    labelLine={showLabel}
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, name) => [`₹ ${Number(v).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, name]}
                  />
                  <Legend
                    formatter={(value) => <span className="text-xs">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardOverview;
