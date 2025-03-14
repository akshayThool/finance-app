"use client";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { DataCard, DataCardLoading } from "@/components/dashboard/data-card";

const DataGrid = () => {
    const { data, isLoading } = useGetSummary();
    const params = useSearchParams();
    const to = params.get("to") || undefined;
    const from = params.get("from") || undefined;

    const dateRangeLabel = formatDateRange({ from, to });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
                <DataCardLoading />
                <DataCardLoading />
                <DataCardLoading />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
            <DataCard
                title="Remaining"
                dateRange={dateRangeLabel}
                icon={FaPiggyBank}
                variant="default"
                value={data?.remainingAmount}
                percentageChange={data?.remainingChange}
            />
            <DataCard
                title="Income"
                dateRange={dateRangeLabel}
                icon={FaArrowTrendUp}
                variant="success"
                value={data?.incomeAmount}
                percentageChange={data?.incomeChange}
            />
            <DataCard
                title="Expense"
                dateRange={dateRangeLabel}
                icon={FaArrowTrendDown}
                variant="danger"
                value={data?.expenseAmount}
                percentageChange={data?.expenseChange}
            />
        </div>
    );
};

export default DataGrid;
