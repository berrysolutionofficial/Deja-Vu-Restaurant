import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { MenuItem, MENU_ITEMS } from '../data/menuData';
import { KarachiArea, KARACHI_AREAS } from '../data/karachiAreas';
import { CartItem, FlyingItemData, Order, OrderType, CustomerUser, TimingSimulationMode } from '../types';
import { playCartChime } from '../utils/audio';
import { auth, db, googleProvider, signInWithPopup, signOut } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { checkRestaurantTiming, RestaurantTimingStatus } from '../utils/timing';

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

  // User & Real Firebase Authentication
  user: CustomerUser | null;
  isAuthLoading: boolean;
  authError: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithEmailMock: (email: string) => void;
  logout: () => Promise<void>;

  // Orders
  orders: Order[];
  placeOrder: (orderData: Partial<Order>) => Promise<Order>;

  // Operating Hours & Timing Rules
  timingStatus: RestaurantTimingStatus;
  timingSimulation: TimingSimulationMode;
  setTimingSimulation: (mode: TimingSimulationMode) => void;
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

  // 2. Restaurant Operating Hours & Timing Rules (11:00 AM to 2:00 AM PKT)
  const [timingSimulation, setTimingSimulation] = useState<TimingSimulationMode>('live');
  const [timingStatus, setTimingStatus] = useState<RestaurantTimingStatus>(() => {
    return checkRestaurantTiming();
  });

  useEffect(() => {
    const updateTiming = () => {
      if (timingSimulation === 'closed') {
        // 4:00 AM (Closed)
        setTimingStatus(checkRestaurantTiming(4, 0));
      } else if (timingSimulation === 'near-closing') {
        // 1:35 AM (Near Closing / Cutoff)
        setTimingStatus(checkRestaurantTiming(1, 35));
      } else if (timingSimulation === 'open') {
        // 8:00 PM (Peak Dinner)
        setTimingStatus(checkRestaurantTiming(20, 0));
      } else {
        // Live Real Karachi Time
        setTimingStatus(checkRestaurantTiming());
      }
    };

    updateTiming();
    const interval = setInterval(updateTiming, 20000);
    return () => clearInterval(interval);
  }, [timingSimulation]);

  // 3. Location & Order Type State
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

  // 4. Modals State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(() => {
    return !localStorage.getItem('dejavu_area_chosen');
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  // 5. Cart State with Fresh Image Synchronization
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dejavu_cart');
      if (!saved) return [];
      const parsed: CartItem[] = JSON.parse(saved);
      return parsed.map(c => {
        const freshItem = MENU_ITEMS.find(m => m.id === c.item.id);
        if (freshItem) {
          return {
            ...c,
            item: freshItem
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

  // Delivery Fee calculation
  const deliveryFee = orderType === 'delivery' ? selectedArea.deliveryFee : 0;

  // 6. User Profile & Real Google Firebase Authentication State
  const [user, setUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem('dejavu_customer_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data() as CustomerUser;
            setUser(data);
            localStorage.setItem('dejavu_customer_user', JSON.stringify(data));
          } else {
            const newUser: CustomerUser = {
              id: fbUser.uid,
              name: fbUser.displayName || 'Valued Customer',
              email: fbUser.email || '',
              phone: fbUser.phoneNumber || '0325-9111555',
              avatar: fbUser.photoURL || undefined,
              addresses: ['Plot # B-54/13, Johar Hill Rd, Block 1, Karachi']
            };
            await setDoc(userRef, {
              ...newUser,
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString()
            });
            setUser(newUser);
            localStorage.setItem('dejavu_customer_user', JSON.stringify(newUser));
          }
        } catch (err) {
          console.warn("Firestore user sync error (using local profile):", err);
          const fallbackUser: CustomerUser = {
            id: fbUser.uid,
            name: fbUser.displayName || 'Valued Customer',
            email: fbUser.email || '',
            phone: '0325-9111555',
            avatar: fbUser.photoURL || undefined,
            addresses: []
          };
          setUser(fallbackUser);
          localStorage.setItem('dejavu_customer_user', JSON.stringify(fallbackUser));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Real Google Sign In via Firebase popup
  const loginWithGoogle = async () => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const userRef = doc(db, 'users', fbUser.uid);

      let customerProfile: CustomerUser;
      try {
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          customerProfile = snap.data() as CustomerUser;
        } else {
          customerProfile = {
            id: fbUser.uid,
            name: fbUser.displayName || 'Valued Customer',
            email: fbUser.email || '',
            phone: '0325-9111555',
            avatar: fbUser.photoURL || undefined,
            addresses: ['Plot # B-54/13, Johar Hill Rd, Block 1, Karachi']
          };
          await setDoc(userRef, {
            ...customerProfile,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          });
        }
      } catch {
        customerProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Valued Customer',
          email: fbUser.email || '',
          phone: '0325-9111555',
          avatar: fbUser.photoURL || undefined,
          addresses: ['Plot # B-54/13, Johar Hill Rd, Block 1, Karachi']
        };
      }

      setUser(customerProfile);
      localStorage.setItem('dejavu_customer_user', JSON.stringify(customerProfile));
      setIsAuthModalOpen(false);
    } catch (err: unknown) {
      console.error('Google Sign In Error:', err);
      const message = err instanceof Error ? err.message : 'Google sign-in was interrupted. Please try again.';
      setAuthError(message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const loginWithEmailMock = (emailInput: string) => {
    const customUser: CustomerUser = {
      id: 'cust_' + Date.now(),
      name: emailInput.split('@')[0].replace('.', ' ').toUpperCase(),
      email: emailInput,
      phone: '0325-9111555',
      avatar: undefined,
      addresses: ['Johar Hill Rd, Block 1, Karachi']
    };
    setUser(customUser);
    localStorage.setItem('dejavu_customer_user', JSON.stringify(customUser));
    setIsAuthModalOpen(false);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("SignOut error:", err);
    }
    setUser(null);
    localStorage.removeItem('dejavu_customer_user');
    setIsDashboardOpen(false);
  };

  // 7. Orders State (Synced locally and with Firestore)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('dejavu_orders');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'ord_demo_101',
          orderNumber: 'DV-9482',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          items: [
            {
              cartItemId: 'item_1',
              item: MENU_ITEMS[0],
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
          customerName: 'Valued Guest',
          customerPhone: '0325-9111555',
          deliveryAddress: 'Johar Heights, Block 1, Gulistan-e-Johar, Karachi',
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

  // Sync user orders from Firestore when logged in
  useEffect(() => {
    if (!user?.id) return;

    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('userId', '==', user.id));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const remoteOrders: Order[] = [];
          snapshot.forEach(docSnap => {
            remoteOrders.push(docSnap.data() as Order);
          });
          // Merge with local orders, prioritizing newer
          setOrders(prev => {
            const map = new Map<string, Order>();
            remoteOrders.forEach(o => map.set(o.id, o));
            prev.forEach(o => {
              if (!map.has(o.id)) map.set(o.id, o);
            });
            return Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        }
      }, (err) => {
        console.warn("Firestore orders listener warning:", err);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn("Could not attach firestore listener:", e);
    }
  }, [user?.id]);

  // Simulate kitchen progress
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

  // 8. Add to Cart with Slow Smooth Parabolic Flying Animation
  const addToCart = useCallback((
    item: MenuItem,
    portion?: { label: string; price: number },
    sourceEl?: HTMLElement | null
  ) => {
    const effectivePrice = portion ? portion.price : item.price;
    const cartItemId = `${item.id}-${portion?.label || 'default'}`;

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

      setTimeout(() => {
        setFlyingItems(prev => prev.filter(f => f.id !== flyId));
        setIsCartWiggling(true);
        playCartChime();
        setTimeout(() => setIsCartWiggling(false), 700);
      }, 850);
    } else {
      setIsCartWiggling(true);
      playCartChime();
      setTimeout(() => setIsCartWiggling(false), 700);
    }

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

  // 9. GPS Location Detection
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

  // 10. Place Order Handler (Persisted to Firestore & local)
  const placeOrder = async (orderData: Partial<Order>): Promise<Order> => {
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
      estimatedDeliveryMinutes: selectedArea.estimatedMinutes || 35,
      userId: user?.id,
      customerEmail: user?.email
    };

    // Save to Firestore
    try {
      await setDoc(doc(db, 'orders', newOrder.id), {
        ...newOrder,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Could not save order to Firestore directly (saved locally):", err);
    }

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
        isAuthLoading,
        authError,
        loginWithGoogle,
        loginWithEmailMock,
        logout,
        orders,
        placeOrder,
        timingStatus,
        timingSimulation,
        setTimingSimulation,
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
