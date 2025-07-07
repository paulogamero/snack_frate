
"use client";

import type { MenuItem } from '@/types';
import { MENU_ITEMS } from '@/config/menu';
import React, { createContext, useContext, useState, useCallback } from 'react';

interface MenuContextType {
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  removeMenuItem: (itemId: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);

  const addMenuItem = useCallback((item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `menu-${Date.now()}`
    };
    setMenuItems(prevItems => [...prevItems, newItem]);
  }, []);

  const removeMenuItem = useCallback((itemId: string) => {
    setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  return (
    <MenuContext.Provider value={{ menuItems, addMenuItem, removeMenuItem }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
