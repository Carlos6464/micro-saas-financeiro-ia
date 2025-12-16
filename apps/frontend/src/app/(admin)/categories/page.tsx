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
  Tag
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

// UI Imports
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

// IMPORTAÇÃO LOCAL (mesma pasta)
import { CategoryDialog, CategoryFormValues } from "./category-dialog"

// --- TIPAGEM ---
interface Category {
  id: string
  name: string
  description?: string
  type: "income" | "expense"
}

// Dados de Exemplo
const INITIAL_DATA: Category[] = [
  { id: "1", name: "Vendas", description: "Venda de produtos e serviços", type: "income" },
  { id: "2", name: "Consultoria", description: "Serviços prestados a terceiros", type: "income" },
  { id: "3", name: "Marketing", description: "Anúncios, Ads e Propaganda", type: "expense" },
  { id: "4", name: "Salários", description: "Folha de pagamento mensal", type: "expense" },
  { id: "5", name: "Infraestrutura", description: "Aluguel, luz, água e internet", type: "expense" },
  { id: "6", name: "Rendimentos", description: "Investimentos financeiros", type: "income" },
  { id: "7", name: "Impostos", description: "Tributos governamentais", type: "expense" },
  { id: "8", name: "Fornecedores", description: "Compra de matéria prima", type: "expense" },
]

export default function CategoriesPage() {
  const [data, setData] = useState<Category[]>(INITIAL_DATA)
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  // Modal
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Lógica de Filtro
  const filteredData = data.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || item.type === typeFilter
    return matchesSearch && matchesType
  })

  // Lógica de Paginação
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // --- ACTIONS ---

  const handleOpenCreate = () => {
    setSelectedCategory(null)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsDialogOpen(true)
  }

  const handleSave = (formValues: CategoryFormValues) => {
    if (selectedCategory) {
      // EDITAR
      setData((prev) =>
        prev.map((item) =>
          item.id === selectedCategory.id
            ? { ...formValues, id: selectedCategory.id } as Category
            : item
        )
      )
      toast.success("Categoria atualizada com sucesso!")
    } else {
      // CRIAR
      const newCategory: Category = {
        ...formValues,
        id: Math.random().toString(),
        type: formValues.type as "income" | "expense"
      }
      setData((prev) => [newCategory, ...prev])
      toast.success("Categoria criada com sucesso!")
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      setData((prev) => prev.filter((item) => item.id !== id))
      toast.success("Categoria removida.")
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* HEADER DA PÁGINA */}
      <div className="flex-none px-6 py-5 lg:px-10 border-b border-slate-800/50 bg-background/80 backdrop-blur-md sticky top-0 z-20 flex justify-between items-center">
        <div>
          <h2 className="text-white text-2xl lg:text-3xl font-bold tracking-tight">
            Categorias
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Organize suas receitas e despesas.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-primary text-primary-foreground font-bold shadow-[0_0_20px_rgba(70,236,19,0.3)] hover:shadow-[0_0_30px_rgba(70,236,19,0.5)]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* CONTEÚDO SCROLLÁVEL */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
        <div className="max-w-8xl mx-auto space-y-6">
          
          {/* BARRA DE FERRAMENTAS */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/50 p-4 rounded-xl border border-border/50">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar categoria..."
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

          {/* TABELA */}
          <div className="rounded-2xl border border-border/50 overflow-hidden bg-card/40 backdrop-blur-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent border-slate-800">
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-[150px]">Tipo</TableHead>
                  <TableHead className="w-[100px] text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Nenhuma categoria encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-slate-800 hover:bg-muted/30 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/50 text-primary border border-slate-700">
                             <Tag className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-white">{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {item.description || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs border",
                            item.type === "income"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          )}
                        >
                          {item.type === "income" ? "Receita" : "Despesa"}
                        </Badge>
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

      {/* COMPONENTE MODAL LOCAL */}
      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={selectedCategory}
        onSave={handleSave}
      />
    </div>
  )
}