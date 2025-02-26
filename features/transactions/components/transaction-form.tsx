import {z} from "zod";
import {insertTransactionSchema} from "@/db/schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";
import { Select } from "@/components/form/select";
import { DatePicker } from "@/components/form/date-picker";
import { Textarea } from "@/components/ui/textarea";
import {AmountInput} from "@/components/form/amount-input";
import { convertAmountToMiliunits } from "@/lib/utils";

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().nullable().optional(),
})

const apiFormSchema = insertTransactionSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiFormSchema>;

type Props = {
  id?: string,
  defaultValues?: FormValues,
  onSubmit: (values: ApiFormValues) => void,
  onDelete?: () => void,
  disabled?: boolean,
  onCreateCategory: (name: string) => void,
  categoriesOptions: {label: string; value: string}[],
  onCreateAccount: (name: string) => void,
  accountsOptions: {label: string; value: string}[]
}

export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  onCreateAccount,
  categoriesOptions,
  onCreateCategory,
  accountsOptions}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

  const handleSubmit = (values: FormValues) => {
    const parsedAmount = parseFloat(values.amount);
    const convertedToMiliunits = convertAmountToMiliunits(parsedAmount);

    onSubmit({
      ...values,
      amount: convertedToMiliunits
    });
  }

  const handleDelete = () => {
    onDelete?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}
       className="space-y-4 pt-4">
        <FormField 
          name="date"
          control={form.control}
          render={({field}) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField 
          name="accountId"
          control={form.control}
          render={({field}) => (
            <FormItem>
              <FormLabel>
                Account
              </FormLabel>
              <FormControl>
                <Select 
                  placeholder="Select an Account"
                  options={accountsOptions}
                  onCreate={onCreateAccount}
                  disabled={disabled}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField 
          name="categoryId"
          control={form.control}
          render={({field}) => (
            <FormItem>
              <FormLabel>
                Category
              </FormLabel>
              <FormControl>
                <Select 
                  placeholder="Select a Category"
                  options={categoriesOptions}
                  onCreate={onCreateCategory}
                  disabled={disabled}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField 
          name="payee"
          control={form.control}
          render={({field}) => (
            <FormItem>
              <FormLabel>
                Payee
              </FormLabel>
              <FormControl>
                <Input
                 {...field}
                 disabled={disabled}
                 placeholder="Add a Payee"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField 
          name="amount"
          control={form.control}
          render={({field}) => (
            <FormItem>
              <FormLabel>
                Amount
              </FormLabel>
              <FormControl>
                <AmountInput
                 {...field}
                 placeholder="0.00"
                 disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField 
          name="notes"
          control={form.control}
          render={({field}) => (
            <FormItem>
              <FormLabel>
                Notes
              </FormLabel>
              <FormControl>
                <Textarea
                 {...field}
                 value={field.value ?? ""}
                 disabled={disabled}
                 placeholder="Optional Notes"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {id ? "Save Changes" : "Create a Transaction"}
        </Button>
        { !!id && <Button
          type="button"
          disabled={disabled}
          onClick={handleDelete}
          className="w-full"
          variant="outline"
        >
          <Trash className="size-4 mr-2" />
          Delete Transaction
        </Button>}
      </form>
    </Form>
  )
};