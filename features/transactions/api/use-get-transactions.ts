import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";
import { useSearchParams } from "next/navigation";
import { convertMiliunitsToAmount } from "@/lib/utils";


export const useGetTransactions = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    queryKey : ["transactions", {from, to, accountId}],
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: {
          from,
          to,
          accountId
        }
      });

      if(!response.ok){
        throw new Error("Failed to Fetch Transactions");
      }

      const { data } = await response.json();
      return data.map((transaction) => ({
        ...transaction,
        amount: convertMiliunitsToAmount(transaction.amount)
      }));
    }
  })

  return query;
}