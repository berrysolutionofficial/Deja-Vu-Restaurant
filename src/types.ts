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
  updatedAt?: string;
  items: CartItem[];
  orderType: OrderType;
  area?: KarachiArea;
  deliveryFee: number;
  subtotal: number;
  loyaltyDiscount?: number;
  pointsRedeemed?: number;
  pointsEarned?: number;
  total: number;
  status: 'placed' | 'grilling' | 'out_for_delivery' | 'delivered';
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  tableNumber?: string;
  specialNotes?: string;
  paymentMethod: 'cod' | 'online' | 'cash';
  estimatedDeliveryMinutes: number;
  userId?: string;
  customerEmail?: string;
  rating?: number;
  review?: string;
  reviewedAt?: string;
}

export interface CustomerUser {
  id: string;
  uid?: string;
  name: string;
  displayName?: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: string[];
  loyaltyPoints: number;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  createdAt?: string;
}

export type TimingSimulationMode = 'live' | 'open' | 'near-closing' | 'closed';
