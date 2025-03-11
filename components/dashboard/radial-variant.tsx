import { formatCurrency, formatPercentage } from "@/lib/utils";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    RadialBar,
    RadialBarChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { CategoryToolTip } from "./category-tooltip";

type Props = {
    data: {
        name: string;
        value: number;
    }[];
};

const COLORS = ["#0062FF", "#12C6FF", "#FF647F", "#FF9354"];

export const RadialVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <RadialBarChart
                cx="50%"
                cy="50%"
                barSize={10}
                innerRadius="90%"
                outerRadius="40%"
                data={data.map((item, index) => ({
                    ...item,
                    fill: COLORS[index % COLORS.length],
                }))}
            >
                <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="right"
                    iconType="circle"
                    content={({ payload }: any) => (
                        <ul className="flex flex-col space-y-2">
                            {payload.map((entry: any, index: number) => {
                                return (
                                    <li
                                        key={`leg-item-${index}`}
                                        className="flex items-center space-x-2"
                                    >
                                        <span
                                            className="rounded-full size-2"
                                            style={{
                                                backgroundColor: entry.color,
                                            }}
                                        ></span>
                                        <div className="space-x-1">
                                            <span className="text-sm text-muted-foreground">
                                                {entry.value}
                                            </span>
                                            <span className="text-sm">
                                                {formatCurrency(
                                                    entry.payload.value
                                                )}
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                />
                <RadialBar background dataKey="value" />
            </RadialBarChart>
        </ResponsiveContainer>
    );
};
