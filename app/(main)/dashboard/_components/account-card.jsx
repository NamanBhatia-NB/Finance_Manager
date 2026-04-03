"use client";

import { updateDefaultAccount } from '@/actions/accounts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import useFetch from '@/hooks/use-fetch';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react'
import { toast } from 'sonner';
import { useRole } from '@/components/RoleContext';

const AccountCard = ({ account, isMock = false }) => {
  const { name, type, balance, id, isDefault } = account;
  const { isAdmin } = useRole();

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault();
    if (isDefault) { toast.warning("You need at least one default account."); return; }
    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) toast.success("Default account updated successfully!");
  }, [updatedAccount, updateDefaultLoading]);

  useEffect(() => {
    if (error) toast.error(error.message || "Failed to update default account!");
  }, [error]);

  const cardContent = (
    <Card className="hover:shadow-md transition-shadow group relative hover:scale-105 cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium capitalize">{name}</CardTitle>
        {isAdmin && !isMock && (
          <Switch checked={isDefault} onClick={handleDefaultChange} disabled={updateDefaultLoading} />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">₹ {parseFloat(balance).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <p className="text-sm text-muted-foreground">{type.charAt(0) + type.slice(1).toLowerCase()} Account</p>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div className='flex items-center'>
          <ArrowUpRight className='mr-1 h-4 w-4 text-green-500' />
          Income
        </div>
        <div className='flex items-center'>
          <ArrowDownRight className='mr-1 h-4 w-4 text-red-500' />
          Expense
        </div>
      </CardFooter>
    </Card>
  );

  if (isMock) return <Link href="/account/demo">{cardContent}</Link>;

  return <Link href={`/account/${id}`}>{cardContent}</Link>;
}

export default AccountCard;
