"use client";

import { bulkDeleteTransactions } from '@/actions/accounts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { defaultCategories } from '@/data/categories';
import useFetch from '@/hooks/use-fetch';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Clock, Download, FileJson, MoreHorizontal, RefreshCw, Search, Trash, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';
import { useRole } from '@/components/RoleContext';
import { useMockData } from '@/components/MockDataContext';

const RECURRING_INTERVALS = { DAILY: "Daily", WEEKLY: "Weekly", MONTHLY: "Monthly", YEARLY: "Yearly" };
const categoryNameMap = defaultCategories.reduce((acc, c) => { acc[c.id] = c.name; return acc; }, {});

const TransactionTable = ({ transactions, isMock = false }) => {
  const router = useRouter();
  const { isAdmin } = useRole();
  const { deleteMockTransactions } = useMockData();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: "timestamp", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter((t) => t.assetName?.toLowerCase().includes(s) || t.description?.toLowerCase().includes(s));
    }
    if (typeFilter) result = result.filter((t) => t.transactionType === typeFilter);
    if (categoryFilter) result = result.filter((t) => t.category === categoryFilter);
    if (recurringFilter) result = result.filter((t) => recurringFilter === "recurring" ? t.isRecurring : !t.isRecurring);

    result.sort((a, b) => {
      let cmp = 0;
      if (sortConfig.field === "timestamp") cmp = new Date(a.timestamp) - new Date(b.timestamp);
      else if (sortConfig.field === "totalAmount") cmp = Number(a.totalAmount) - Number(b.totalAmount);
      else if (sortConfig.field === "transactionType") cmp = a.transactionType.localeCompare(b.transactionType);
      return sortConfig.direction === "asc" ? cmp : -cmp;
    });
    return result;
  }, [transactions, searchTerm, typeFilter, categoryFilter, recurringFilter, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / transactionsPerPage);
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  useEffect(() => { setCurrentPage(1); }, [searchTerm, typeFilter, categoryFilter, recurringFilter]);

  const handleSort = (field) => {
    setSortConfig((c) => ({ field, direction: c.field === field && c.direction === "asc" ? "desc" : "asc" }));
  };
  const handleSelect = (id) => setSelectedIds((c) => c.includes(id) ? c.filter((i) => i !== id) : [...c, id]);
  const handleSelectAll = () => setSelectedIds((c) => c.length === filteredAndSortedTransactions.length ? [] : filteredAndSortedTransactions.map((t) => t.id));
  const handleClearFilters = () => { setSearchTerm(""); setTypeFilter(""); setCategoryFilter(""); setRecurringFilter(""); setSelectedIds([]); };

  const { loading: deleteLoading, fn: deleteFn, data: deleted } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} transaction(s)?`)) return;
    if (isMock) { deleteMockTransactions(selectedIds); setSelectedIds([]); toast.success("Deleted successfully"); }
    else deleteFn(selectedIds);
  };

  const handleSingleDelete = (id) => {
    if (isMock) { deleteMockTransactions([id]); toast.success("Deleted successfully"); }
    else deleteFn([id]);
  };

  useEffect(() => { if (deleted && !deleteLoading) { toast.success("Transactions deleted successfully!"); setSelectedIds([]); } }, [deleted, deleteLoading]);

  const hasActiveFilters = searchTerm || typeFilter || categoryFilter || recurringFilter;

  const exportData = (type) => {
    if (!hasActiveFilters) {
      toast.info("Tip: Use filters to export a specific subset of transactions.");
    }
    const data = filteredAndSortedTransactions;
    if (type === "csv") {
      const headers = ["Date", "Name", "Category", "Type", "Amount", "Description", "Recurring"];
      const rows = data.map((t) => [
        format(new Date(t.timestamp), "yyyy-MM-dd"),
        t.assetName,
        categoryNameMap[t.category] || t.category || "",
        t.transactionType,
        t.totalAmount,
        t.description || "",
        t.isRecurring ? (RECURRING_INTERVALS[t.recurringInterval] || "Yes") : "No",
      ]);
      const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "transactions.csv"; a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "transactions.json"; a.click();
      URL.revokeObjectURL(url);
    }
  };

  const SortIcon = ({ field }) => sortConfig.field === field
    ? (sortConfig.direction === "asc" ? <ChevronUp className='ml-1 h-4 w-4' /> : <ChevronDown className='ml-1 h-4 w-4' />)
    : null;

  return (
    <div className='space-y-4'>
      {deleteLoading && <BarLoader className='mt-4' width={"100%"} color="#51a2ff" />}

      <div className='flex flex-col gap-3'>
        <div className='relative'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input placeholder="Search transactions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='pl-8' />
        </div>

        <div className='flex flex-wrap gap-2 items-center'>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[110px] h-9"><SelectValue placeholder="All types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              {defaultCategories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={recurringFilter} onValueChange={setRecurringFilter}>
            <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Recurring" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring</SelectItem>
              <SelectItem value="one-time">One-time</SelectItem>
            </SelectContent>
          </Select>

          {isAdmin && selectedIds.length > 0 && (
            <Button className="h-9" variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash className='h-4 w-4 mr-1' /><span className="hidden sm:table-cell">Delete</span> ({selectedIds.length})
            </Button>
          )}

          {hasActiveFilters && (
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleClearFilters} title="Clear Filters">
              <X className="h-4 w-4" />
            </Button>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1 h-9">
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:table-cell">Export</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => exportData("csv")}>
                      <Download className="h-4 w-4 mr-2" />Export CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportData("json")}>
                      <FileJson className="h-4 w-4 mr-2" />Export JSON
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exports currently filtered transactions.<br />Use filters to narrow down your export.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              {isAdmin && (
                <TableHead className="w-[50px]">
                  <Checkbox onCheckedChange={handleSelectAll} checked={selectedIds.length === filteredAndSortedTransactions.length && filteredAndSortedTransactions.length > 0} />
                </TableHead>
              )}
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort("timestamp")}>
                <div className='flex items-center'>Date <SortIcon field="timestamp" /></div>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="">Category</TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort("transactionType")}>
                <div className='flex items-center'>Type <SortIcon field="transactionType" /></div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort("totalAmount")}>
                <div className='flex items-center justify-end'>Amount <SortIcon field="totalAmount" /></div>
              </TableHead>
              <TableHead className="text-center">Recurring</TableHead>
              {isAdmin && <TableHead className="w-[50px]" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell className="text-center text-muted-foreground" colSpan={isAdmin ? 8 : 6}>No transactions found</TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  {isAdmin && (
                    <TableCell>
                      <Checkbox onCheckedChange={() => handleSelect(transaction.id)} checked={selectedIds.includes(transaction.id)} />
                    </TableCell>
                  )}
                  <TableCell className="font-medium whitespace-nowrap">{format(new Date(transaction.timestamp), "PP")}</TableCell>
                  <TableCell>
                    <div className="font-medium">{transaction.assetName}</div>
                    {transaction.description && <div className="text-xs text-muted-foreground">{transaction.description}</div>}
                  </TableCell>
                  <TableCell className="">
                    <span className="text-sm">{categoryNameMap[transaction.category] || transaction.category || "—"}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.transactionType === "INCOME" ? "default" : "destructive"} className="text-xs whitespace-nowrap">
                      {transaction.transactionType === "INCOME" ? "Income" : "Expense"}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right font-medium whitespace-nowrap' style={{ color: transaction.transactionType === "INCOME" ? "green" : "red" }}>
                    {transaction.transactionType === "INCOME" ? "+" : "-"}₹ {Number(transaction.totalAmount).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center ">
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                              <RefreshCw className="h-3 w-3" />{RECURRING_INTERVALS[transaction.recurringInterval]}
                            </Badge>
                          </TooltipTrigger>
                          {/* <TooltipContent>
                            {transaction.nextRecurringDate && (
                              <div className='text-sm'>
                                <div className='font-medium'>Next Date:</div>
                                <div>{format(new Date(transaction.nextRecurringDate), "PP")}</div>
                              </div>
                            )}
                          </TooltipContent> */}
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="outline" className="gap-1"><Clock className='h-3 w-3' />One-time</Badge>
                    )}
                  </TableCell>
                  {isAdmin && (
                    <TableCell >
                      {!isMock && (<DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className='h-4 w-4' /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => {
                            // if (isMock) router.push(`/transaction/new?edit=${transaction.id}`);
                            // else router.push(`/transaction/create?edit=${transaction.id}`);
                          }}>Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleSingleDelete(transaction.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>)}
                      {isMock && (
                        <Button onClick={() => handleSingleDelete(transaction.id)} className="" variant="destructive" size="sm">
                          <Trash className='h-4 w-4 mr-1' />
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="grid md:flex justify-center items-center gap-2 mt-4">
          <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Previous</Button>
          <div className="flex justify-center flex-wrap gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <Button key={i} className="min-w-[40px]" variant={currentPage === i + 1 ? "default" : "outline"} onClick={() => setCurrentPage(i + 1)}>{i + 1}</Button>
            ))}
          </div>
          <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  )
}

export default TransactionTable;
