
"use client";

import { MenuProvider } from '@/contexts/MenuContext';
import { SalesProvider } from '@/contexts/SalesContext';
import { AnnotationsProvider } from '@/contexts/AnnotationsContext';
import { CustomersProvider } from '@/contexts/CustomersContext';
import React from 'react';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <CustomersProvider>
      <MenuProvider>
        <SalesProvider>
          <AnnotationsProvider>
            {children}
          </AnnotationsProvider>
        </SalesProvider>
      </MenuProvider>
    </CustomersProvider>
  );
};
