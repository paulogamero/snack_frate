"use client";

import type { Transaction, OrderItem } from '@/types';
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface SalesContextType {
  transactions: Transaction[];
  addTransaction: (data: Omit<Transaction, 'id' | 'timestamp'>) => void;
  dailyRevenue: number;
  totalOrdersToday: number;
  averageOrderValueToday: number;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = useCallback((data: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...data,
      id: `txn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date(),
    };
    setTransactions(prevTxns => [newTransaction, ...prevTxns]);
  }, []);

  const todayStart = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const todaysTransactions = useMemo(() => {
    return transactions.filter(txn => txn.timestamp >= todayStart);
  }, [transactions, todayStart]);

  const dailyRevenue = useMemo(() => {
    return todaysTransactions.reduce((sum, txn) => sum + txn.totalAmount, 0);
  }, [todaysTransactions]);

  const totalOrdersToday = useMemo(() => {
    return todaysTransactions.length;
  }, [todaysTransactions]);

  const averageOrderValueToday = useMemo(() => {
    return totalOrdersToday > 0 ? dailyRevenue / totalOrdersToday : 0;
  }, [dailyRevenue, totalOrdersToday]);


  return (
    <SalesContext.Provider value={{ transactions, addTransaction, dailyRevenue, totalOrdersToday, averageOrderValueToday }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = (): SalesContextType => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};
