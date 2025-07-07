
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomers } from '@/contexts/CustomersContext';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CreateCustomerDialog() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { addCustomer } = useCustomers();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (name.trim() === '') {
      toast({
        title: "Erro",
        description: "O nome do cliente não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }
    addCustomer({ name: name.trim(), phone: phone.trim() });
    toast({
      title: "Sucesso",
      description: `Cliente "${name.trim()}" criado.`,
    });
    setName('');
    setPhone('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
          <DialogDescription>
            Insira os dados do novo cliente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer-name" className="text-right">
              Nome
            </Label>
            <Input
              id="customer-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Nome do Cliente"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer-phone" className="text-right">
              Telefone
            </Label>
            <Input
              id="customer-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3"
              placeholder="(Opcional)"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>Salvar Cliente</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
