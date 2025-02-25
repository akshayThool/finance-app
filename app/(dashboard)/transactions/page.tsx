"use client";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import {useDeleteAccounts} from "@/features/accounts/api/use-delete-accounts";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Loader2, Plus} from "lucide-react";
import {columns} from "@/app/(dashboard)/accounts/columns";
import {DataTable} from "@/components/data-table";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";

const TransactionPage = () => {
  const newTransaction = useNewTransaction();
  const openAccount = useOpenAccount();
  const useGetAccount = useGetAccounts();
  const deleteAccounts = useDeleteAccounts();

  const data = useGetAccount.data || [];

  const isDisabled = useGetAccount.isLoading || deleteAccounts.isPending;

  if(useGetAccount.isLoading){
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
            filterKey="name"
            columns={columns}
            data={data}
            onDelete={ (rows)=>{
                const ids = rows.map((row)=>row.original.id);
                deleteAccounts.mutate({ids});
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default TransactionPage;