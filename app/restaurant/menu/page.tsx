'use client'
import { useState, useEffect } from 'react'
import { DynamicIcon } from "@/components/ui/icon";
import { Plus, Edit2, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatCurrency } from '@/lib/utils'
import { Card, Button, Badge } from '@/components/ui'
import { AppHeader } from '@/components/layout/navigation'
import type { MenuCategory, MenuItem } from '@/types'

export default function RestaurantMenuPage() {
  const [expandedCats, setExpandedCats] = useState<string[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [allItems, setAllItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMyMenu = async () => {
    try {
      const res = await fetch('/api/restaurant/my')
      if (res.ok) {
        const data = await res.json()
        setCategories(data.menuCategories || [])
        setAllItems(data.menuItems || [])
        if (data.menuCategories?.length > 0 && expandedCats.length === 0) {
          setExpandedCats([data.menuCategories[0].id])
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyMenu()
  }, [])

  const toggleCat = (id: string) =>
    setExpandedCats(p => p.includes(id) ? p.filter(c => c !== id) : [...p, id])

  const handleAddCategory = async () => {
    const name = window.prompt("Nome da nova categoria:")
    if (!name) return
    const toastId = toast.loading('Criando...')
    try {
      const res = await fetch('/api/restaurant/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })
      if (res.ok) {
        toast.success("Categoria criada!", { id: toastId })
        fetchMyMenu()
      } else throw new Error()
    } catch (err) {
      toast.error("Erro ao criar.", { id: toastId })
    }
  }

  const handleAddItem = async (categoryId: string, catName: string) => {
    const name = window.prompt(`Novo item em '${catName}':\nNome do Item:`)
    if (!name) return
    const priceStr = window.prompt("Preço do Item (Ex: 25.50):")
    if (!priceStr || isNaN(Number(priceStr))) return toast.error("Preço inválido")

    const toastId = toast.loading('Adicionando...')
    try {
      const res = await fetch('/api/restaurant/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, name, price: Number(priceStr), description: "", icon: "Pizza" })
      })
      if (res.ok) {
        toast.success("Item adicionado!", { id: toastId })
        fetchMyMenu()
      } else throw new Error()
    } catch (err) {
      toast.error("Erro ao criar item.", { id: toastId })
    }
  }

  const handleEditPrice = async (item: MenuItem) => {
    const priceStr = window.prompt(`Alterar preço de ${item.name}:\nPreço atual: ${item.price}`, String(item.price))
    if (!priceStr || isNaN(Number(priceStr))) return

    const toastId = toast.loading('Salvando...')
    try {
      const res = await fetch(`/api/restaurant/items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: Number(priceStr) })
      })
      if (res.ok) {
        toast.success("Preço atualizado!", { id: toastId })
        fetchMyMenu()
      } else throw new Error()
    } catch (err) {
      toast.error("Erro ao editar.", { id: toastId })
    }
  }

  const toggleAvailability = async (item: MenuItem) => {
    const toastId = toast.loading('Atualizando...')
    try {
      const res = await fetch(`/api/restaurant/items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !item.isAvailable })
      })
      if (res.ok) {
        toast.success(item.isAvailable ? "Item ocultado" : "Item ativado", { id: toastId })
        fetchMyMenu()
      } else throw new Error()
    } catch (err) {
      toast.error("Erro.", { id: toastId })
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-brand-cream pb-24">
      <AppHeader
        title={<span className="font-display text-xl font-black text-brand-brown">Cardápio</span>}
        right={
          <Button size="sm" onClick={handleAddCategory}>
            <Plus size={14} /> Nova Categoria
          </Button>
        }
      />

      <div className="px-4 py-5 space-y-3">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="p-3 text-center">
            <div className="font-display text-2xl font-black text-brand-red">{allItems.length}</div>
            <div className="text-xs text-brand-gray">Itens</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="font-display text-2xl font-black text-brand-brown">{categories.length}</div>
            <div className="text-xs text-brand-gray">Categorias</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="font-display text-2xl font-black text-green-600">
              {allItems.filter(i => i.isAvailable).length}
            </div>
            <div className="text-xs text-brand-gray">Disponíveis</div>
          </Card>
        </div>

        {/* Categories */}
        {categories.length === 0 ? (
          <div className="text-center py-12 text-brand-gray">
            <div className="text-4xl mb-3">🍽️</div>
            <p>Seu cardápio está vazio.</p>
          </div>
        ) : categories.map(cat => {
          const items = allItems.filter(i => i.categoryId === cat.id)
          const isExpanded = expandedCats.includes(cat.id)
          return (
            <Card key={cat.id} className="overflow-hidden">
              <button
                onClick={() => toggleCat(cat.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-brand-cream-dark/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-brand-brown">{cat.name}</span>
                  <span className="text-xs bg-brand-cream-dark text-brand-gray px-2 py-0.5 rounded-full">
                    {items.length} itens
                  </span>
                </div>
                {isExpanded ? <ChevronUp size={16} className="text-brand-gray" /> : <ChevronDown size={16} className="text-brand-gray" />}
              </button>

              {isExpanded && (
                <div className="border-t border-brand-cream-dark divide-y divide-brand-cream-dark">
                  {items.map(item => (
                    <div key={item.id} className={`flex items-center gap-3 px-4 py-3 ${!item.isAvailable ? 'opacity-50' : ''}`}>
                      <div className="w-12 h-12 bg-brand-cream-dark rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        <DynamicIcon name={item.icon} size="md" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-medium text-sm text-brand-brown truncate ${!item.isAvailable ? 'line-through' : ''}`}>{item.name}</span>
                          {item.isHighlighted && <Badge variant="brand" className="text-[9px]">Destaque</Badge>}
                        </div>
                        <div className="text-xs text-brand-gray truncate mt-0.5">{item.description || "Sem descrição"}</div>
                        <div className="font-display font-bold text-brand-red text-sm mt-1">{formatCurrency(item.price)}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleAvailability(item)}
                          className="w-8 h-8 rounded-lg bg-brand-cream-dark flex items-center justify-center hover:bg-brand-cream transition-colors"
                          title={item.isAvailable ? 'Ocultar Item' : 'Mostrar Item'}
                        >
                          {item.isAvailable ? <Eye size={13} className="text-green-600" /> : <EyeOff size={13} className="text-brand-gray" />}
                        </button>
                        <button
                          onClick={() => handleEditPrice(item)}
                          className="w-8 h-8 rounded-lg bg-brand-cream-dark flex items-center justify-center hover:bg-brand-cream transition-colors"
                          title="Atualizar Preço"
                        >
                          <Edit2 size={13} className="text-brand-gray" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="px-4 py-3 bg-brand-cream/10">
                    <button
                      onClick={() => handleAddItem(cat.id, cat.name)}
                      className="w-full border-2 border-dashed border-brand-cream-dark rounded-xl py-3 text-sm font-medium text-brand-gray hover:border-brand-red hover:text-brand-red transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={14} /> Adicionar item em {cat.name}
                    </button>
                  </div>
                </div>
              )}
            </Card>
          )
        })}

        <button
          onClick={handleAddCategory}
          className="w-full border-2 border-dashed border-brand-red/30 rounded-2xl py-4 text-sm font-bold text-brand-red hover:bg-brand-red/5 transition-colors flex items-center justify-center gap-2 mt-4"
        >
          <Plus size={16} /> Criar Nova Categoria
        </button>
      </div>
    </div>
  )
}
