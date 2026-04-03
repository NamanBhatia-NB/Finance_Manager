"use server";

import { db } from "@/lib/prisma";
import { subDays } from "date-fns";

const USER_ID = "0940f503-ae64-4433-ad95-d67c8b29b605";
const ACCOUNT_ID = "6c936a72-07c0-4f7e-858f-9cecffdc9a89";

// Define sample categories with amounts
const CATEGORIES = [
  { category: "Salary", type: "INCOME", min: 3000, max: 7000 },
  { category: "Freelance", type: "INCOME", min: 500, max: 3000 },
  { category: "Investments", type: "INCOME", min: 200, max: 1500 },
  { category: "Rent", type: "EXPENSE", min: 800, max: 2000 },
  { category: "Groceries", type: "EXPENSE", min: 100, max: 500 },
  { category: "Entertainment", type: "EXPENSE", min: 50, max: 300 },
  { category: "Transportation", type: "EXPENSE", min: 30, max: 200 },
];

// Helper function to generate a random amount within a range
function getRandomAmount(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

// Function to generate random transactions
export async function seedTransactions() {
  try {
    const transactions = [];
    let totalBalance = 0;

    for (let i = 30; i >= 0; i--) { // Generate transactions for the last 30 days
      const date = subDays(new Date(), i);
      const transactionsPerDay = Math.floor(Math.random() * 3) + 1; // 1-3 transactions per day

      for (let j = 0; j < transactionsPerDay; j++) {
        const { category, type, min, max } =
          CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        const amount = getRandomAmount(min, max);
        const transactionType = type === "INCOME" ? "BUY" : "SELL";
        const status = "COMPLETED";
        const ticker = category.substring(0, 3).toUpperCase(); // Dummy ticker

        transactions.push({
          id: crypto.randomUUID(),
          userId: USER_ID,
          accountId: ACCOUNT_ID,
          assetName: category,
          ticker,
          transactionType,
          status,
          quantity: 1,
          price: amount,
          totalAmount: amount,
          timestamp: date,
        });

        totalBalance += type === "INCOME" ? amount : -amount;
      }
    }

    // Insert transactions and update balance
    await db.$transaction(async (tx) => {
      await tx.transaction.createMany({ data: transactions });
      await tx.account.update({
        where: { id: ACCOUNT_ID },
        data: { balance: totalBalance },
      });
    });

    return {
      success: true,
      message: `Inserted ${transactions.length} transactions successfully.`,
    };
  } catch (error) {
    console.error("Error seeding transactions:", error);
    return { success: false, error: error.message };
  }
}