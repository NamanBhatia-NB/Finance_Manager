"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { MOCK_TRANSACTIONS, MOCK_ACCOUNTS, MOCK_ACCOUNT_ID } from "@/data/mock-data";

const STORAGE_KEY_TRANSACTIONS = "ai_finance_mock_transactions";
const STORAGE_KEY_INITIALIZED = "ai_finance_mock_initialized_v2";

const MockDataContext = createContext();

export const MockDataProvider = ({ children }) => {
  const [mockTransactions, setMockTransactions] = useState([]);

  useEffect(() => {
    const initialized = localStorage.getItem(STORAGE_KEY_INITIALIZED);
    if (!initialized) {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(MOCK_TRANSACTIONS));
      localStorage.setItem(STORAGE_KEY_INITIALIZED, "true");
      setMockTransactions(MOCK_TRANSACTIONS);
    } else {
      const stored = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      setMockTransactions(stored ? JSON.parse(stored) : MOCK_TRANSACTIONS);
    }
  }, []);

  const persist = (updated) => {
    setMockTransactions(updated);
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(updated));
  };

  const addMockTransaction = (data) => {
    const newTx = { ...data, id: `mock-${Date.now()}`, accountId: MOCK_ACCOUNT_ID };
    persist([newTx, ...mockTransactions]);
  };

  const updateMockTransaction = (id, data) => {
    persist(mockTransactions.map((t) => (t.id === id ? { ...t, ...data } : t)));
  };

  const deleteMockTransactions = (ids) => {
    persist(mockTransactions.filter((t) => !ids.includes(t.id)));
  };

  const mockBalance = mockTransactions.reduce((sum, t) => {
    return t.transactionType === "INCOME" ? sum + t.totalAmount : sum - t.totalAmount;
  }, 0);

  const mockAccounts = [{ ...MOCK_ACCOUNTS[0], balance: mockBalance }];

  return (
    <MockDataContext.Provider value={{ mockTransactions, mockAccounts, mockBalance, addMockTransaction, updateMockTransaction, deleteMockTransactions }}>
      {children}
    </MockDataContext.Provider>
  );
};

export const useMockData = () => useContext(MockDataContext);
