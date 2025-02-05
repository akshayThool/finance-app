import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeleteCategory } from "@/features/categories/api/use-delete-category";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { useConfirm } from "@/hooks/use-confirm";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

type Props =  {
    id : string
}

const Actions = ({id}: Props) => {
    const {onOpen} = useOpenCategory();
    const deleteMutation = useDeleteCategory(id);
    const [ConfirmationDialog, confirm] = useConfirm(
        "Are you Sure?",
        "You are going to delete this particular category"
    );

    const handleDelete = async () => {
        const ok = await confirm();
        if (ok) {
            deleteMutation.mutate()
        }
    }

    return (
        <>
            <ConfirmationDialog />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        disabled={false}
                        onClick={() => {onOpen(id)}}
                    >
                        <Edit className="size-4 mr-2" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={deleteMutation.isPending}
                        onClick={handleDelete}>
                        <Trash className="size-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default Actions;