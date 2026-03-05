'use client'
import { useState } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { MOCK_RESTAURANTS, MOCK_MENU_ITEMS, MOCK_MENU_CATEGORIES } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'
import { Card, Button, Badge } from '@/components/ui'
import { AppHeader } from '@/components/layout/navigation'

const RESTAURANT_ID = 'r1'

export default function RestaurantMenuPage() {
  const [expandedCats, setExpandedCats] = useState<string[]>(['c101'])
  const categories = MOCK_MENU_CATEGORIES[RESTAURANT_ID] ?? []
  const allItems = MOCK_MENU_ITEMS[RESTAURANT_ID] ?? []

  const toggleCat = (id: string) =>
    setExpandedCats(p => p.includes(id) ? p.filter(c => c !== id) : [...p, id])

  return (
    <div className="min-h-screen bg-brand-cream">
      <AppHeader
        title={<span className="font-display text-xl font-black text-brand-brown">Cardápio</span>}
        right={
          <Button size="sm" onClick={() => toast('Editor de cardápio em breve! 🚧')}>
            <Plus size={14} /> Novo item
          </Button>
        }
      />

      <div className="px-4 py-5 pb-24 space-y-3">
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
        {categories.map(cat => {
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
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="w-12 h-12 bg-brand-cream-dark rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        {item.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-sm text-brand-brown truncate">{item.name}</span>
                          {item.isHighlighted && <Badge variant="brand" className="text-[9px]">Destaque</Badge>}
                        </div>
                        <div className="text-xs text-brand-gray truncate mt-0.5">{item.description}</div>
                        <div className="font-display font-bold text-brand-red text-sm mt-1">{formatCurrency(item.price)}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toast(item.isAvailable ? 'Item ocultado' : 'Item ativado')}
                          className="w-8 h-8 rounded-lg bg-brand-cream-dark flex items-center justify-center hover:bg-brand-cream transition-colors"
                          title={item.isAvailable ? 'Ocultar' : 'Mostrar'}
                        >
                          {item.isAvailable ? <Eye size={13} className="text-green-600" /> : <EyeOff size={13} className="text-brand-gray" />}
                        </button>
                        <button
                          onClick={() => toast('Editor em breve! 🚧')}
                          className="w-8 h-8 rounded-lg bg-brand-cream-dark flex items-center justify-center hover:bg-brand-cream transition-colors"
                        >
                          <Edit2 size={13} className="text-brand-gray" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="px-4 py-3">
                    <button
                      onClick={() => toast('Adicionar item em breve! 🚧')}
                      className="w-full border-2 border-dashed border-brand-cream-dark rounded-xl py-3 text-sm text-brand-gray hover:border-brand-red hover:text-brand-red transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={14} /> Adicionar item a {cat.name}
                    </button>
                  </div>
                </div>
              )}
            </Card>
          )
        })}

        <button
          onClick={() => toast('Nova categoria em breve! 🚧')}
          className="w-full border-2 border-dashed border-brand-cream-dark rounded-2xl py-4 text-sm text-brand-gray hover:border-brand-red hover:text-brand-red transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={14} /> Nova categoria
        </button>
      </div>
    </div>
  )
}
