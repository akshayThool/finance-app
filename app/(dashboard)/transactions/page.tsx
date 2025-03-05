"use client";

import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useDeleteTransactions } from "@/features/transactions/api/use-delete-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { columns } from "@/app/(dashboard)/transactions/columns";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { UploadButton } from "./upload-button";
import { useState } from "react";
import { ImportCard } from "./import-card";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

const TransactionPage = () => {
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  const onUploadCSV = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setVariant(VARIANTS.LIST);
    setImportResults(INITIAL_IMPORT_RESULTS);
  };

  const newTransaction = useNewTransaction();
  const getAllTransactions = useGetTransactions();
  const deleteTransactions = useDeleteTransactions();

  const transactions = getAllTransactions.data || [];

  const isDisabled =
    getAllTransactions.isLoading || deleteTransactions.isPending;

  if (getAllTransactions.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <ImportCard data={importResults.data} onCancel={onCancelImport} />
      </>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transaction History
          </CardTitle>
          <div className="flex items-center gap-2 flex-col lg:flex-row">
            <Button
              size="sm"
              onClick={newTransaction.onOpen}
              className="w-full lg:w-auto"
            >
              <Plus className="size-4 mr-2" />
              Add New
            </Button>
            <UploadButton onUpload={onUploadCSV} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="payee"
            columns={columns}
            data={transactions}
            onDelete={(rows) => {
              const ids = rows.map((row) => row.original.id);
              deleteTransactions.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionPage;
