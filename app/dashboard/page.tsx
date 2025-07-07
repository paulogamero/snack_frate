"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSales } from "@/contexts/SalesContext";
import { DollarSign, ShoppingBag, BarChartBig } from "lucide-react";

export default function DashboardOverviewPage() {
  const { dailyRevenue, totalOrdersToday, averageOrderValueToday, transactions } = useSales();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-headline font-semibold">Visão Geral</h1>
        <p className="text-muted-foreground">Acompanhe as métricas chave do seu Snack Bar.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Receita Diária"
          value={dailyRevenue}
          icon={DollarSign}
          description="Total de vendas realizadas hoje."
        />
        <StatCard
          title="Total de Pedidos Hoje"
          value={totalOrdersToday}
          icon={ShoppingBag}
          description="Número de pedidos processados hoje."
        />
        <StatCard
          title="Valor Médio por Pedido"
          value={averageOrderValueToday}
          icon={BarChartBig}
          description="Valor médio de cada pedido de hoje."
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Últimas transações registradas.</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma transação recente.</p>
          ) : (
            <ul className="space-y-2">
              {transactions.slice(0, 5).map((txn) => (
                <li key={txn.id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">Pedido #{txn.id.substring(0,8)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(txn.timestamp).toLocaleTimeString('pt-BR')} - {txn.items.length} item(s)
                    </p>
                  </div>
                  <p className="font-semibold">{txn.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
