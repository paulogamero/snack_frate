
"use client";

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMenu } from '@/contexts/MenuContext';
import { Trash2 } from 'lucide-react';
import { CreateMenuItemDialog } from '@/components/menu/CreateMenuItemDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MenuPage() {
  const { menuItems, removeMenuItem } = useMenu();

  const groupedMenuItems = useMemo(() => {
    return menuItems.reduce((acc, item) => {
      (acc[item.category] = acc[item.category] || []).push(item);
      return acc;
    }, {} as Record<string, typeof menuItems>);
  }, [menuItems]);

  return (
    <div className="flex flex-col h-full gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-semibold">Gestão de Cardápio</h1>
          <p className="text-muted-foreground">Adicione, visualize e remova itens do cardápio.</p>
        </div>
        <CreateMenuItemDialog />
      </header>

      <Card className="flex-grow">
        <CardHeader>
          <CardTitle>Itens do Cardápio</CardTitle>
          <CardDescription>
             Atualmente há {menuItems.length} item(ns) no cardápio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedMenuItems).map(([category, items]) => (
                <React.Fragment key={category}>
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={4} className="font-semibold text-muted-foreground">
                      {category}
                    </TableCell>
                  </TableRow>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso removerá permanentemente o item do cardápio.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => removeMenuItem(item.id)}>
                                Continuar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
              {menuItems.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Nenhum item cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
