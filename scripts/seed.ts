import { accounts, categories, transactions } from "@/db/schema";
import { convertAmountToMiliunits } from "@/lib/utils";
import { neon } from "@neondatabase/serverless";
import { eachDayOfInterval, format, subDays } from "date-fns";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const SEED_USER_ID = "user_2lki0Be6Sf5cdC8DgIm1TClTnUq";
const SEED_CATEGORIES = [
    { id: "category_1", name: "Food", userId: SEED_USER_ID, plaidId: null },
    { id: "category_2", name: "Rent", userId: SEED_USER_ID, plaidId: null },
    {
        id: "category_3",
        name: "Utilities",
        userId: SEED_USER_ID,
        plaidId: null,
    },
    { id: "category_7", name: "Clothing", userId: SEED_USER_ID, plaidId: null },
];

const SEED_ACCOUNTS = [
    { id: "account_1", name: "Checking", userId: SEED_USER_ID, plaidId: null },
    { id: "account_2", name: "Saving", userId: SEED_USER_ID, plaidId: null },
];

const defaultTo = new Date();
const defaultFrom = subDays(defaultTo, 90);

const SEED_TRANSACTIONS: (typeof transactions.$inferInsert)[] = [];

const generateRandomAmount = (category: typeof categories.$inferInsert) => {
    switch (category.name) {
        case "Rent":
            return Math.random() * 400 + 90;
        case "Food":
            return Math.random() * 30 + 10;
        case "Utilities":
            return Math.random() * 200 + 50;
        case "Clothing":
            return Math.random() * 50 + 15;
        default:
            return Math.random() * 50 + 10;
    }
};

const generateTransactionsForEachDay = (day: Date) => {
    const numOfTransactions = Math.floor(Math.random() * 4) + 1;

    for (let i = 0; i < numOfTransactions; i++) {
        const category =
            SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)];
        const isExpense = Math.random() > 0.6;
        const amount = generateRandomAmount(category);
        const formattedAmount = convertAmountToMiliunits(
            isExpense ? -amount : amount
        );

        SEED_TRANSACTIONS.push({
            id: `transaction_${format(day, "dd-MM-yyyy")}_${i}`,
            date: day,
            payee: "Merchant",
            notes: "Random Transactions",
            amount: formattedAmount,
            categoryId: category.id,
            accountId: SEED_ACCOUNTS[0].id,
        });
    }
};

const generateTransactions = () => {
    const days = eachDayOfInterval({ start: defaultFrom, end: defaultTo });
    days.forEach((day) => generateTransactionsForEachDay(day));
};

generateTransactions();

const main = async () => {
    try {
        await db.delete(transactions).execute();
        await db.delete(accounts).execute();
        await db.delete(categories).execute();

        await db.insert(categories).values(SEED_CATEGORIES).execute();
        await db.insert(accounts).values(SEED_ACCOUNTS).execute();
        await db.insert(transactions).values(SEED_TRANSACTIONS).execute();
    } catch (error) {
        console.log("Error during seed ", error);
        process.exit(1);
    }
};

main();
