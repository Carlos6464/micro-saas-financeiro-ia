"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Filter,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

// Componentes UI
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// --- CORREÇÃO AQUI ---
// Como o arquivo está na mesma pasta, usamos o ponto (.)
import { TransactionDialog, TransactionFormValues } from "./transaction-dialog"
import { Header } from "@/components/ui/header"

// --- TIPAGEM ---
interface Transaction {
  id: string
  description: string
  amount: string
  category: string
  type: "income" | "expense"
  status: "paid" | "pending"
  date: string
}

// Dados Mockados para teste
const INITIAL_DATA: Transaction[] = Array.from({ length: 25 }).map((_, i) => ({
  id: i.toString(),
  description: `Transação Exemplo ${i + 1}`,
  amount: (Math.random() * 1000).toFixed(2),
  category: i % 2 === 0 ? "Vendas" : "Fornecedores",
  type: i % 2 === 0 ? "income" : "expense",
  status: i % 3 === 0 ? "pending" : "paid",
  date: new Date().toISOString().split("T")[0],
}))

export default function TransactionsPage() {
  const [data, setData] = useState<Transaction[]>(INITIAL_DATA)
  
  // Estados de Filtro
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  // Controle do Modal
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  // Lógica de Filtros
  const filteredData = data.filter((item) => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || item.type === typeFilter
    return matchesSearch && matchesType
  })

  // Lógica de Paginação
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Handlers
  const handleOpenCreate = () => {
    setSelectedTransaction(null)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsDialogOpen(true)
  }

  const handleSave = (formValues: TransactionFormValues) => {
    if (selectedTransaction) {
      // EDITAR: Atualiza o item existente
      setData((prev) =>
        prev.map((item) =>
          item.id === selectedTransaction.id
            ? { ...formValues, id: selectedTransaction.id } as Transaction
            : item
        )
      )
      toast.success("Transação atualizada com sucesso!")
    } else {
      // CRIAR: Adiciona novo item
      const newTransaction: Transaction = {
        ...formValues,
        id: Math.random().toString(),
        type: formValues.type as "income" | "expense",
        status: formValues.status as "paid" | "pending"
      }
      setData((prev) => [newTransaction, ...prev])
      toast.success("Transação criada com sucesso!")
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta transação?")) {
      setData((prev) => prev.filter((item) => item.id !== id))
      toast.success("Transação removida.")
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* HEADER DA PÁGINA */}
     <Header 
        title="Transações"
        subtitle="Gerencie suas entradas e saídas."
        onAddTransaction={handleOpenCreate}
        actionLabel="Nova Transação"
      />

      {/* ÁREA DE CONTEÚDO */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
        <div className="max-w-8xl mx-auto space-y-6">
          
          {/* BARRA DE FERRAMENTAS */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/50 p-4 rounded-xl border border-border/50">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 bg-background border-input"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select
                value={typeFilter}
                onValueChange={(val) => {
                  setTypeFilter(val)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="income">Receitas</SelectItem>
                  <SelectItem value="expense">Despesas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* TABELA DE DADOS */}
          <div className="rounded-2xl border border-border/50 overflow-hidden bg-card/40 backdrop-blur-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent border-slate-800">
                  <TableHead className="w-[150px]">Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-[100px] text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Nenhuma transação encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-slate-800 hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-300">
                        {format(new Date(item.date), "dd 'de' MMM, yyyy", {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-white">
                          {item.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-xs bg-slate-900/50 border-slate-700 text-slate-400"
                        >
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={cn(
                            "font-bold",
                            item.type === "income"
                              ? "text-green-400"
                              : "text-red-400"
                          )}
                        >
                          {item.type === "income" ? "+" : "-"}{" "}
                          R${" "}
                          {Number(item.amount).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:text-primary hover:bg-primary/10"
                            onClick={() => handleOpenEdit(item)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:text-red-500 hover:bg-red-500/10"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* PAGINAÇÃO */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} até{" "}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} de{" "}
                {filteredData.length} resultados
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Próximo <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* COMPONENTE DO MODAL */}
      <TransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={selectedTransaction}
        onSave={handleSave}
      />
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const isPaid = status === "paid"
  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        isPaid
          ? "bg-green-500/10 text-green-400 border-green-500/20"
          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      )}
    >
      {isPaid ? "Concluído" : "Pendente"}
    </div>
  )
}