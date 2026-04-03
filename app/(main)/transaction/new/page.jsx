"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "@/app/lib/schema";
import { useMockData } from "@/components/MockDataContext";
import { useRole } from "@/components/RoleContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { defaultCategories } from "@/data/categories";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MOCK_ACCOUNT_ID } from "@/data/mock-data";

function DemoTransactionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { isSignedIn, isLoaded } = useAuth();
  const { isAdmin } = useRole();
  const { addMockTransaction, updateMockTransaction, mockTransactions } = useMockData();
  const [submitting, setSubmitting] = useState(false);

  const editData = editId ? mockTransactions.find((t) => t.id === editId) : null;

  const {
    register, handleSubmit, formState: { errors },
    watch, setValue, getValues, trigger, reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: editData ? {
      assetName: editData.assetName,
      transactionType: editData.transactionType,
      totalAmount: editData.totalAmount.toString(),
      description: editData.description || "",
      accountId: MOCK_ACCOUNT_ID,
      category: editData.category || "other-expense",
      timestamp: new Date(editData.timestamp),
      isRecurring: editData.isRecurring,
      ...(editData.recurringInterval && { recurringInterval: editData.recurringInterval }),
    } : {
      transactionType: "EXPENSE",
      totalAmount: "",
      description: "",
      accountId: MOCK_ACCOUNT_ID,
      category: "other-expense",
      timestamp: new Date(),
      isRecurring: false,
    },
  });

  // If user is actually signed in, send them to the real form
  useEffect(() => {
    if (isLoaded && isSignedIn) router.replace("/transaction/create");
  }, [isLoaded, isSignedIn]);

  // Viewer role guard
  useEffect(() => {
    if (!isAdmin) {
      toast.error("Only admins can add transactions.");
      router.replace("/dashboard");
    }
  }, [isAdmin]);

  const transactionType = watch("transactionType");
  const isRecurring = watch("isRecurring");
  const timestamp = watch("timestamp");

  const filteredCategories = defaultCategories.filter(
    (c) => c.type === (transactionType === "INCOME" ? "INCOME" : "EXPENSE")
  );

  const onSubmit = (data) => {
    setSubmitting(true);
    const formData = {
      ...data,
      totalAmount: parseFloat(data.totalAmount),
      timestamp: new Date(data.timestamp).toISOString(),
      accountId: MOCK_ACCOUNT_ID,
    };
    if (editId) {
      updateMockTransaction(editId, formData);
      toast.success("Transaction updated!");
    } else {
      addMockTransaction(formData);
      toast.success("Transaction added!");
    }
    reset();
    router.push("/dashboard");
  };

  if (isLoaded && isSignedIn) return null;

  return (
    <div className="max-w-3xl mx-auto px-5">
      <h1 className="text-4xl md:text-5xl gradient-title mb-4">{editId ? "Edit" : "Add"} Transaction</h1>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <Select
            onValueChange={(v) => { setValue("transactionType", v); trigger("transactionType"); setValue("category", ""); }}
            defaultValue={transactionType}
          >
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Transaction Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>
          {errors.transactionType && <p className="text-sm text-red-500">{errors.transactionType.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            onValueChange={(v) => { setValue("category", v); trigger("category"); }}
            value={getValues("category")}
          >
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {filteredCategories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input type="number" step="0.01" placeholder="0.00" {...register("totalAmount")} />
            {errors.totalAmount && <p className="text-sm text-red-500">{errors.totalAmount.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full pl-3 text-left font-normal">
                  {timestamp ? format(timestamp, "PPP") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={timestamp}
                  onSelect={(d) => setValue("timestamp", d)}
                  disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.timestamp && <p className="text-sm text-red-500">{errors.timestamp.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input placeholder="e.g. Salary, Grocery, Netflix" {...register("assetName")} />
          {errors.assetName && <p className="text-sm text-red-500">{errors.assetName.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes (optional)</label>
          <Input placeholder="Additional notes" {...register("description")} />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <label className="text-sm font-medium cursor-pointer">Recurring Transaction</label>
            <p className="text-sm text-muted-foreground">Set up a recurring schedule</p>
          </div>
          <Switch checked={isRecurring} onCheckedChange={(c) => setValue("isRecurring", c)} />
        </div>

        {isRecurring && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Recurring Interval</label>
            <Select
              onValueChange={(v) => { setValue("recurringInterval", v); trigger("recurringInterval"); }}
              defaultValue={getValues("recurringInterval")}
            >
              <SelectTrigger><SelectValue placeholder="Select interval" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {errors.recurringInterval && <p className="text-sm text-red-500">{errors.recurringInterval.message}</p>}
          </div>
        )}

        <div className="flex gap-4">
          <Button type="button" variant="outline" className="w-1/2" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" className="w-1/2" disabled={submitting}>
            {submitting
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{editId ? "Updating..." : "Adding..."}</>
              : editId ? "Update Transaction" : "Add Transaction"
            }
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function DemoTransactionPage() {
  return (
    <Suspense fallback={null}>
      <DemoTransactionForm />
    </Suspense>
  );
}
