"use client";

import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import {useDeleteTransactions} from "@/features/transactions/api/use-delete-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Loader2, Plus} from "lucide-react";
import {columns} from "@/app/(dashboard)/transactions/columns";

import {DataTable} from "@/components/data-table";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";

const TransactionPage = () => {
  const newTransaction = useNewTransaction();
  const getAllTransactions = useGetTransactions();
  const deleteTransactions = useDeleteTransactions();

  const transactions = getAllTransactions.data || [];

  const isDisabled = getAllTransactions.isLoading || deleteTransactions.isPending;

  if(getAllTransactions.isLoading){
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48"/>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Transaction History</CardTitle>
          <Button size="sm" onClick={newTransaction.onOpen}>
            <Plus className="size-4 mr-2"/>
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="date"
            columns={columns}
            data={transactions}
            onDelete={ (rows)=>{
                const ids = rows.map((row)=>row.original.id);
                deleteTransactions.mutate({ids});
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default TransactionPage;