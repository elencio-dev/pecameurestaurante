import type {
  Restaurant, MenuItem, MenuCategory, Order, User, Driver
} from '@/types'

// ─── USERS ───────────────────────────────────

export const MOCK_USERS: User[] = [
  {
    id: 'u1', name: 'Ana Beatriz', email: 'ana@email.com', phone: '11999991111',
    role: 'customer', avatar: '👩', createdAt: '2024-01-10', isActive: true,
  },
  {
    id: 'u2', name: 'Carlos Mendes', email: 'carlos@pizzaroma.com', phone: '11999992222',
    role: 'restaurant_owner', avatar: '👨‍🍳', createdAt: '2024-01-05', isActive: true,
  },
  {
    id: 'u3', name: 'Diego Lima', email: 'diego.entregador@email.com', phone: '11999993333',
    role: 'driver', avatar: '🛵', createdAt: '2024-01-08', isActive: true,
  },
]

// ─── RESTAURANTS ─────────────────────────────

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'r1', ownerId: 'u2', name: 'Pizzaria Roma', slug: 'pizzaria-roma',
    description: 'A melhor pizza artesanal da cidade, com ingredientes importados e forno a lenha.',
    category: 'Pizza', categories: ['Pizza', 'Italiano'],
    logo: '🍕',
    address: { id: 'a1', label: '', street: 'Rua das Flores', number: '100', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', zipCode: '01310-000', lat: -23.5505, lng: -46.6333 },
    phone: '11 3000-0001', email: 'contato@pizzaroma.com', cnpj: '12.345.678/0001-90',
    status: 'open',
    openingHours: [
      { dayOfWeek: 1, open: '11:00', close: '23:00', isOpen: true },
      { dayOfWeek: 2, open: '11:00', close: '23:00', isOpen: true },
      { dayOfWeek: 3, open: '11:00', close: '23:00', isOpen: true },
      { dayOfWeek: 4, open: '11:00', close: '23:00', isOpen: true },
      { dayOfWeek: 5, open: '11:00', close: '00:00', isOpen: true },
      { dayOfWeek: 6, open: '11:00', close: '00:00', isOpen: true },
      { dayOfWeek: 0, open: '12:00', close: '22:00', isOpen: true },
    ],
    estimatedDeliveryTime: 35, minimumOrder: 25, deliveryFee: 4.99, deliveryRadiusKm: 8,
    platformFeePerOrder: 1.00,
    rating: 4.9, totalRatings: 847, totalOrders: 3241,
    acceptsOnlinePayment: true, acceptsCash: true, acceptsPix: true,
    isPromoted: true, createdAt: '2024-01-05',
  },
  {
    id: 'r2', ownerId: 'u5', name: 'Smash House', slug: 'smash-house',
    description: 'Burgers smash artesanais com blend especial de carne bovina e receitas exclusivas.',
    category: 'Hambúrguer', categories: ['Hambúrguer'],
    logo: '🍔',
    address: { id: 'a2', label: '', street: 'Av. Paulista', number: '500', neighborhood: 'Bela Vista', city: 'São Paulo', state: 'SP', zipCode: '01311-000', lat: -23.5641, lng: -46.6525 },
    phone: '11 3000-0002', email: 'oi@smashhouse.com.br', cnpj: '23.456.789/0001-01',
    status: 'open',
    openingHours: [
      { dayOfWeek: 1, open: '18:00', close: '00:00', isOpen: true },
      { dayOfWeek: 2, open: '18:00', close: '00:00', isOpen: true },
      { dayOfWeek: 3, open: '18:00', close: '00:00', isOpen: true },
      { dayOfWeek: 4, open: '18:00', close: '01:00', isOpen: true },
      { dayOfWeek: 5, open: '18:00', close: '02:00', isOpen: true },
      { dayOfWeek: 6, open: '12:00', close: '02:00', isOpen: true },
      { dayOfWeek: 0, open: '12:00', close: '23:00', isOpen: true },
    ],
    estimatedDeliveryTime: 40, minimumOrder: 30, deliveryFee: 5.99, deliveryRadiusKm: 6,
    platformFeePerOrder: 1.00,
    rating: 4.7, totalRatings: 512, totalOrders: 1890,
    acceptsOnlinePayment: true, acceptsCash: false, acceptsPix: true,
    isPromoted: false, createdAt: '2024-02-01',
  },
  {
    id: 'r3', ownerId: 'u6', name: 'Sakura Sushi', slug: 'sakura-sushi',
    description: 'Sushi premium com ingredientes frescos diretamente do mercado de peixes.',
    category: 'Japonês', categories: ['Japonês'],
    logo: '🍣',
    address: { id: 'a3', label: '', street: 'Rua Liberdade', number: '200', neighborhood: 'Liberdade', city: 'São Paulo', state: 'SP', zipCode: '01503-000' },
    phone: '11 3000-0003', email: 'sakura@sakurasushi.com', cnpj: '34.567.890/0001-12',
    status: 'open',
    openingHours: [
      { dayOfWeek: 2, open: '12:00', close: '22:00', isOpen: true },
      { dayOfWeek: 3, open: '12:00', close: '22:00', isOpen: true },
      { dayOfWeek: 4, open: '12:00', close: '22:00', isOpen: true },
      { dayOfWeek: 5, open: '12:00', close: '23:00', isOpen: true },
      { dayOfWeek: 6, open: '12:00', close: '23:00', isOpen: true },
      { dayOfWeek: 0, open: '12:00', close: '21:00', isOpen: true },
      { dayOfWeek: 1, open: '00:00', close: '00:00', isOpen: false },
    ],
    estimatedDeliveryTime: 50, minimumOrder: 50, deliveryFee: 6.99, deliveryRadiusKm: 5,
    platformFeePerOrder: 1.00,
    rating: 4.8, totalRatings: 324, totalOrders: 1102,
    acceptsOnlinePayment: true, acceptsCash: false, acceptsPix: true,
    isPromoted: true, createdAt: '2024-02-15',
  },
  {
    id: 'r4', ownerId: 'u7', name: 'Verde & Vida', slug: 'verde-e-vida',
    description: 'Alimentação saudável sem abrir mão do sabor. Bowls, wraps e sucos frescos.',
    category: 'Saudável', categories: ['Saudável', 'Brasileiro'],
    logo: '🥗',
    address: { id: 'a4', label: '', street: 'Rua Oscar Freire', number: '800', neighborhood: 'Jardins', city: 'São Paulo', state: 'SP', zipCode: '01426-000' },
    phone: '11 3000-0004', email: 'oi@verdevida.com', cnpj: '45.678.901/0001-23',
    status: 'open',
    openingHours: [
      { dayOfWeek: 1, open: '08:00', close: '20:00', isOpen: true },
      { dayOfWeek: 2, open: '08:00', close: '20:00', isOpen: true },
      { dayOfWeek: 3, open: '08:00', close: '20:00', isOpen: true },
      { dayOfWeek: 4, open: '08:00', close: '20:00', isOpen: true },
      { dayOfWeek: 5, open: '08:00', close: '20:00', isOpen: true },
      { dayOfWeek: 6, open: '09:00', close: '18:00', isOpen: true },
      { dayOfWeek: 0, open: '00:00', close: '00:00', isOpen: false },
    ],
    estimatedDeliveryTime: 25, minimumOrder: 20, deliveryFee: 3.99, deliveryRadiusKm: 7,
    platformFeePerOrder: 1.00,
    rating: 4.6, totalRatings: 218, totalOrders: 789,
    acceptsOnlinePayment: true, acceptsCash: true, acceptsPix: true,
    isPromoted: false, createdAt: '2024-03-01',
  },
  {
    id: 'r5', ownerId: 'u8', name: 'Sheik Árabe', slug: 'sheik-arabe',
    description: 'Culinária árabe autêntica: esfihas, kafta grelhada e charuto de uva.',
    category: 'Árabe', categories: ['Árabe'],
    logo: '🥙',
    address: { id: 'a5', label: '', street: 'Rua 25 de Março', number: '400', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', zipCode: '01021-000' },
    phone: '11 3000-0005', email: 'contato@sheikarabe.com', cnpj: '56.789.012/0001-34',
    status: 'open',
    openingHours: [
      { dayOfWeek: 1, open: '10:00', close: '22:00', isOpen: true },
      { dayOfWeek: 2, open: '10:00', close: '22:00', isOpen: true },
      { dayOfWeek: 3, open: '10:00', close: '22:00', isOpen: true },
      { dayOfWeek: 4, open: '10:00', close: '22:00', isOpen: true },
      { dayOfWeek: 5, open: '10:00', close: '23:00', isOpen: true },
      { dayOfWeek: 6, open: '10:00', close: '23:00', isOpen: true },
      { dayOfWeek: 0, open: '11:00', close: '20:00', isOpen: true },
    ],
    estimatedDeliveryTime: 30, minimumOrder: 15, deliveryFee: 4.49, deliveryRadiusKm: 9,
    platformFeePerOrder: 1.00,
    rating: 4.7, totalRatings: 445, totalOrders: 2100,
    acceptsOnlinePayment: true, acceptsCash: true, acceptsPix: true,
    isPromoted: false, createdAt: '2024-01-20',
  },
]

// ─── MENU ITEMS ──────────────────────────────

export const MOCK_MENU_ITEMS: Record<string, MenuItem[]> = {
  r1: [
    { id: 'i101', restaurantId: 'r1', categoryId: 'c101', name: 'Margherita Clássica', description: 'Molho de tomate San Marzano, mussarela de búfala, manjericão fresco', price: 39.90, icon: 'Pizza', isAvailable: true, isHighlighted: true, tags: ['vegetariano'], prepTimeMinutes: 20, calories: 820 },
    { id: 'i102', restaurantId: 'r1', categoryId: 'c101', name: 'Quatro Queijos', description: 'Mussarela, provolone defumado, gorgonzola e parmesão reggiano', price: 45.90, icon: 'Pizza', isAvailable: true, isHighlighted: false, tags: ['vegetariano'], prepTimeMinutes: 20, calories: 980 },
    { id: 'i103', restaurantId: 'r1', categoryId: 'c101', name: 'Frango com Catupiry', description: 'Frango desfiado temperado, Catupiry original, azeitona preta', price: 42.90, icon: 'Pizza', isAvailable: true, isHighlighted: false, tags: [], prepTimeMinutes: 22, calories: 900 },
    { id: 'i104', restaurantId: 'r1', categoryId: 'c101', name: 'Pepperoni Premium', description: 'Pepperoni importado em fartas fatias, mussarela extra', price: 48.90, icon: 'Pizza', isAvailable: true, isHighlighted: true, tags: [], prepTimeMinutes: 20, calories: 1050 },
    { id: 'i105', restaurantId: 'r1', categoryId: 'c102', name: 'Refrigerante 2L', description: 'Coca-Cola, Guaraná Antarctica ou Sprite', price: 12.00, icon: 'CupSoda', isAvailable: true, isHighlighted: false, tags: [], prepTimeMinutes: 2, calories: 420 },
    { id: 'i106', restaurantId: 'r1', categoryId: 'c102', name: 'Suco Natural 500ml', description: 'Laranja, limão-cravo ou maracujá', price: 10.00, icon: 'Citrus', isAvailable: true, isHighlighted: false, tags: ['natural'], prepTimeMinutes: 5, calories: 180 },
    { id: 'i107', restaurantId: 'r1', categoryId: 'c103', name: 'Brownie + Sorvete', description: 'Brownie artesanal quente com sorvete de baunilha Madagáscar', price: 18.00, icon: 'Cake', isAvailable: true, isHighlighted: true, tags: [], prepTimeMinutes: 8, calories: 620 },
  ],
  r2: [
    { id: 'i201', restaurantId: 'r2', categoryId: 'c201', name: 'Smash Clássico', description: 'Blend 180g, queijo cheddar americano, picles crocante, molho especial da casa', price: 32.90, icon: 'Sandwich', isAvailable: true, isHighlighted: true, tags: [], prepTimeMinutes: 15, calories: 720 },
    { id: 'i202', restaurantId: 'r2', categoryId: 'c201', name: 'Double Smash', description: 'Dois blends 180g, duplo cheddar, bacon defumado, cebola crispy', price: 42.90, icon: 'Sandwich', isAvailable: true, isHighlighted: true, tags: [], prepTimeMinutes: 18, calories: 980 },
    { id: 'i203', restaurantId: 'r2', categoryId: 'c201', name: 'Mushroom Swiss', description: 'Blend 180g, cogumelos Paris e Portobello salteados, queijo suíço', price: 38.90, icon: 'Sandwich', isAvailable: true, isHighlighted: false, tags: [], prepTimeMinutes: 18, calories: 810 },
    { id: 'i204', restaurantId: 'r2', categoryId: 'c201', name: 'Veggie Smash', description: 'Blend de grão de bico e cogumelos, cheddar vegano, rúcula, tomate', price: 35.90, icon: 'Vegan', isAvailable: true, isHighlighted: false, tags: ['vegetariano'], prepTimeMinutes: 15, calories: 580 },
    { id: 'i205', restaurantId: 'r2', categoryId: 'c202', name: 'Batata Frita 200g', description: 'Crocante por fora, macia por dentro, temperada com alecrim', price: 15.90, icon: 'Utensils', isAvailable: true, isHighlighted: false, tags: ['vegetariano'], prepTimeMinutes: 10, calories: 440 },
    { id: 'i206', restaurantId: 'r2', categoryId: 'c202', name: 'Onion Rings', description: 'Anéis de cebola empanados, molho barbecue defumado', price: 16.90, icon: 'UtensilsCrossed', isAvailable: true, isHighlighted: false, tags: ['vegetariano'], prepTimeMinutes: 12, calories: 390 },
  ],
  r3: [
    { id: 'i301', restaurantId: 'r3', categoryId: 'c301', name: 'Combo Sakura 20 peças', description: 'Hots, califórnia, skin e niguiri de salmão', price: 69.90, icon: 'Package', isAvailable: true, isHighlighted: true, tags: ['sem glúten'], prepTimeMinutes: 30, calories: 820 },
    { id: 'i302', restaurantId: 'r3', categoryId: 'c301', name: 'Combo Especial 30 peças', description: 'Variedade completa com temaki bônus', price: 98.90, icon: 'Package', isAvailable: true, isHighlighted: true, tags: [], prepTimeMinutes: 35, calories: 1200 },
    { id: 'i303', restaurantId: 'r3', categoryId: 'c302', name: 'Temaki Salmão', description: 'Salmão fresco, cream cheese Philadelphia, pepino japonês', price: 22.90, icon: 'Sandwich', isAvailable: true, isHighlighted: false, tags: [], prepTimeMinutes: 15, calories: 350 },
    { id: 'i304', restaurantId: 'r3', categoryId: 'c302', name: 'Temaki Atum', description: 'Atum fresco, cream cheese, cebolinha, gergelim negro', price: 24.90, icon: 'Sandwich', isAvailable: true, isHighlighted: false, tags: [], prepTimeMinutes: 15, calories: 320 },
  ],
  r4: [
    { id: 'i401', restaurantId: 'r4', categoryId: 'c401', name: 'Bowl Proteico', description: 'Frango grelhado, quinoa, grão de bico, cenoura, espinafre, molho tahine', price: 28.90, icon: 'Salad', isAvailable: true, isHighlighted: true, tags: ['sem glúten', 'proteico'], prepTimeMinutes: 15, calories: 480 },
    { id: 'i402', restaurantId: 'r4', categoryId: 'c401', name: 'Bowl Mediterrâneo', description: 'Atum, azeitona kalamata, tomate cereja, pepino, queijo feta, folhas', price: 31.90, icon: 'Salad', isAvailable: true, isHighlighted: false, tags: ['sem glúten'], prepTimeMinutes: 12, calories: 410 },
    { id: 'i403', restaurantId: 'r4', categoryId: 'c402', name: 'Suco Verde', description: 'Couve manteiga, maçã verde, gengibre, limão, pepino', price: 14.90, icon: 'CupSoda', isAvailable: true, isHighlighted: false, tags: ['vegano', 'natural'], prepTimeMinutes: 5, calories: 90 },
    { id: 'i404', restaurantId: 'r4', categoryId: 'c402', name: 'Vitamina Power', description: 'Whey protein, banana, cacau, aveia, leite de amêndoas', price: 16.90, icon: 'CupSoda', isAvailable: true, isHighlighted: true, tags: ['proteico'], prepTimeMinutes: 5, calories: 340 },
  ],
  r5: [
    { id: 'i501', restaurantId: 'r5', categoryId: 'c501', name: 'Esfiha de Carne', description: 'Carne moída temperada com especiarias árabes, hortelã', price: 5.90, icon: 'Sandwich', isAvailable: true, isHighlighted: false, tags: [], prepTimeMinutes: 5, calories: 180 },
    { id: 'i502', restaurantId: 'r5', categoryId: 'c501', name: 'Esfiha de Frango', description: 'Frango cremoso com requeijão, salsinha', price: 5.90, icon: 'Sandwich', isAvailable: true, isHighlighted: false, tags: [], prepTimeMinutes: 5, calories: 160 },
    { id: 'i503', restaurantId: 'r5', categoryId: 'c501', name: 'Kit 10 Esfihas', description: 'Escolha 10 unidades à vontade', price: 49.90, icon: 'PackageOpen', isAvailable: true, isHighlighted: true, tags: [], prepTimeMinutes: 10, calories: 1800 },
    { id: 'i504', restaurantId: 'r5', categoryId: 'c502', name: 'Kafta Grelhada', description: 'Kafta bovina no carvão, arroz árabe, salada fatouche, molho de alho', price: 34.90, icon: 'Soup', isAvailable: true, isHighlighted: true, tags: [], prepTimeMinutes: 20, calories: 650 },
  ],
}

export const MOCK_MENU_CATEGORIES: Record<string, MenuCategory[]> = {
  r1: [
    { id: 'c101', restaurantId: 'r1', name: '🍕 Pizzas', position: 1, isActive: true },
    { id: 'c102', restaurantId: 'r1', name: '🥤 Bebidas', position: 2, isActive: true },
    { id: 'c103', restaurantId: 'r1', name: '🍰 Sobremesas', position: 3, isActive: true },
  ],
  r2: [
    { id: 'c201', restaurantId: 'r2', name: '🍔 Burgers', position: 1, isActive: true },
    { id: 'c202', restaurantId: 'r2', name: '🍟 Acompanhamentos', position: 2, isActive: true },
  ],
  r3: [
    { id: 'c301', restaurantId: 'r3', name: '🍱 Combos', position: 1, isActive: true },
    { id: 'c302', restaurantId: 'r3', name: '🌯 Temakis', position: 2, isActive: true },
  ],
  r4: [
    { id: 'c401', restaurantId: 'r4', name: '🥗 Bowls', position: 1, isActive: true },
    { id: 'c402', restaurantId: 'r4', name: '🥤 Bebidas', position: 2, isActive: true },
  ],
  r5: [
    { id: 'c501', restaurantId: 'r5', name: '🥙 Esfihas & Salgados', position: 1, isActive: true },
    { id: 'c502', restaurantId: 'r5', name: '🫕 Pratos Quentes', position: 2, isActive: true },
  ],
}

// ─── ORDERS ──────────────────────────────────

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1', orderNumber: '#PMR-4521',
    customerId: 'u1', customerName: 'Ana Beatriz', customerPhone: '11999991111',
    restaurantId: 'r1', restaurantName: 'Pizzaria Roma',
    driverId: 'u3', driverName: 'Diego Lima',
    items: [
      { id: 'oi1', menuItemId: 'i101', menuItemName: 'Margherita Clássica', icon: 'Pizza', quantity: 2, unitPrice: 39.90, totalPrice: 79.80 },
      { id: 'oi2', menuItemId: 'i105', menuItemName: 'Refrigerante 2L', icon: 'CupSoda', quantity: 1, unitPrice: 12.00, totalPrice: 12.00 },
    ],
    deliveryAddress: { id: 'da1', label: 'Casa', street: 'Rua das Palmeiras', number: '42', neighborhood: 'Pinheiros', city: 'São Paulo', state: 'SP', zipCode: '05422-000' },
    subtotal: 91.80, deliveryFee: 4.99, discount: 0, platformFee: 1.00, total: 96.79,
    paymentMethod: 'pix', paymentStatus: 'paid',
    status: 'on_the_way',
    statusHistory: [
      { status: 'pending', timestamp: '2024-06-01T19:00:00Z' },
      { status: 'accepted', timestamp: '2024-06-01T19:03:00Z' },
      { status: 'preparing', timestamp: '2024-06-01T19:05:00Z' },
      { status: 'ready', timestamp: '2024-06-01T19:28:00Z' },
      { status: 'picked_up', timestamp: '2024-06-01T19:32:00Z' },
      { status: 'on_the_way', timestamp: '2024-06-01T19:33:00Z' },
    ],
    estimatedDeliveryTime: 35,
    createdAt: '2024-06-01T19:00:00Z',
    acceptedAt: '2024-06-01T19:03:00Z',
  },
  {
    id: 'o2', orderNumber: '#PMR-4520',
    customerId: 'u9', customerName: 'Beatriz Santos', customerPhone: '11999994444',
    restaurantId: 'r1', restaurantName: 'Pizzaria Roma',
    items: [
      { id: 'oi3', menuItemId: 'i102', menuItemName: 'Quatro Queijos', icon: 'Pizza', quantity: 1, unitPrice: 45.90, totalPrice: 45.90 },
      { id: 'oi4', menuItemId: 'i106', menuItemName: 'Suco Natural', icon: 'Citrus', quantity: 1, unitPrice: 10.00, totalPrice: 10.00 },
    ],
    deliveryAddress: { id: 'da2', label: 'Trabalho', street: 'Av. Brigadeiro', number: '2000', neighborhood: 'Itaim', city: 'São Paulo', state: 'SP', zipCode: '04538-132' },
    subtotal: 55.90, deliveryFee: 4.99, discount: 0, platformFee: 1.00, total: 60.89,
    paymentMethod: 'credit_card', paymentStatus: 'paid',
    status: 'preparing',
    statusHistory: [
      { status: 'pending', timestamp: '2024-06-01T19:10:00Z' },
      { status: 'accepted', timestamp: '2024-06-01T19:13:00Z' },
      { status: 'preparing', timestamp: '2024-06-01T19:15:00Z' },
    ],
    estimatedDeliveryTime: 35,
    createdAt: '2024-06-01T19:10:00Z',
    acceptedAt: '2024-06-01T19:13:00Z',
  },
  {
    id: 'o3', orderNumber: '#PMR-4519',
    customerId: 'u10', customerName: 'Carlos Faria', customerPhone: '11999995555',
    restaurantId: 'r1', restaurantName: 'Pizzaria Roma',
    driverId: 'u3', driverName: 'Diego Lima',
    items: [
      { id: 'oi5', menuItemId: 'i103', menuItemName: 'Frango com Catupiry', icon: 'Pizza', quantity: 1, unitPrice: 42.90, totalPrice: 42.90 },
      { id: 'oi6', menuItemId: 'i107', menuItemName: 'Brownie + Sorvete', icon: 'Cake', quantity: 1, unitPrice: 18.00, totalPrice: 18.00 },
    ],
    deliveryAddress: { id: 'da3', label: 'Casa', street: 'Rua Augusta', number: '888', neighborhood: 'Consolação', city: 'São Paulo', state: 'SP', zipCode: '01305-100' },
    subtotal: 60.90, deliveryFee: 4.99, discount: 0, platformFee: 1.00, total: 65.89,
    paymentMethod: 'pix', paymentStatus: 'paid',
    status: 'delivered',
    statusHistory: [
      { status: 'pending', timestamp: '2024-06-01T18:00:00Z' },
      { status: 'accepted', timestamp: '2024-06-01T18:02:00Z' },
      { status: 'preparing', timestamp: '2024-06-01T18:05:00Z' },
      { status: 'ready', timestamp: '2024-06-01T18:28:00Z' },
      { status: 'picked_up', timestamp: '2024-06-01T18:32:00Z' },
      { status: 'on_the_way', timestamp: '2024-06-01T18:33:00Z' },
      { status: 'delivered', timestamp: '2024-06-01T18:55:00Z' },
    ],
    estimatedDeliveryTime: 35,
    createdAt: '2024-06-01T18:00:00Z',
    acceptedAt: '2024-06-01T18:02:00Z',
    deliveredAt: '2024-06-01T18:55:00Z',
    customerRating: 5,
    customerReview: 'Perfeito! Pizza chegou quentinha.',
  },
]

// ─── REVENUE ANALYTICS ───────────────────────

export const MOCK_REVENUE_MONTHLY = [
  { month: 'Jan', orders: 1240, revenue: 1240, restaurants: 12 },
  { month: 'Fev', orders: 1890, revenue: 1890, restaurants: 18 },
  { month: 'Mar', orders: 2340, revenue: 2340, restaurants: 24 },
  { month: 'Abr', orders: 2100, revenue: 2100, restaurants: 22 },
  { month: 'Mai', orders: 3120, revenue: 3120, restaurants: 31 },
  { month: 'Jun', orders: 4200, revenue: 4200, restaurants: 42 },
]
