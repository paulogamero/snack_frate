
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAnnotations } from '@/contexts/AnnotationsContext';
import { useCustomers } from '@/contexts/CustomersContext';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CreateAnnotationDialog() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  
  const { addAnnotation } = useAnnotations();
  const { customers } = useCustomers();
  const { toast } = useToast();

  const handleSubmit = () => {
    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
    if (!selectedCustomer) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um cliente.",
        variant: "destructive",
      });
      return;
    }
    addAnnotation({ id: selectedCustomer.id, name: selectedCustomer.name });
    toast({
      title: "Sucesso",
      description: `Anotação para "${selectedCustomer.name}" criada.`,
    });
    setSelectedCustomerId(undefined);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Anotação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Anotação</DialogTitle>
          <DialogDescription>
            Selecione um cliente para iniciar uma nova anotação.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer-select" className="text-right">
              Cliente
            </Label>
            <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
              <SelectTrigger id="customer-select" className="col-span-3">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>Criar Anotação</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
