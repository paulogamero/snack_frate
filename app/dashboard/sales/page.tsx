
"use client";

import { useSales } from '@/contexts/SalesContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export default function SalesLogPage() {
  const { transactions } = useSales();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-headline font-semibold">Registo de Vendas</h1>
        <p className="text-muted-foreground">Visualize todas as transações realizadas.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>
            Total de {transactions.length} transações registradas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Nenhuma transação registrada ainda.</p>
          ) : (
            <ScrollArea className="h-[600px] w-full">
              <Table>
                <TableCaption>Uma lista das suas vendas recentes.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">ID da Transação</TableHead>
                    <TableHead>Data e Hora</TableHead>
                    <TableHead>Itens</TableHead>
                    <TableHead>Método de Pag.</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead>Anotação (ID)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-medium">{txn.id.substring(0, 8)}...</TableCell>
                      <TableCell>{new Date(txn.timestamp).toLocaleString('pt-BR')}</TableCell>
                      <TableCell>{txn.items.length}</TableCell>
                      <TableCell>
                        <Badge variant={txn.paymentMethod === 'Dinheiro' ? 'secondary' : 'outline'}>
                          {txn.paymentMethod || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{txn.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                      <TableCell>{txn.annotationId ? `#${txn.annotationId.substring(0,6)}` : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
