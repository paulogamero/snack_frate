
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CreateAnnotationDialog } from '@/components/annotations/CreateAnnotationDialog';
import { AddItemToAnnotationDialog } from '@/components/annotations/AddItemToAnnotationDialog';
import { useAnnotations } from '@/contexts/AnnotationsContext';
import type { Annotation } from '@/types';
import { PlusIcon, DollarSignIcon } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

export default function AnnotationsManagementPage() {
  const { annotations, closeAnnotation } = useAnnotations();
  const [selectedAnnotationForAddItem, setSelectedAnnotationForAddItem] = useState<Annotation | null>(null);
  const { toast } = useToast();

  const openAnnotations = annotations.filter(annotation => annotation.status === 'open');
  const closedAnnotations = annotations.filter(annotation => annotation.status !== 'open');

  const handleCloseAnnotation = (annotationId: string) => {
    closeAnnotation(annotationId, "Dinheiro"); // Assuming default payment for simplicity
    toast({
      title: "Anotação Fechada",
      description: `Anotação #${annotationId.substring(0,6)} foi fechada e o pagamento registrado.`,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-semibold">Anotações de Pedidos</h1>
          <p className="text-muted-foreground">Crie, gerencie e feche as anotações dos clientes.</p>
        </div>
        <CreateAnnotationDialog />
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-3">Anotações Abertas ({openAnnotations.length})</h2>
        {openAnnotations.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma anotação aberta no momento.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {openAnnotations.map((annotation) => (
              <Card key={annotation.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {annotation.customerName}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                        annotation.status === 'open' ? 'bg-green-100 text-green-700' : 
                        annotation.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                      {annotation.status === 'open' ? 'Aberta' : annotation.status === 'paid' ? 'Paga' : 'Fechada'}
                    </span>
                  </CardTitle>
                  <CardDescription>Criada em: {new Date(annotation.createdAt).toLocaleDateString('pt-BR')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ScrollArea className="h-32">
                    {annotation.items.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhum item adicionado.</p>
                    ) : (
                      <ul className="space-y-1 text-sm">
                        {annotation.items.map((item, index) => (
                          <li key={index} className="flex justify-between">
                            <span>{item.quantity}x {item.menuItem.name}</span>
                            <span>{item.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </ScrollArea>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{annotation.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedAnnotationForAddItem(annotation)}>
                    <PlusIcon className="mr-2 h-4 w-4" /> Adicionar Item
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={annotation.items.length === 0}>
                        <DollarSignIcon className="mr-2 h-4 w-4" /> Fechar Conta
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Fechamento da Anotação?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Anotação para: {annotation.customerName} <br />
                          Total: {annotation.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} <br />
                          Esta ação irá registrar a venda e marcar a anotação como paga. Deseja continuar?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleCloseAnnotation(annotation.id)}>Confirmar Pagamento</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
      
      {selectedAnnotationForAddItem && (
        <AddItemToAnnotationDialog
          annotation={selectedAnnotationForAddItem}
          isOpen={!!selectedAnnotationForAddItem}
          onOpenChange={(open) => {
            if (!open) setSelectedAnnotationForAddItem(null);
          }}
        />
      )}

      {closedAnnotations.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Anotações Fechadas/Pagas ({closedAnnotations.length})</h2>
          <ScrollArea className="h-64">
            <div className="space-y-3">
            {closedAnnotations.map((annotation) => (
              <Card key={annotation.id} className="opacity-70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    {annotation.customerName}
                     <span className={`text-xs px-2 py-1 rounded-full ${
                        annotation.status === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                      {annotation.status === 'paid' ? 'Paga' : 'Fechada'}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-xs">Fechada em: {new Date(annotation.closedAt || annotation.createdAt).toLocaleDateString('pt-BR')} - Total: {annotation.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</CardDescription>
                </CardHeader>
              </Card>
            ))}
            </div>
          </ScrollArea>
        </section>
      )}
    </div>
  );
}
