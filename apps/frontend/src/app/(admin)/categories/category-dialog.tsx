"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const categorySchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  type: z.enum(["income", "expense"]),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: CategoryFormValues | null
  onSave: (data: CategoryFormValues) => void
}

export function CategoryDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: CategoryDialogProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      type: "expense",
    },
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset(initialData)
      } else {
        form.reset({
          name: "",
          description: "",
          type: "expense",
        })
      }
    }
  }, [open, initialData, form])

  const onSubmit = (values: CategoryFormValues) => {
    onSave(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* CORREÇÃO AQUI: Classes para responsividade */}
      <DialogContent className="w-[90%] sm:max-w-[500px] rounded-xl max-h-[90vh] overflow-y-auto bg-slate-950 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {initialData ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
          <DialogDescription>
            Defina o nome e o tipo da categoria para organizar suas finanças.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            
            {/* Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Marketing, Vendas, Aluguel"
                      {...field}
                      className="bg-slate-900 border-slate-800"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descrição */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Breve descrição..."
                      {...field}
                      className="bg-slate-900 border-slate-800"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-900 border-slate-800">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Receita</SelectItem>
                      <SelectItem value="expense">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-slate-700 hover:bg-slate-800"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary text-black font-bold">
                {initialData ? "Salvar Alterações" : "Criar Categoria"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}