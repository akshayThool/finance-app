import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.categories["delete"]["$post"]>
type RequestType = InferRequestType<typeof client.api.categories["delete"]["$post"]>["json"]

export const useDeleteCategories = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.categories["delete"].$post({json});
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Categories Deleted");
      queryClient.invalidateQueries({queryKey: ["categories"]});
      //TODO: Also Invalidate Summary
    },
    onError: () => {
      toast.error("Failed to Delete Categories");
    }
  });

  return mutation;
}