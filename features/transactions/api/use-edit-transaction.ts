import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"]

export const useEditTransaction = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
      ResponseType,
      Error,
      RequestType>({
          mutationFn: async (json) => {
            const response = await client.api.transactions[":id"]["$patch"]({
              param: { id }, 
              json,
            });
            return await response.json();
          },
          onSuccess: () => {
            toast.success("Transaction Updated");
            queryClient.invalidateQueries({queryKey: ["transactions", { id }]});
            queryClient.invalidateQueries({queryKey: ["transactions"]});
            // TODO: Invalidate Summary;
          },
          onError: () => {
            toast.error("Failed to Update Transaction");
          }
    });

    return mutation;
}