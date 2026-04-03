"use client";

import { Suspense, useEffect, useState, useMemo, useRef } from "react";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      transactionType: "",
      totalAmount: "",
      description: "",
      accountId: MOCK_ACCOUNT_ID,
      category: "",
      timestamp: new Date(),
      isRecurring: false,
    },
  });

  const transactionType = watch("transactionType");
  const category = watch("category");
  const timestamp = watch("timestamp");
  const isRecurring = watch("isRecurring");
  const recurringInterval = watch("recurringInterval");

  // Filter categories based on Income/Expense
  const filteredCategories = useMemo(() => {
    return defaultCategories.filter((c) => c.type === transactionType);
  }, [transactionType]);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!editId || !mockTransactions?.length || hasInitialized.current) return;

    const tx = mockTransactions.find((t) => t.id === editId);
    if (!tx) return;

    hasInitialized.current = true; // ✅ STOP future resets

    reset({
      assetName: tx.assetName,
      totalAmount: tx.totalAmount.toString(),
      description: tx.description || "",
      timestamp: new Date(tx.timestamp),
      isRecurring: !!tx.isRecurring,
      recurringInterval: tx.recurringInterval || "",
      transactionType: tx.transactionType,
      category: tx.category,
      accountId: MOCK_ACCOUNT_ID,
    });

  }, [editId, mockTransactions, reset]);

  useEffect(() => {
    if (isLoaded && !isAdmin) {
      toast.error("Only admins can add transactions.");
      router.replace("/dashboard");
    }
  }, [isAdmin, isLoaded, router]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const formData = {
        ...data,
        totalAmount: parseFloat(data.totalAmount),
        timestamp: new Date(data.timestamp).toISOString(), // Store as ISO String for LocalStorage
        accountId: MOCK_ACCOUNT_ID,
      };

      if (editId) {
        updateMockTransaction(editId, formData);
        toast.success("Transaction updated!");
      } else {
        addMockTransaction(formData);
        toast.success("Transaction added!");
      }

      router.push("/dashboard");
    } catch (error) {
      // console.error("SUBMIT ERROR:", error);
      toast.error("Failed to save transaction");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoaded && isSignedIn) return null;

  console.log("CURRENT FORM STATE:", { transactionType, category, availableCats: filteredCategories.length });

  return (
    <div className="max-w-3xl mx-auto px-5">
      <h1 className="text-4xl md:text-5xl gradient-title mb-4">
        {editId ? "Edit" : "Add"} Transaction
      </h1>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

        {/* Transaction Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <Select
            value={transactionType || undefined}
            onValueChange={(v) => {
              setValue("transactionType", v);
              // Just pick the first category of the new type so it's never empty/invalid
              const firstCat = defaultCategories.find((c) => c.type === v)?.id;
              setValue("category", firstCat || "");
              trigger(["transactionType", "category"]);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>
          {errors.transactionType && (
            <p className="text-sm text-red-500">{errors.transactionType.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={category || undefined}
            onValueChange={(v) => {
              setValue("category", v);
              trigger("category");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {filteredCategories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>

        {/* Amount & Date */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("totalAmount")}
            />
            {errors.totalAmount && (
              <p className="text-sm text-red-500">{errors.totalAmount.message}</p>
            )}
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
                  onSelect={(d) => {
                    setValue("timestamp", d || new Date());
                    trigger("timestamp");
                  }}
                  disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.timestamp && (
              <p className="text-sm text-red-500">{errors.timestamp.message}</p>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            placeholder="e.g. Salary, Grocery, Netflix"
            {...register("assetName")}
          />
          {errors.assetName && (
            <p className="text-sm text-red-500">{errors.assetName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes (optional)</label>
          <Input placeholder="Additional notes" {...register("description")} />
        </div>

        {/* Recurring */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <label className="text-sm font-medium cursor-pointer">
              Recurring Transaction
            </label>
          </div>
          <Switch
            checked={isRecurring}
            onCheckedChange={(c) => setValue("isRecurring", c)}
          />
        </div>

        {isRecurring && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Interval</label>
            <Select
              value={recurringInterval || ""}
              onValueChange={(v) => {
                setValue("recurringInterval", v);
                trigger("recurringInterval");
              }}
            >
              <SelectTrigger><SelectValue placeholder="Select interval" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex gap-4">
          <Button type="button" variant="outline" className="w-1/2" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" className="w-1/2" disabled={submitting}>
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : editId ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function DemoTransactionPage() {
  return (
      <DemoTransactionForm />
  );
}