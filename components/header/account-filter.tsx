"use client";

import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectContent,
} from "../ui/select";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

export const AccountFilter = () => {
    const router = useRouter();
    const pathName = usePathname();

    const params = useSearchParams();
    const accountId = params.get("accountId") || "all";
    const from = params.get("from") || "";
    const to = params.get("to") || "";

    const onChange = (newAccountId: string) => {
        const newQuery = {
            accountId: newAccountId,
            from,
            to,
        };

        if (newAccountId === "all") {
            newQuery.accountId = "";
        }

        const url = qs.stringifyUrl(
            {
                url: pathName,
                query: newQuery,
            },
            { skipNull: true, skipEmptyString: true }
        );

        router.push(url);
    };

    const { data: accounts, isLoading: isAccountLoading } = useGetAccounts();
    const { isLoading: isSummaryLoading } = useGetSummary();
    return (
        <Select
            value={accountId}
            onValueChange={onChange}
            disabled={isAccountLoading || isSummaryLoading}
        >
            <SelectTrigger
                className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 
            hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white
             focus:bg-white/30 transition"
            >
                <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                        {account.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
