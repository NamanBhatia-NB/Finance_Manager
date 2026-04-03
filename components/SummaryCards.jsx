"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";

const SummaryCards = ({ transactions = [] }) => {
  const totalIncome = transactions
    .filter((t) => t.transactionType === "INCOME")
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  const totalExpenses = transactions
    .filter((t) => t.transactionType === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  const totalBalance = totalIncome - totalExpenses;

  const cards = [
    {
      title: "Total Balance",
      value: totalBalance,
      icon: <Wallet className="h-5 w-5 text-blue-500" />,
      color: totalBalance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Total Income",
      value: totalIncome,
      icon: <ArrowUpRight className="h-5 w-5 text-green-500" />,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/30",
    },
    {
      title: "Total Expenses",
      value: totalExpenses,
      icon: <ArrowDownRight className="h-5 w-5 text-red-500" />,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/30",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title} className={`${card.bg} border-0 shadow-sm`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${card.color}`}>
              {card.value < 0 ? "-" : ""}₹ {Math.abs(card.value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;
