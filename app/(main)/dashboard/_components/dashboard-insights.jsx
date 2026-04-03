"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { defaultCategories } from "@/data/categories";

const categoryNameMap = defaultCategories.reduce((acc, c) => { acc[c.id] = c.name; return acc; }, {});

export const DashboardInsights = ({ transactions }) => {
  const insights = useMemo(() => {
    if (!transactions.length) return [];

    const now = new Date();
    const thisMonth = (t) => {
      const d = new Date(t.timestamp);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    };
    const lastMonth = (t) => {
      const d = new Date(t.timestamp);
      const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
    };

    const thisMonthExpenses = transactions.filter((t) => t.transactionType === "EXPENSE" && thisMonth(t));
    const lastMonthExpenses = transactions.filter((t) => t.transactionType === "EXPENSE" && lastMonth(t));

    const thisTotal = thisMonthExpenses.reduce((s, t) => s + Number(t.totalAmount), 0);
    const lastTotal = lastMonthExpenses.reduce((s, t) => s + Number(t.totalAmount), 0);

    // Highest spending category this month
    const byCat = thisMonthExpenses.reduce((acc, t) => {
      const key = t.category || "other-expense";
      acc[key] = (acc[key] || 0) + Number(t.totalAmount);
      return acc;
    }, {});
    const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];

    const result = [];

    if (topCat) {
      result.push(`Your highest spending category this month is ${categoryNameMap[topCat[0]] || topCat[0]} (₹${topCat[1].toLocaleString("en-IN", { maximumFractionDigits: 0 })}).`);
    }

    if (lastTotal > 0) {
      const diff = ((thisTotal - lastTotal) / lastTotal) * 100;
      const direction = diff >= 0 ? "more" : "less";
      result.push(`You spent ${Math.abs(diff).toFixed(1)}% ${direction} than last month (₹${thisTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })} vs ₹${lastTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}).`);
    } else if (thisTotal > 0) {
      result.push(`Total expenses this month: ₹${thisTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`);
    }

    const incomeCount = transactions.filter((t) => t.transactionType === "INCOME" && thisMonth(t)).length;
    if (incomeCount > 0) {
      result.push(`You have ${incomeCount} income transaction${incomeCount > 1 ? "s" : ""} this month.`);
    }

    const expenseCount = transactions.filter((t) => t.transactionType === "EXPENSE" && thisMonth(t)).length;
    if (expenseCount > 0) {
      result.push(`You have ${expenseCount} expense transaction${expenseCount > 1 ? "s" : ""} this month.`);
    }

    return result;
  }, [transactions]);

  if (!insights.length) return null;

  return (
    <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
      <CardHeader><CardTitle className="text-sm">Quick Insights</CardTitle></CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {insights.map((insight, i) => <li key={i}>{insight}</li>)}
        </ul>
      </CardContent>
    </Card>
  );
};
