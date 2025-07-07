
"use client";

import type { Annotation, OrderItem, MenuItem, Customer } from '@/types';
import { ConcreteAnnotation, ConcreteOrderItem } from '@/types';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useSales } from './SalesContext';

interface AnnotationsContextType {
  annotations: Annotation[];
  addAnnotation: (customer: Pick<Customer, 'id' | 'name'>) => Annotation;
  addItemToAnnotation: (annotationId: string, menuItem: MenuItem, quantity: number) => void;
  closeAnnotation: (annotationId: string, paymentMethod: string) => void;
  getAnnotationById: (annotationId: string) => Annotation | undefined;
}

const AnnotationsContext = createContext<AnnotationsContextType | undefined>(undefined);

export const AnnotationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const { addTransaction } = useSales();

  const addAnnotation = useCallback((customer: Pick<Customer, 'id' | 'name'>): Annotation => {
    const newAnnotation = new ConcreteAnnotation(`annotation-${Date.now()}`, customer.id, customer.name);
    setAnnotations(prevAnnotations => [...prevAnnotations, newAnnotation]);
    return newAnnotation;
  }, []);

  const addItemToAnnotation = useCallback((annotationId: string, menuItem: MenuItem, quantity: number) => {
    setAnnotations(prevAnnotations =>
      prevAnnotations.map(annotation => {
        if (annotation.id === annotationId && annotation.status === 'open') {
          const existingItemIndex = annotation.items.findIndex(item => item.menuItem.id === menuItem.id);
          let newItems: OrderItem[];
          if (existingItemIndex > -1) {
            newItems = annotation.items.map((item, index) => 
              index === existingItemIndex 
                ? new ConcreteOrderItem(menuItem, item.quantity + quantity) 
                : item
            );
          } else {
            newItems = [...annotation.items, new ConcreteOrderItem(menuItem, quantity)];
          }
          
          const updatedAnnotation = new ConcreteAnnotation(annotation.id, annotation.customerId, annotation.customerName);
          updatedAnnotation.items = newItems;
          updatedAnnotation.status = annotation.status;
          updatedAnnotation.createdAt = annotation.createdAt;
          updatedAnnotation.closedAt = annotation.closedAt;
          return updatedAnnotation;
        }
        return annotation;
      })
    );
  }, []);

  const closeAnnotation = useCallback((annotationId: string, paymentMethod: string) => {
    const annotationToClose = annotations.find(a => a.id === annotationId);
    if (annotationToClose && annotationToClose.status === 'open') {
      addTransaction({
        items: annotationToClose.items,
        totalAmount: annotationToClose.totalAmount,
        annotationId: annotationToClose.id,
        paymentMethod: paymentMethod,
      });
      setAnnotations(prevAnnotations =>
        prevAnnotations.map(annotation => {
          if (annotation.id === annotationId) {
            const updatedAnnotation = new ConcreteAnnotation(annotation.id, annotation.customerId, annotation.customerName);
            updatedAnnotation.items = annotation.items;
            updatedAnnotation.createdAt = annotation.createdAt;
            updatedAnnotation.status = 'paid';
            updatedAnnotation.closedAt = new Date();
            return updatedAnnotation;
          }
          return annotation;
        })
      );
    }
  }, [annotations, addTransaction]);
  
  const getAnnotationById = useCallback((annotationId: string) => {
    return annotations.find(annotation => annotation.id === annotationId);
  }, [annotations]);

  return (
    <AnnotationsContext.Provider value={{ annotations, addAnnotation, addItemToAnnotation, closeAnnotation, getAnnotationById }}>
      {children}
    </AnnotationsContext.Provider>
  );
};

export const useAnnotations = (): AnnotationsContextType => {
  const context = useContext(AnnotationsContext);
  if (!context) {
    throw new Error('useAnnotations must be used within an AnnotationsProvider');
  }
  return context;
};
