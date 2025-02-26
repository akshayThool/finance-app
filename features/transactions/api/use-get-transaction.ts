import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";
import { convertMiliunitsToAmount } from "@/lib/utils";


export const useGetTransaction = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey : ["transactions", { id }],
    queryFn: async () => {
      const response = await client.api.transactions[":id"].$get({
        param: { id }, 
      });

      if(!response.ok){
        throw new Error("Failed to Fetch Transaction");
      }

      const { data } = await response.json();
      return { 
        ...data,
        amount: convertMiliunitsToAmount(data.amount)
      }
    }
  })

  return query;
}