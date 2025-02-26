import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {z} from "zod";
import { Loader2 } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { insertTransactionSchema } from "@/db/schema";
import { useOpenTransaction } from "../hooks/use-open-transaction";
import { useGetTransaction } from "../api/use-get-transaction";
import { useEditTransaction } from "../api/use-edit-transaction";
import { useDeleteTransaction } from "../api/use-delete-transaction";
import { TransactionForm } from "./transaction-form";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

const formSchema = insertTransactionSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditTransactionSheet = () => {
  const {id, isOpen, onClose} = useOpenTransaction();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you Sure?",
    "You are going to delete this particular transaction"
  );
  const transactionQuery = useGetTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name : string) => categoryMutation.mutate({
    name
  });
  const categoriesOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id
  }));

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name : string) => accountMutation.mutate({
    name
  });
  const accountsOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id
  }));

  const isPending = editMutation.isPending || deleteMutation.isPending || accountMutation.isPending || categoryMutation.isPending;

  const isLoading = transactionQuery.isLoading || accountQuery.isLoading || categoryQuery.isLoading;

  const onSubmit = (values : FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      }
    });
  }

  const onDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        }
      })
    }
  }

  const defaultValues = transactionQuery.data ? {
    date : transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
    category: transactionQuery.data.category,
    account: transactionQuery.data.account,
    accountId: transactionQuery.data.accountId,
    payee: transactionQuery.data.payee,
    amount: transactionQuery.data.amount.toString(),
    notes: transactionQuery.data.notes
  } : {
    date: new Date(),
    category: "",
    account: "",
    accountId: "",
    payee: "",
    amount: "",
    notes: ""
  }

  return (
    <>
    <ConfirmationDialog />
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>
            Edit Transaction
          </SheetTitle>
          <SheetDescription>
            Edit an existing Transaction
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex justify-center items-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (<TransactionForm
               id={id} 
               onSubmit={onSubmit}
               disabled={isPending}
               defaultValues={defaultValues}
               onDelete={onDelete}
               onCreateAccount={onCreateAccount}
               onCreateCategory={onCreateCategory}
               accountsOptions={accountsOptions}
               categoriesOptions={categoriesOptions}
               />)}        
      </SheetContent>
    </Sheet>
    </>
  )
}