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

const transactionSchema = z.object({
  description: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "O valor deve ser um número positivo",
  }),
  category: z.string().min(1, "Selecione uma categoria"),
  type: z.enum(["income", "expense"]),
  status: z.enum(["paid", "pending"]),
  date: z.string(),
})

export type TransactionFormValues = z.infer<typeof transactionSchema>

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: TransactionFormValues | null
  onSave: (data: TransactionFormValues) => void
}

export function TransactionDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: TransactionDialogProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: "",
      category: "",
      type: "income",
      status: "paid",
      date: new Date().toISOString().split("T")[0],
    },
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          ...initialData,
          amount: initialData.amount.toString(),
        })
      } else {
        form.reset({
          description: "",
          amount: "",
          category: "",
          type: "income",
          status: "paid",
          date: new Date().toISOString().split("T")[0],
        })
      }
    }
  }, [open, initialData, form])

  const onSubmit = (values: TransactionFormValues) => {
    onSave(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* CORREÇÃO AQUI: Classes para responsividade (w-[90%], rounded-xl, max-h) */}
      <DialogContent className="w-[90%] sm:max-w-[500px] rounded-xl max-h-[90vh] overflow-y-auto bg-slate-950 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {initialData ? "Editar Transação" : "Nova Transação"}
          </DialogTitle>
          <DialogDescription>
            Preencha os detalhes da transação abaixo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Pagamento de Salário"
                      {...field}
                      className="bg-slate-900 border-slate-800"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        {...field}
                        className="bg-slate-900 border-slate-800"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="bg-slate-900 border-slate-800 block"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-900 border-slate-800">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="paid">Pago / Recebido</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-900 border-slate-800">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Vendas">Vendas</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                      <SelectItem value="Salários">Salários</SelectItem>
                      <SelectItem value="Fornecedores">Fornecedores</SelectItem>
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
                {initialData ? "Salvar Alterações" : "Criar Transação"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}