import {InferResponseType} from "hono";
import {client} from "@/lib/hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>

export const useDeleteAccount = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
      ResponseType,
      Error>({
          mutationFn: async () => {
            const response = await client.api.accounts[":id"]["$delete"]({
              param: { id }, 
            });
            return await response.json();
          },
          onSuccess: () => {
            toast.success("Account Delete");
            queryClient.invalidateQueries({queryKey: ["accounts", { id }]});
            queryClient.invalidateQueries({queryKey: ["accounts"]});
            // TODO: Invalidate Summary and Transaction;
          },
          onError: () => {
            toast.error("Failed to Update Account");
          }
    });

    return mutation;
}