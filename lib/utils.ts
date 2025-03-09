import { type ClassValue, clsx } from "clsx";
import { eachDayOfInterval, isSameDay } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
}

export function convertMiliunitsToAmount(miliunits: number) {
  return miliunits / 1000;
}

export function formatCurrency(value: number) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
}

export function fillMissingDays(
  activeDays: {
    date: Date;
    income: number;
    expense: number;
  }[], 
  startDate: Date,
  endDate: Date
) {
  if(activeDays.length === 0){
    return [];
  }

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const transactionsByDays = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day));

    if(found){
      return found;
    } else {
      return {
        date: day,
        income: 0,
        expense: 0
      }
    }
  });

  return transactionsByDays;
}
