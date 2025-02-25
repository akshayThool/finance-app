import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.transactions["delete"]["$post"]>
type RequestType = InferRequestType<typeof client.api.transactions["delete"]["$post"]>["json"]

export const useDeleteTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions["delete"].$post({json});
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transactions Deleted");
      queryClient.invalidateQueries({queryKey: ["transactions"]});
      //TODO: Also Invalidate Summary
    },
    onError: () => {
      toast.error("Failed to Delete Transactions");
    }
  });

  return mutation;
}