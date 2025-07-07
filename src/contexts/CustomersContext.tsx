
"use client";

import type { Customer } from '@/types';
import React, { createContext, useContext, useState, useCallback } from 'react';

interface CustomersContextType {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  removeCustomer: (customerId: string) => void;
}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

// Mock initial data, you can replace this with a database call
const initialCustomers: Customer[] = [
    { id: 'cust-1', name: 'Cliente Balcão', phone: 'N/A' },
    { id: 'cust-2', name: 'Ana Silva', phone: '(11) 98765-4321' },
];


export const CustomersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

  const addCustomer = useCallback((customerData: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`
    };
    setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
  }, []);

  const removeCustomer = useCallback((customerId: string) => {
    setCustomers(prevCustomers => prevCustomers.filter(customer => customer.id !== customerId));
  }, []);

  return (
    <CustomersContext.Provider value={{ customers, addCustomer, removeCustomer }}>
      {children}
    </CustomersContext.Provider>
  );
};

export const useCustomers = (): CustomersContextType => {
  const context = useContext(CustomersContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomersProvider');
  }
  return context;
};
