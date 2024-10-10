import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.accounts["delete"]["$post"]>
type RequestType = InferRequestType<typeof client.api.accounts["delete"]["$post"]>["json"]

export const useDeleteAccounts = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts["delete"].$post({json});
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Accounts Deleted");
      queryClient.invalidateQueries({queryKey: ["accounts"]});
      //TODO: Also Invalidate Summary
    },
    onError: () => {
      toast.error("Failed to Delete Accounts");
    }
  });

  return mutation;
}