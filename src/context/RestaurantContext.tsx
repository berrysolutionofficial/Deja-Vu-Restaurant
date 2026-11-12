import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { MenuItem, MENU_ITEMS } from '../data/menuData';
import { KarachiArea, KARACHI_AREAS, calculateDeliveryFee, RESTAURANT_LOCATION } from '../data/karachiAreas';
import { CartItem, FlyingItemData, Order, OrderType, CustomerUser } from '../types';
import { playCartChime } from '../utils/audio';

interface RestaurantContextType {
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, portion?: { label: string; price: number }, sourceEl?: HTMLElement | null) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartWiggling: boolean;
  flyingItems: FlyingItemData[];

  // Location & Delivery
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  selectedArea: KarachiArea;
  setSelectedArea: (area: KarachiArea) => void;
  customAddress: string;
  setCustomAddress: (address: string) => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;
  deliveryFee: number;
  detectCurrentLocation: () => Promise<string>;
  isDetectingLocation: boolean;
  locationError: string | null;

  // Modals
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isDashboardOpen: boolean;
  setIsDashboardOpen: (open: boolean) => void;
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;

  // User & Orders
  user: CustomerUser | null;
  loginWithGoogle: () => void;
  logout: () => void;
  orders: Order[];
  placeOrder: (orderData: Partial<Order>) => Order;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('dejavu_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('dejavu_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 2. Location & Order Type State
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [selectedArea, setSelectedArea] = useState<KarachiArea>(() => {
    const savedAreaId = localStorage.getItem('dejavu_selected_area');
    const matched = KARACHI_AREAS.find(a => a.id === savedAreaId);
    return matched || KARACHI_AREAS[0]; // Default Gulistan-e-Johar Block 1
  });
  const [customAddress, setCustomAddress] = useState<string>(() => {
    return localStorage.getItem('dejavu_custom_address') || '';
  });
  const [tableNumber, setTableNumber] = useState<string>('');
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // 3. Modals State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(() => {
    // Show location modal on initial visit if not chosen yet
    return !localStorage.getItem('dejavu_area_chosen');
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  // 4. Cart State with Fresh Image Synchronization
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dejavu_cart');
      if (!saved) return [];
      const parsed: CartItem[] = JSON.parse(saved);
      // Synchronize with fresh menu items so images and details are 100% up to date
      return parsed.map(c => {
        const freshItem = MENU_ITEMS.find(m => m.id === c.item.id);
        if (freshItem) {
          return {
            ...c,
            item: freshItem
          };
        }
        // Sanitize any stale /src/ prefix if present
        if (c.item.image && c.item.image.startsWith('/src/assets/')) {
          return {
            ...c,
            item: {
              ...c.item,
              image: c.item.image.replace('/src/assets/', '/assets/')
            }
          };
        }
        return c;
      });
    } catch {
      return [];
    }
  });

  const [isCartWiggling, setIsCartWiggling] = useState<boolean>(false);
  const [flyingItems, setFlyingItems] = useState<FlyingItemData[]>([]);

  useEffect(() => {
    localStorage.setItem('dejavu_cart', JSON.stringify(cart));
  }, [cart]);

  // Delivery Fee calculation (Only applies to delivery orderType)
  const deliveryFee = orderType === 'delivery' ? selectedArea.deliveryFee : 0;

  // 5. User Profile State
  const [user, setUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem('dejavu_customer_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const loginWithGoogle = () => {
    const mockUser: CustomerUser = {
      id: 'cust_' + Math.random().toString(36).substring(2, 9),
      name: 'Faizan Sheikh',
      email: 'faizan.customer@gmail.com',
      phone: '0300-1234567',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      addresses: [
        'House B-14, Block 1, Gulistan-e-Johar, Karachi',
        'Office # 402, Business Avenue, Shahrah-e-Faisal'
      ]
    };
    setUser(mockUser);
    localStorage.setItem('dejavu_customer_user', JSON.stringify(mockUser));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dejavu_customer_user');
  };

  // 6. Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('dejavu_orders');
      if (saved) return JSON.parse(saved);
      // Pre-seed an example completed order for rich experience
      return [
        {
          id: 'ord_demo_101',
          orderNumber: 'DV-9482',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          items: [
            {
              cartItemId: 'item_1',
              item: MENU_ITEMS[0], // Deja Vu Special Steak
              quantity: 1,
              unitPrice: 2563,
              totalPrice: 2563
            },
            {
              cartItemId: 'item_2',
              item: MENU_ITEMS.find(m => m.id === 'side-roghni-naan') || MENU_ITEMS[1],
              quantity: 2,
              unitPrice: 90,
              totalPrice: 180
            }
          ],
          orderType: 'delivery',
          area: KARACHI_AREAS[0],
          deliveryFee: 90,
          subtotal: 2743,
          total: 2833,
          status: 'delivered',
          customerName: 'Faizan Sheikh',
          customerPhone: '0300-1234567',
          deliveryAddress: 'Apartment 304, Johar Heights, Block 1, Gulistan-e-Johar, Karachi',
          paymentMethod: 'cod',
          estimatedDeliveryMinutes: 25
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('dejavu_orders', JSON.stringify(orders));
  }, [orders]);

  // Simulate live order progression for active orders
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prevOrders => {
        let changed = false;
        const updated = prevOrders.map(ord => {
          if (ord.status === 'placed') {
            changed = true;
            return { ...ord, status: 'grilling' as const };
          }
          if (ord.status === 'grilling' && Math.random() > 0.4) {
            changed = true;
            return { ...ord, status: 'out_for_delivery' as const };
          }
          return ord;
        });
        return changed ? updated : prevOrders;
      });
    }, 12000);

    return () => clearInterval(timer);
  }, []);

  // Update active tracking order if its state changed in orders list
  useEffect(() => {
    if (activeTrackingOrder) {
      const match = orders.find(o => o.id === activeTrackingOrder.id);
      if (match && match.status !== activeTrackingOrder.status) {
        setActiveTrackingOrder(match);
      }
    }
  }, [orders, activeTrackingOrder]);

  // 7. Add to Cart with Slow Smooth Parabolic Flying Animation (as in video)
  const addToCart = useCallback((
    item: MenuItem,
    portion?: { label: string; price: number },
    sourceEl?: HTMLElement | null
  ) => {
    const effectivePrice = portion ? portion.price : item.price;
    const cartItemId = `${item.id}-${portion?.label || 'default'}`;

    // Target is the cart button in the header with id="navbar-cart-btn"
    const targetEl = document.getElementById('navbar-cart-btn');

    if (sourceEl && targetEl) {
      const sourceRect = sourceEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      const startX = sourceRect.left + sourceRect.width / 2;
      const startY = sourceRect.top + sourceRect.height / 2;
      const targetX = targetRect.left + targetRect.width / 2;
      const targetY = targetRect.top + targetRect.height / 2;

      const flyId = 'fly_' + Date.now() + Math.random().toString(36).substring(2, 6);
      
      setFlyingItems(prev => [
        ...prev,
        {
          id: flyId,
          startX,
          startY,
          targetX,
          targetY,
          image: item.image,
          name: item.name
        }
      ]);

      // Remove the flying item after the 850ms slow smooth animation completes
      setTimeout(() => {
        setFlyingItems(prev => prev.filter(f => f.id !== flyId));
        // Trigger cart icon wiggle
        setIsCartWiggling(true);
        playCartChime();
        setTimeout(() => setIsCartWiggling(false), 700);
      }, 850);
    } else {
      // Direct trigger
      setIsCartWiggling(true);
      playCartChime();
      setTimeout(() => setIsCartWiggling(false), 700);
    }

    // Update cart state
    setCart(prev => {
      const existingIndex = prev.findIndex(c => c.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const copy = [...prev];
        const existing = copy[existingIndex];
        copy[existingIndex] = {
          ...existing,
          quantity: existing.quantity + 1,
          totalPrice: (existing.quantity + 1) * existing.unitPrice
        };
        return copy;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            item,
            portion,
            quantity: 1,
            unitPrice: effectivePrice,
            totalPrice: effectivePrice
          }
        ];
      }
    });
  }, []);

  const updateQuantity = useCallback((cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(c => {
          if (c.cartItemId === cartItemId) {
            const nextQty = c.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...c,
              quantity: nextQty,
              totalPrice: nextQty * c.unitPrice
            };
          }
          return c;
        })
        .filter(Boolean) as CartItem[];
    });
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart(prev => prev.filter(c => c.cartItemId !== cartItemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartSubtotal = cart.reduce((acc, curr) => acc + curr.totalPrice, 0);

  // 8. GPS Location Detection
  const detectCurrentLocation = async (): Promise<string> => {
    setIsDetectingLocation(true);
    setLocationError(null);

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setIsDetectingLocation(false);
        setLocationError("Geolocation is not supported by your browser.");
        resolve(selectedArea.name);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsDetectingLocation(false);
          const { latitude, longitude } = position.coords;

          // Find closest Karachi area in list
          let closest = KARACHI_AREAS[0];
          let minDistance = 999999;

          KARACHI_AREAS.forEach(area => {
            const dist = Math.hypot(area.lat - latitude, area.lng - longitude);
            if (dist < minDistance) {
              minDistance = dist;
              closest = area;
            }
          });

          setSelectedArea(closest);
          localStorage.setItem('dejavu_selected_area', closest.id);
          localStorage.setItem('dejavu_area_chosen', 'true');
          resolve(closest.name);
        },
        (error) => {
          setIsDetectingLocation(false);
          let msg = "Could not detect GPS location. Selected Gulistan-e-Johar.";
          if (error.code === error.PERMISSION_DENIED) {
            msg = "Location permission denied. Please select your area manually.";
          }
          setLocationError(msg);
          resolve(selectedArea.name);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  };

  // 9. Place Order Handler
  const placeOrder = (orderData: Partial<Order>): Order => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      orderNumber: `DV-${randomCode}`,
      createdAt: new Date().toISOString(),
      items: [...cart],
      orderType,
      area: selectedArea,
      deliveryFee,
      subtotal: cartSubtotal,
      total: cartSubtotal + deliveryFee,
      status: 'placed',
      customerName: orderData.customerName || user?.name || 'Valued Guest',
      customerPhone: orderData.customerPhone || user?.phone || '0325-9111555',
      deliveryAddress: orderData.deliveryAddress || customAddress || selectedArea.name,
      tableNumber: orderData.tableNumber || tableNumber,
      specialNotes: orderData.specialNotes || '',
      paymentMethod: orderData.paymentMethod || 'cod',
      estimatedDeliveryMinutes: selectedArea.estimatedMinutes || 35
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setActiveTrackingOrder(newOrder);
    setIsCheckoutModalOpen(false);
    return newOrder;
  };

  return (
    <RestaurantContext.Provider
      value={{
        theme,
        toggleTheme,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartWiggling,
        flyingItems,
        orderType,
        setOrderType,
        selectedArea,
        setSelectedArea,
        customAddress,
        setCustomAddress,
        tableNumber,
        setTableNumber,
        deliveryFee,
        detectCurrentLocation,
        isDetectingLocation,
        locationError,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isDashboardOpen,
        setIsDashboardOpen,
        activeTrackingOrder,
        setActiveTrackingOrder,
        user,
        loginWithGoogle,
        logout,
        orders,
        placeOrder,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
