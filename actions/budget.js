"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getCurrentBudget(accountId) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const budget = await db.portfolio.findFirst({
            where: {
                userId: user.id,
            },
        });

        const currentDate = new Date();
        const startOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );
        const endOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
        );

        const expenses = await db.transaction.aggregate({
            where: {
                userId: user.id,
                transactionType: "INCOME",
                timestamp: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
                accountId,
            },
            _sum: {
                totalAmount: true,
            },
        });

        return {
            budget: budget ? { ...budget, totalValue: budget.totalValue.toNumber() } : null,
            currentExpenses: expenses._sum.totalAmount
                ? expenses._sum.totalAmount.toNumber()
                : 0,
        };
    } catch (error) {
        console.error("Error fetching budget : ", error);
        throw error;
    }
}

export async function updateBudget(totalValue) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const budget = await db.portfolio.upsert({
            where: {
                userId: user.id,
            },
            update: {
                totalValue,
            },
            create: {
                userId: user.id,
                totalValue,
            },
        });

        revalidatePath("/dashboard");

        return {
            success: true,
            data: { ...budget, totalValue: budget.totalValue.toNumber() },
        };
    } catch (error) {
        console.error("Error updating budget : ", error);
        return { success: false, error: error.message };
    }
}