import { AccountFilter } from "./account-filter";
import { DateFilter } from "./date-filter";

export const Filters = () => {
    return (
        <div className="flex gap-y-2 items-center lg:flex-row lg:gap-y-0 lg:gap-x-2">
            <AccountFilter />
            <DateFilter />
        </div>
    );
};
