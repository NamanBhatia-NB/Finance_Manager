"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Explicitly pick and serialize only the fields needed by the client
const serializeTransaction = (obj) => {
    // Account shape
    if (obj.balance !== undefined && obj.name !== undefined) {
        return {
            id: obj.id,
            name: obj.name,
            type: obj.type,
            balance: obj.balance?.toNumber?.() ?? Number(obj.balance),
            isDefault: obj.isDefault,
            _count: obj._count,
        };
    }
    // Transaction shape
    return {
        id: obj.id,
        accountId: obj.accountId,
        assetName: obj.assetName,
        description: obj.description ?? "",
        category: obj.category ?? "other-expense",
        transactionType: obj.transactionType,
        status: obj.status,
        totalAmount: obj.totalAmount?.toNumber?.() ?? Number(obj.totalAmount),
        timestamp: obj.timestamp,
        isRecurring: obj.isRecurring,
        recurringInterval: obj.recurringInterval ?? null,
        nextRecurringDate: obj.nextRecurringDate ?? null,
        lastProcessed: obj.lastProcessed ?? null,
    };
};

export async function createAccount(data) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Convert balance to float before saving
        const balanceFloat = parseFloat(data.balance);
        if (isNaN(balanceFloat)) {
            throw new Error("Invalid balance amount");
        }

        // Check if this is the user's first account
        const existingAccounts = await db.account.findMany({
            where: { userId: user.id },
        });

        const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault;

        //If this account should be default unset other default accounts
        if (shouldBeDefault) {
            await db.account.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false },
            });
        }

        const account = await db.account.create({
            data: {
                ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDefault,
            },
        });

        const serializedAccount = serializeTransaction(account);

        revalidatePath("/dashboard");

        return { success: true, data: serializedAccount };
    }
    catch (error) {
        throw new Error(error.message);
    }

}

export async function getUserAccounts() {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const accounts = await db.account.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: {
                    transactions: true,
                },
            },
        },
    });

    const serializedAccount = accounts.map(serializeTransaction);

    return serializedAccount;
}

export async function getDashboardData() {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Get all user transactions
    const transactions = await db.transaction.findMany({
        where: { userId: user.id },
        orderBy: { timestamp: "desc" },
    });

    return transactions.map(serializeTransaction);
}