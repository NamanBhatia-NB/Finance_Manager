import { z } from "zod";

export const accountSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["CASH", "BANK", "BROKERAGE", "CRYPTO"]),
    balance: z.string().min(1, "Initial Balance is required"),
    isDefault: z.boolean().default(false),
})

export const transactionSchema = z.object({
    transactionType: z.enum(["INCOME", "EXPENSE"]),
    totalAmount: z.string().min(1, "Amount is required."),
    description: z.string().optional(),
    timestamp: z.date({ required_error: "Date is required." }),
    accountId: z.string().min(1, "Account is required."),
    assetName: z.string().min(1, "Name is required."),
    category: z.string().min(1, "Category is required."),
    isRecurring: z.boolean().default(false),
    recurringInterval: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).optional(),
})
    .superRefine((data, ctx) => {
        if (data.isRecurring && !data.recurringInterval) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Recurring Interval is required for recurring transactions.",
                path: ["recurringInterval"],
            });
        }
    });