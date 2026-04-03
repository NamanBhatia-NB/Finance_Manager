const now = new Date();

// Safe date helper: clamps day to today's date if monthsAgo === 0
const m = (monthsAgo, day) => {
  const safeDay = monthsAgo === 0 ? Math.min(day, now.getDate()) : day;
  return new Date(now.getFullYear(), now.getMonth() - monthsAgo, safeDay).toISOString();
};

export const MOCK_ACCOUNT_ID = "mock-default-account";

export const MOCK_ACCOUNTS = [
  {
    id: MOCK_ACCOUNT_ID,
    name: "Demo Account",
    type: "BANK",
    balance: 0,
    isDefault: true,
    _count: { transactions: 48 },
  },
];

export const MOCK_TRANSACTIONS = [
  // 11 months ago
  { id: "t1",  assetName: "Monthly Salary",      category: "salary",        transactionType: "INCOME",  totalAmount: 72000, timestamp: m(11, 1),  description: "Salary credit",              accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t2",  assetName: "Rent Payment",         category: "housing",       transactionType: "EXPENSE", totalAmount: 18000, timestamp: m(11, 3),  description: "Monthly house rent",         accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t3",  assetName: "Grocery Shopping",     category: "groceries",     transactionType: "EXPENSE", totalAmount: 3100,  timestamp: m(11, 7),  description: "Big Basket order",           accountId: MOCK_ACCOUNT_ID, isRecurring: false, recurringInterval: null },
  { id: "t4",  assetName: "Electricity Bill",     category: "utilities",     transactionType: "EXPENSE", totalAmount: 1200,  timestamp: m(11, 10), description: "Monthly electricity bill",   accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },

  // 10 months ago
  { id: "t5",  assetName: "Monthly Salary",       category: "salary",        transactionType: "INCOME",  totalAmount: 72000, timestamp: m(10, 1),  description: "Salary credit",              accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t6",  assetName: "Rent Payment",         category: "housing",       transactionType: "EXPENSE", totalAmount: 18000, timestamp: m(10, 3),  description: "Monthly house rent",         accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t7",  assetName: "Freelance Project",    category: "freelance",     transactionType: "INCOME",  totalAmount: 18000, timestamp: m(10, 12), description: "Web development project",    accountId: MOCK_ACCOUNT_ID, isRecurring: false, recurringInterval: null },
  { id: "t8",  assetName: "Travel Expenses",      category: "travel",        transactionType: "EXPENSE", totalAmount: 8500,  timestamp: m(10, 18), description: "Weekend trip to Goa",        accountId: MOCK_ACCOUNT_ID, isRecurring: false, recurringInterval: null },

  // 9 months ago
  { id: "t9",  assetName: "Monthly Salary",       category: "salary",        transactionType: "INCOME",  totalAmount: 72000, timestamp: m(9, 1),   description: "Salary credit",              accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t10", assetName: "Rent Payment",         category: "housing",       transactionType: "EXPENSE", totalAmount: 18000, timestamp: m(9, 3),   description: "Monthly house rent",         accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t11", assetName: "Netflix Subscription", category: "entertainment", transactionType: "EXPENSE", totalAmount: 649,   timestamp: m(9, 5),   description: "Monthly streaming plan",     accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t12", assetName: "Medical Checkup",      category: "healthcare",    transactionType: "EXPENSE", totalAmount: 2200,  timestamp: m(9, 14),  description: "Quarterly health checkup",   accountId: MOCK_ACCOUNT_ID, isRecurring: false, recurringInterval: null },

  // 8 months ago
  { id: "t13", assetName: "Monthly Salary",       category: "salary",        transactionType: "INCOME",  totalAmount: 75000, timestamp: m(8, 1),   description: "Salary credit (increment)",  accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t14", assetName: "Rent Payment",         category: "housing",       transactionType: "EXPENSE", totalAmount: 18000, timestamp: m(8, 3),   description: "Monthly house rent",         accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t15", assetName: "Online Shopping",      category: "shopping",      transactionType: "EXPENSE", totalAmount: 6200,  timestamp: m(8, 9),   description: "Flipkart Big Billion sale",  accountId: MOCK_ACCOUNT_ID, isRecurring: false, recurringInterval: null },
  { id: "t16", assetName: "Electricity Bill",     category: "utilities",     transactionType: "EXPENSE", totalAmount: 1550,  timestamp: m(8, 11),  description: "Monthly electricity bill",   accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },

  // 7 months ago
  { id: "t17", assetName: "Monthly Salary",       category: "salary",        transactionType: "INCOME",  totalAmount: 75000, timestamp: m(7, 1),   description: "Salary credit",              accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t18", assetName: "Rent Payment",         category: "housing",       transactionType: "EXPENSE", totalAmount: 18000, timestamp: m(7, 3),   description: "Monthly house rent",         accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t19", assetName: "Freelance Project",    category: "freelance",     transactionType: "INCOME",  totalAmount: 25000, timestamp: m(7, 15),  description: "Mobile app UI project",      accountId: MOCK_ACCOUNT_ID, isRecurring: false, recurringInterval: null },
  { id: "t20", assetName: "Restaurant Dining",    category: "food",          transactionType: "EXPENSE", totalAmount: 3400,  timestamp: m(7, 20),  description: "Birthday dinner",            accountId: MOCK_ACCOUNT_ID, isRecurring: false, recurringInterval: null },

  // 6 months ago
  { id: "t21", assetName: "Monthly Salary",       category: "salary",        transactionType: "INCOME",  totalAmount: 75000, timestamp: m(6, 1),   description: "Salary credit",              accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t22", assetName: "Rent Payment",         category: "housing",       transactionType: "EXPENSE", totalAmount: 18000, timestamp: m(6, 3),   description: "Monthly house rent",         accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t23", assetName: "Mutual Fund SIP",      category: "investments",   transactionType: "EXPENSE", totalAmount: 10000, timestamp: m(6, 8),   description: "Monthly SIP",                accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t24", assetName: "Insurance Premium",    category: "insurance",     transactionType: "EXPENSE", totalAmount: 12000, timestamp: m(6, 22),  description: "Annual health insurance",    accountId: MOCK_ACCOUNT_ID, isRecurring: false, recurringInterval: null },

  // 5 months ago
  { id: "t25", assetName: "Monthly Salary",       category: "salary",        transactionType: "INCOME",  totalAmount: 75000, timestamp: m(5, 1),   description: "Salary credit",              accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t26", assetName: "Rent Payment",         category: "housing",       transactionType: "EXPENSE", totalAmount: 18000, timestamp: m(5, 3),   description: "Monthly house rent",         accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t27", assetName: "Grocery Shopping",     category: "groceries",     transactionType: "EXPENSE", totalAmount: 3800,  timestamp: m(5, 6),   description: "Monthly groceries",          accountId: MOCK_ACCOUNT_ID, isRecurring: false, recurringInterval: null },
  { id: "t28", assetName: "Electricity Bill",     category: "utilities",     transactionType: "EXPENSE", totalAmount: 1420,  timestamp: m(5, 11),  description: "Monthly electricity bill",   accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },

  // 4 months ago
  { id: "t29", assetName: "Monthly Salary",       category: "salary",        transactionType: "INCOME",  totalAmount: 75000, timestamp: m(4, 1),   description: "Salary credit",              accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t30", assetName: "Rent Payment",         category: "housing",       transactionType: "EXPENSE", totalAmount: 18000, timestamp: m(4, 3),   description: "Monthly house rent",         accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t31", assetName: "Mutual Fund SIP",      category: "investments",   transactionType: "EXPENSE", totalAmount: 10000, timestamp: m(4, 8),   description: "Monthly SIP",                accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t32", assetName: "Education Course",     category: "education",     transactionType: "EXPENSE", totalAmount: 4999,  timestamp: m(4, 17),  description: "Udemy course bundle",        accountId: MOCK_ACCOUNT_ID, isRecurring: false, recurringInterval: null },

  // 3 months ago
  { id: "t33", assetName: "Monthly Salary",       category: "salary",        transactionType: "INCOME",  totalAmount: 75000, timestamp: m(3, 1),   description: "Salary credit",              accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t34", assetName: "Rent Payment",         category: "housing",       transactionType: "EXPENSE", totalAmount: 18000, timestamp: m(3, 3),   description: "Monthly house rent",         accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t35", assetName: "Freelance Project",    category: "freelance",     transactionType: "INCOME",  totalAmount: 20000, timestamp: m(3, 10),  description: "Dashboard design project",   accountId: MOCK_ACCOUNT_ID, isRecurring: false, recurringInterval: null },
  { id: "t36", assetName: "Restaurant Dining",    category: "food",          transactionType: "EXPENSE", totalAmount: 2600,  timestamp: m(3, 19),  description: "Team lunch outing",          accountId: MOCK_ACCOUNT_ID, isRecurring: false, recurringInterval: null },

  // 2 months ago
  { id: "t37", assetName: "Monthly Salary",       category: "salary",        transactionType: "INCOME",  totalAmount: 75000, timestamp: m(2, 1),   description: "Salary credit",              accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t38", assetName: "Rent Payment",         category: "housing",       transactionType: "EXPENSE", totalAmount: 18000, timestamp: m(2, 3),   description: "Monthly house rent",         accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t39", assetName: "Grocery Shopping",     category: "groceries",     transactionType: "EXPENSE", totalAmount: 3200,  timestamp: m(2, 7),   description: "Big Basket order",           accountId: MOCK_ACCOUNT_ID, isRecurring: false, recurringInterval: null },
  { id: "t40", assetName: "Netflix Subscription", category: "entertainment", transactionType: "EXPENSE", totalAmount: 649,   timestamp: m(2, 15),  description: "Monthly streaming plan",     accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },

  // 1 month ago
  { id: "t41", assetName: "Monthly Salary",       category: "salary",        transactionType: "INCOME",  totalAmount: 75000, timestamp: m(1, 1),   description: "Salary credit",              accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t42", assetName: "Rent Payment",         category: "housing",       transactionType: "EXPENSE", totalAmount: 18000, timestamp: m(1, 3),   description: "Monthly house rent",         accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t43", assetName: "Mutual Fund SIP",      category: "investments",   transactionType: "EXPENSE", totalAmount: 10000, timestamp: m(1, 8),   description: "Monthly SIP",                accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t44", assetName: "Medical Checkup",      category: "healthcare",    transactionType: "EXPENSE", totalAmount: 1800,  timestamp: m(1, 22),  description: "Annual health checkup",      accountId: MOCK_ACCOUNT_ID, isRecurring: false, recurringInterval: null },

  // Current month (days capped at today via m() helper)
  { id: "t45", assetName: "Monthly Salary",       category: "salary",        transactionType: "INCOME",  totalAmount: 75000, timestamp: m(0, 1),   description: "Salary credit",              accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t46", assetName: "Rent Payment",         category: "housing",       transactionType: "EXPENSE", totalAmount: 18000, timestamp: m(0, 1),   description: "Monthly house rent",         accountId: MOCK_ACCOUNT_ID, isRecurring: true,  recurringInterval: "MONTHLY" },
  { id: "t47", assetName: "Grocery Shopping",     category: "groceries",     transactionType: "EXPENSE", totalAmount: 4100,  timestamp: m(0, 2),   description: "Zepto + Blinkit orders",     accountId: MOCK_ACCOUNT_ID, isRecurring: false, recurringInterval: null },
  { id: "t48", assetName: "Online Shopping",      category: "shopping",      transactionType: "EXPENSE", totalAmount: 5600,  timestamp: m(0, 2),   description: "Amazon purchase",            accountId: MOCK_ACCOUNT_ID, isRecurring: false, recurringInterval: null },
];

export const MOCK_BUDGET = {
  budget: { totalValue: 50000 },
  currentExpenses: MOCK_TRANSACTIONS
    .filter((t) => {
      const d = new Date(t.timestamp);
      return t.transactionType === "EXPENSE" &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, t) => sum + t.totalAmount, 0),
};
