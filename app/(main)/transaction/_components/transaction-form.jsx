"use client"

import { createTransaction, updateTransaction } from '@/actions/transaction';
import { transactionSchema } from '@/app/lib/schema';
import CreateAccountDrawer from '@/components/create-account-drawer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import useFetch from '@/hooks/use-fetch';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import ReceiptScanner from './receipt-scanner';
import { defaultCategories } from '@/data/categories';
import { useRole } from '@/components/RoleContext';

const AddTransactionForm = ({ accounts, editMode = false, initialData = null }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { isAdmin } = useRole();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
    trigger,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData ? {
        assetName: initialData.assetName,
        transactionType: initialData.transactionType,
        totalAmount: initialData.totalAmount.toString(),
        description: initialData.description,
        accountId: initialData.accountId,
        category: initialData.category || "other-expense",
        timestamp: new Date(initialData.timestamp),
        isRecurring: initialData.isRecurring,
        ...(initialData.recurringInterval && { recurringInterval: initialData.recurringInterval }),
      } : {
        transactionType: "EXPENSE",
        totalAmount: "",
        description: "",
        accountId: accounts.find((ac) => ac.isDefault)?.id,
        category: "other-expense",
        timestamp: new Date(),
        isRecurring: false,
      },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const transactionType = watch("transactionType");
  const isRecurring = watch("isRecurring");
  const timestamp = watch("timestamp");

  const filteredCategories = defaultCategories.filter(
    (c) => c.type === (transactionType === "INCOME" ? "INCOME" : "EXPENSE")
  );

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      totalAmount: parseFloat(data.totalAmount),
      timestamp: new Date(data.timestamp),
    };
    if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(editMode ? "Transaction updated successfully." : "Transaction created successfully.");
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);

  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      setValue("assetName", scannedData.assetName || "");
      setValue("totalAmount", scannedData.amount.toString());
      setValue("timestamp", new Date(scannedData.date));
      setValue("description", scannedData.description || "");
      if (scannedData.transactionType) {
        const type = scannedData.transactionType.toUpperCase() === "SELL" ? "EXPENSE" : "INCOME";
        setValue("transactionType", type);
      }
      if (typeof scannedData.isRecurring === "boolean") setValue("isRecurring", scannedData.isRecurring);
      if (scannedData.isRecurring && scannedData.recurringInterval) {
        setValue("recurringInterval", scannedData.recurringInterval.toUpperCase());
      }
    }
  };

  return (
    <form className='space-y-6 px-2' onSubmit={handleSubmit(onSubmit)}>
      {!editMode && isAdmin && <ReceiptScanner onScanComplete={handleScanComplete} />}

      <div className='space-y-2'>
        <label className='text-sm font-medium'>Type</label>
        <Select
          onValueChange={(value) => { setValue("transactionType", value); trigger("transactionType"); }}
          defaultValue={transactionType}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Transaction Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>
        {errors.transactionType && <p className='text-sm text-red-500'>{errors.transactionType.message}</p>}
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium'>Category</label>
        <Select
          onValueChange={(value) => { setValue("category", value); trigger("category"); }}
          defaultValue={getValues("category")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className='text-sm text-red-500'>{errors.category.message}</p>}
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Amount</label>
          <Input type="number" step="0.01" placeholder="0.00" {...register("totalAmount")} />
          {errors.totalAmount && <p className='text-sm text-red-500'>{errors.totalAmount.message}</p>}
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Account</label>
          <Select
            onValueChange={(value) => { setValue("accountId", value); trigger("accountId"); }}
            defaultValue={getValues("accountId")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} (₹ {parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <Button variant="ghost" className="w-full select-none items-center text-sm outline-none">Create Account</Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId && <p className='text-sm text-red-500'>{errors.accountId.message}</p>}
        </div>
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium'>Name / Description</label>
        <Input placeholder='e.g. Salary, Grocery, Netflix' {...register("assetName")} />
        {errors.assetName && <p className='text-sm text-red-500'>{errors.assetName.message}</p>}
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium'>Date</label>
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
              onSelect={(date) => setValue("timestamp", date)}
              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.timestamp && <p className='text-sm text-red-500'>{errors.timestamp.message}</p>}
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium'>Notes (optional)</label>
        <Input placeholder='Additional notes' {...register("description")} />
      </div>

      <div className='flex items-center justify-between rounded-lg border p-3'>
        <div className='space-y-0.5'>
          <label className='text-sm font-medium cursor-pointer'>Recurring Transaction</label>
          <p className='text-sm text-muted-foreground'>Set up a recurring schedule for this transaction</p>
        </div>
        <Switch checked={isRecurring} onCheckedChange={(checked) => setValue("isRecurring", checked)} />
      </div>

      {isRecurring && (
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Recurring Interval</label>
          <Select
            onValueChange={(value) => { setValue("recurringInterval", value); trigger("recurringInterval"); }}
            defaultValue={getValues("recurringInterval")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
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
        <Button type="submit" className="w-1/2" disabled={transactionLoading}>
          {transactionLoading ? (
            <><Loader2 className='mr-2 h-4 w-4 animate-spin' />{editMode ? "Updating..." : "Creating..."}</>
          ) : editMode ? "Update Transaction" : "Create Transaction"}
        </Button>
      </div>
    </form>
  )
}

export default AddTransactionForm;
