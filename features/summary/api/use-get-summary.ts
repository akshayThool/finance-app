import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";
import { convertMiliunitsToAmount } from "@/lib/utils";

export const useGetSummary = () => {
    const params = useSearchParams();
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get("accountId") || "";

    const query = useQuery({
        queryKey: ["summary", { from, to, accountId }],
        queryFn: async () => {
            const response = await client.api.summary.$get({
                query: {
                    from,
                    to,
                    accountId,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to Fetch Summary");
            }

            const { data } = await response.json();
            return {
                ...data,
                incomeAmount: convertMiliunitsToAmount(data.incomeAmount),
                expenseAmount: convertMiliunitsToAmount(data.expenseAmount),
                remainingAmount: convertMiliunitsToAmount(data.remainingAmount),
                categories: data.categories.map((category) => ({
                    ...category,
                    value: convertMiliunitsToAmount(category.value),
                })),
                days: data.days.map((day) => ({
                    ...day,
                    income: convertMiliunitsToAmount(day.income),
                    expense: convertMiliunitsToAmount(day.expense),
                })),
            };
        },
    });

    return query;
};
