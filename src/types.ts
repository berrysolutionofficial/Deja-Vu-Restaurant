import { MenuItem } from './data/menuData';
import { KarachiArea } from './data/karachiAreas';

export type OrderType = 'delivery' | 'takeaway' | 'dine-in';

export interface CartItem {
  cartItemId: string;
  item: MenuItem;
  portion?: { label: string; price: number };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
}

export interface FlyingItemData {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  image?: string;
  name: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  orderType: OrderType;
  area?: KarachiArea;
  deliveryFee: number;
  subtotal: number;
  total: number;
  status: 'placed' | 'grilling' | 'out_for_delivery' | 'delivered';
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  tableNumber?: string;
  specialNotes?: string;
  paymentMethod: 'cod' | 'online' | 'cash';
  estimatedDeliveryMinutes: number;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: string[];
}
