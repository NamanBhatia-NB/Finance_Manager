"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const DATE_RANGES = {
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL:  { label: "All Time", days: null },
};

const BalanceTrendChart = ({ transactions = [], title = "Balance Trend" }) => {
  const [dateRange, setDateRange] = useState("3M");

  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days ? startOfDay(subDays(now, range.days)) : new Date(0);
    const endDate = endOfDay(now);

    // Step 1: sort ALL transactions chronologically
    const allSorted = [...transactions].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Step 2: compute running balance at every transaction date across ALL history
    let running = 0;
    const allPoints = allSorted.map((t) => {
      running += t.transactionType === "INCOME" ? Number(t.totalAmount) : -Number(t.totalAmount);
      return { date: new Date(t.timestamp), balance: running };
    });

    // Step 3: filter points to only those within the selected display range
    const inRange = allPoints.filter((p) => p.date >= startDate && p.date <= endDate);

    if (!inRange.length) return [];

    // Step 4: group by date label — keep the last balance value per day
    const grouped = {};
    inRange.forEach((p) => {
      const label = format(p.date, "MMM dd");
      grouped[label] = parseFloat(p.balance.toFixed(2));
    });

    return Object.entries(grouped).map(([date, balance]) => ({ date, balance }));
  }, [transactions, dateRange]);

  const minBalance = chartData.length ? Math.min(...chartData.map((d) => d.balance)) : 0;
  const yDomain = [Math.floor(minBalance * 0.95), "auto"];

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-normal">{title}</CardTitle>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-3">
        {chartData.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No data for selected range</p>
        ) : (
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis
                  domain={yDomain}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(v) => [`₹ ${Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, "Balance"]}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="Balance"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceTrendChart;
