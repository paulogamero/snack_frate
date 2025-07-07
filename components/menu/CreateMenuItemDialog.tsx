
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
import { useMenu } from '@/contexts/MenuContext';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CreateMenuItemDialog() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { addMenuItem } = useMenu();
  const { toast } = useToast();

  const handleSubmit = () => {
    const priceNumber = parseFloat(price);
    if (name.trim() === '' || category.trim() === '' || isNaN(priceNumber) || priceNumber <= 0) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, preencha todos os campos com valores válidos.",
        variant: "destructive",
      });
      return;
    }
    addMenuItem({ name: name.trim(), price: priceNumber, category: category.trim() });
    toast({
      title: "Sucesso",
      description: `Item "${name.trim()}" criado com sucesso.`,
    });
    setName('');
    setPrice('');
    setCategory('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Item ao Cardápio</DialogTitle>
          <DialogDescription>
            Insira os detalhes do novo item.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-name" className="text-right">
              Nome
            </Label>
            <Input id="item-name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="Ex: Coxinha de Frango"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-category" className="text-right">
              Categoria
            </Label>
            <Input id="item-category" value={category} onChange={(e) => setCategory(e.target.value)} className="col-span-3" placeholder="Ex: Salgados"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-price" className="text-right">
              Preço
            </Label>
            <Input id="item-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="col-span-3" placeholder="Ex: 5.50"/>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>Salvar Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
