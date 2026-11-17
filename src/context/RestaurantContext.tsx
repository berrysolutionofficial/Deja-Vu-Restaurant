import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { MenuItem, MENU_ITEMS } from '../data/menuData';
import { KarachiArea, KARACHI_AREAS } from '../data/karachiAreas';
import { CartItem, FlyingItemData, Order, OrderType, CustomerUser, TimingSimulationMode } from '../types';
import { playCartChime } from '../utils/audio';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signOut,
  OperationType,
  handleFirestoreError,
} from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  writeBatch,
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { checkRestaurantTiming, RestaurantTimingStatus } from '../utils/timing';

export const LOYALTY_EARN_RATE_RS = 100; // Earn 1 Point per Rs. 100 spent
export const LOYALTY_POINT_VALUE_RS = 10; // 1 Point = Rs. 10 discount on future orders

interface PlaceOrderPayload extends Partial<Order> {
  pointsToRedeem?: number;
}

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
  authReady: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  loginWithGoogle: (openDashboardAfter?: boolean) => Promise<void>;
  logout: () => Promise<void>;

  // Orders, Repeat Order, Reviews & Loyalty
  orders: Order[];
  placeOrder: (orderData: PlaceOrderPayload) => Promise<Order>;
  repeatOrder: (order: Order) => void;
  submitOrderReview: (orderId: string, rating: number, reviewText: string) => Promise<void>;

  // Operating Hours & Timing Rules
  timingStatus: RestaurantTimingStatus;
  timingSimulation: TimingSimulationMode;
  setTimingSimulation: (mode: TimingSimulationMode) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

function sanitizeString(value: string | undefined, maxLen: number): string {
  if (!value) return '';
  return value.trim().slice(0, maxLen);
}

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
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 2. Restaurant Operating Hours & Timing Rules (11:00 AM to 2:00 AM PKT)
  const [timingSimulation, setTimingSimulation] = useState<TimingSimulationMode>('live');
  const [timingStatus, setTimingStatus] = useState<RestaurantTimingStatus>(() => {
    return checkRestaurantTiming();
  });

  useEffect(() => {
    const updateTiming = () => {
      if (timingSimulation === 'closed') {
        setTimingStatus(checkRestaurantTiming(4, 0));
      } else if (timingSimulation === 'near-closing') {
        setTimingStatus(checkRestaurantTiming(1, 35));
      } else if (timingSimulation === 'open') {
        setTimingStatus(checkRestaurantTiming(20, 0));
      } else {
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
    const matched = KARACHI_AREAS.find((a) => a.id === savedAreaId);
    return matched || KARACHI_AREAS[0];
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
      return parsed.map((c) => {
        const freshItem = MENU_ITEMS.find((m) => m.id === c.item.id);
        if (freshItem) {
          return { ...c, item: freshItem };
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

  const deliveryFee = orderType === 'delivery' ? selectedArea.deliveryFee : 0;

  // 6. User Profile & Real Google Firebase Authentication State
  const [user, setUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem('dejavu_customer_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        loyaltyPoints: typeof parsed.loyaltyPoints === 'number' ? parsed.loyaltyPoints : 0,
        totalPointsEarned: typeof parsed.totalPointsEarned === 'number' ? parsed.totalPointsEarned : 0,
        totalPointsRedeemed: typeof parsed.totalPointsRedeemed === 'number' ? parsed.totalPointsRedeemed : 0,
      };
    } catch {
      return null;
    }
  });
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Build or sync Firestore user profile document cleanly matching security rules
  const syncUserProfile = useCallback(async (fbUser: NonNullable<typeof auth.currentUser>): Promise<CustomerUser> => {
    const userPath = `users/${fbUser.uid}`;
    const userRef = doc(db, 'users', fbUser.uid);
    const nowIso = new Date().toISOString();

    let profile: CustomerUser = {
      id: fbUser.uid,
      uid: fbUser.uid,
      name: sanitizeString(fbUser.displayName || 'Valued Customer', 100),
      displayName: sanitizeString(fbUser.displayName || 'Valued Customer', 100),
      email: sanitizeString(fbUser.email || '', 150),
      phone: sanitizeString(fbUser.phoneNumber || '', 30),
      avatar: sanitizeString(fbUser.photoURL || '', 500),
      addresses: ['Plot # B-54/13, Johar Hill Rd, Block 1, Karachi'],
      loyaltyPoints: 0,
      totalPointsEarned: 0,
      totalPointsRedeemed: 0,
      createdAt: nowIso,
    };

    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        profile = {
          id: fbUser.uid,
          uid: fbUser.uid,
          name: sanitizeString(data.name || fbUser.displayName || 'Valued Customer', 100),
          displayName: sanitizeString(data.displayName || data.name || fbUser.displayName || 'Valued Customer', 100),
          email: sanitizeString(data.email || fbUser.email || '', 150),
          phone: sanitizeString(data.phone || fbUser.phoneNumber || '', 30),
          avatar: sanitizeString(fbUser.photoURL || data.avatar || '', 500),
          addresses: Array.isArray(data.addresses) ? data.addresses.slice(0, 10) : [],
          loyaltyPoints: typeof data.loyaltyPoints === 'number' ? data.loyaltyPoints : 0,
          totalPointsEarned: typeof data.totalPointsEarned === 'number' ? data.totalPointsEarned : 0,
          totalPointsRedeemed: typeof data.totalPointsRedeemed === 'number' ? data.totalPointsRedeemed : 0,
          createdAt: typeof data.createdAt === 'string' ? data.createdAt : nowIso,
        };

        await updateDoc(userRef, {
          name: profile.name,
          displayName: profile.displayName,
          avatar: profile.avatar || '',
          loyaltyPoints: profile.loyaltyPoints,
          totalPointsEarned: profile.totalPointsEarned,
          totalPointsRedeemed: profile.totalPointsRedeemed,
          lastLoginAt: nowIso,
          updatedAt: nowIso,
        });
      } else {
        await setDoc(userRef, {
          uid: profile.uid,
          id: profile.id,
          name: profile.name,
          displayName: profile.displayName,
          email: profile.email,
          phone: profile.phone,
          avatar: profile.avatar || '',
          addresses: profile.addresses,
          loyaltyPoints: 0,
          totalPointsEarned: 0,
          totalPointsRedeemed: 0,
          createdAt: nowIso,
          lastLoginAt: nowIso,
          updatedAt: nowIso,
        });
      }
    } catch (err) {
      // Surface permission errors via structured handler if not a transient offline state
      if (err instanceof Error && err.message.includes('Missing or insufficient permissions')) {
        handleFirestoreError(err, OperationType.WRITE, userPath);
      } else {
        console.warn('Firestore user profile sync warning (using cached profile):', err);
      }
    }

    return profile;
  }, []);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const synced = await syncUserProfile(fbUser);
          setUser(synced);
          localStorage.setItem('dejavu_customer_user', JSON.stringify(synced));
        } catch (err) {
          console.warn('Auth profile sync fallback:', err);
        }
      } else {
        // User signed out
        setUser(null);
        localStorage.removeItem('dejavu_customer_user');
      }
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, [syncUserProfile]);

  // Real Google Sign In via Firebase popup
  const loginWithGoogle = async (openDashboardAfter = true) => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const synced = await syncUserProfile(fbUser);
      setUser(synced);
      localStorage.setItem('dejavu_customer_user', JSON.stringify(synced));
      setIsAuthModalOpen(false);
      if (openDashboardAfter && !isCheckoutModalOpen) {
        setIsDashboardOpen(true);
      }
    } catch (err: unknown) {
      console.error('Google Sign In Error:', err);
      const message =
        err instanceof Error
          ? err.message
          : 'Google sign-in was interrupted. Please try again.';
      setAuthError(message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('SignOut error:', err);
    }
    setUser(null);
    localStorage.removeItem('dejavu_customer_user');
    setIsDashboardOpen(false);
  };

  // 7. Orders State (Synced locally + Firestore real-time listener)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('dejavu_orders');
      if (saved) return JSON.parse(saved);
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('dejavu_orders', JSON.stringify(orders));
  }, [orders]);

  // Attach Firestore orders listener ONLY once authReady and user is authenticated
  useEffect(() => {
    if (!authReady || !user?.id || !auth.currentUser || auth.currentUser.uid !== user.id) {
      return;
    }

    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', user.id));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const remoteOrders: Order[] = [];
        snapshot.forEach((docSnap) => {
          remoteOrders.push(docSnap.data() as Order);
        });
        setOrders((prev) => {
          const map = new Map<string, Order>();
          remoteOrders.forEach((o) => map.set(o.id, o));
          // Retain local orders belonging to this user or guest session
          prev.forEach((o) => {
            if (!map.has(o.id) && (!o.userId || o.userId === user.id || o.userId === 'guest')) {
              map.set(o.id, o);
            }
          });
          return Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      },
      (err) => {
        if (err.code === 'permission-denied') {
          handleFirestoreError(err, OperationType.LIST, 'orders');
        } else {
          console.warn('Firestore orders listener warning:', err);
        }
      }
    );

    return () => unsubscribe();
  }, [authReady, user?.id]);

  // Simulate kitchen progress on active orders & sync status cleanly
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prevOrders) => {
        let changed = false;
        const updated = prevOrders.map((ord) => {
          let nextStatus: Order['status'] | null = null;
          if (ord.status === 'placed') {
            nextStatus = 'grilling';
          } else if (ord.status === 'grilling' && Math.random() > 0.35) {
            nextStatus = 'out_for_delivery';
          } else if (ord.status === 'out_for_delivery' && Math.random() > 0.45) {
            nextStatus = 'delivered';
          }

          if (nextStatus) {
            changed = true;
            const nowIso = new Date().toISOString();
            if (auth.currentUser && ord.userId === auth.currentUser.uid) {
              updateDoc(doc(db, 'orders', ord.id), {
                status: nextStatus,
                updatedAt: nowIso,
              }).catch(() => {
                // Ignore if offline or doc only exists locally
              });
            }
            return { ...ord, status: nextStatus, updatedAt: nowIso };
          }
          return ord;
        });
        return changed ? updated : prevOrders;
      });
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  // Keep activeTrackingOrder synchronized
  useEffect(() => {
    if (activeTrackingOrder) {
      const match = orders.find((o) => o.id === activeTrackingOrder.id);
      if (match && (match.status !== activeTrackingOrder.status || match.rating !== activeTrackingOrder.rating)) {
        setActiveTrackingOrder(match);
      }
    }
  }, [orders, activeTrackingOrder]);

  // 8. Add to Cart with Flying Animation
  const addToCart = useCallback(
    (
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

        setFlyingItems((prev) => [
          ...prev,
          {
            id: flyId,
            startX,
            startY,
            targetX,
            targetY,
            image: item.image,
            name: item.name,
          },
        ]);

        setTimeout(() => {
          setFlyingItems((prev) => prev.filter((f) => f.id !== flyId));
          setIsCartWiggling(true);
          playCartChime();
          setTimeout(() => setIsCartWiggling(false), 700);
        }, 850);
      } else {
        setIsCartWiggling(true);
        playCartChime();
        setTimeout(() => setIsCartWiggling(false), 700);
      }

      setCart((prev) => {
        const existingIndex = prev.findIndex((c) => c.cartItemId === cartItemId);
        if (existingIndex > -1) {
          const copy = [...prev];
          const existing = copy[existingIndex];
          copy[existingIndex] = {
            ...existing,
            quantity: existing.quantity + 1,
            totalPrice: (existing.quantity + 1) * existing.unitPrice,
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
              totalPrice: effectivePrice,
            },
          ];
        }
      });
    },
    []
  );

  const updateQuantity = useCallback((cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((c) => {
          if (c.cartItemId === cartItemId) {
            const nextQty = c.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...c,
              quantity: nextQty,
              totalPrice: nextQty * c.unitPrice,
            };
          }
          return c;
        })
        .filter(Boolean) as CartItem[];
    });
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((c) => c.cartItemId !== cartItemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartSubtotal = cart.reduce((acc, curr) => acc + curr.totalPrice, 0);

  // Repeat any historical order with exact items, quantities, and delivery details
  const repeatOrder = useCallback((order: Order) => {
    if (!order.items || order.items.length === 0) return;

    // Restore order preferences
    if (order.orderType) {
      setOrderType(order.orderType);
    }
    if (order.area && order.orderType === 'delivery') {
      const matchedArea = KARACHI_AREAS.find((a) => a.id === order.area?.id) || order.area;
      setSelectedArea(matchedArea);
      localStorage.setItem('dejavu_selected_area', matchedArea.id);
    }
    if (order.deliveryAddress && order.orderType === 'delivery') {
      setCustomAddress(order.deliveryAddress);
      localStorage.setItem('dejavu_custom_address', order.deliveryAddress);
    }

    // Add every item with its exact quantity and portion into cart
    setCart((prev) => {
      const nextCart = [...prev];
      order.items.forEach((histItem) => {
        const freshMenuItem = MENU_ITEMS.find((m) => m.id === histItem.item.id) || histItem.item;
        const cartItemId = `${freshMenuItem.id}-${histItem.portion?.label || 'default'}`;
        const existingIdx = nextCart.findIndex((c) => c.cartItemId === cartItemId);

        if (existingIdx > -1) {
          const existing = nextCart[existingIdx];
          const updatedQty = existing.quantity + histItem.quantity;
          nextCart[existingIdx] = {
            ...existing,
            quantity: updatedQty,
            totalPrice: updatedQty * existing.unitPrice,
          };
        } else {
          nextCart.push({
            cartItemId,
            item: freshMenuItem,
            portion: histItem.portion,
            quantity: histItem.quantity,
            unitPrice: histItem.unitPrice,
            totalPrice: histItem.quantity * histItem.unitPrice,
          });
        }
      });
      return nextCart;
    });

    setIsCartWiggling(true);
    playCartChime();
    setTimeout(() => setIsCartWiggling(false), 700);
    setIsDashboardOpen(false);
    setIsCartDrawerOpen(true);
  }, []);

  // Submit Rating & Review on Past Order -> Saved to Firestore
  const submitOrderReview = useCallback(
    async (orderId: string, rating: number, reviewText: string) => {
      const clampedRating = Math.min(5, Math.max(1, Math.round(rating)));
      const cleanReview = sanitizeString(reviewText, 500);
      const nowIso = new Date().toISOString();

      // Update local state immediately for snappy UX
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId
            ? {
                ...ord,
                rating: clampedRating,
                review: cleanReview,
                reviewedAt: nowIso,
                updatedAt: nowIso,
              }
            : ord
        )
      );

      // Persist to Firestore if user is authenticated
      if (auth.currentUser) {
        const orderPath = `orders/${orderId}`;
        try {
          await updateDoc(doc(db, 'orders', orderId), {
            rating: clampedRating,
            review: cleanReview,
            reviewedAt: nowIso,
            updatedAt: nowIso,
          });
        } catch (err) {
          if (err instanceof Error && err.message.includes('Missing or insufficient permissions')) {
            handleFirestoreError(err, OperationType.UPDATE, orderPath);
          } else {
            console.warn('Could not persist review to Firestore:', err);
          }
        }
      }
    },
    []
  );

  // 9. GPS Location Detection
  const detectCurrentLocation = async (): Promise<string> => {
    setIsDetectingLocation(true);
    setLocationError(null);

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setIsDetectingLocation(false);
        setLocationError('Geolocation is not supported by your browser.');
        resolve(selectedArea.name);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsDetectingLocation(false);
          const { latitude, longitude } = position.coords;

          let closest = KARACHI_AREAS[0];
          let minDistance = 999999;

          KARACHI_AREAS.forEach((area) => {
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
          let msg = 'Could not detect GPS location. Selected Gulistan-e-Johar.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location permission denied. Please select your area manually.';
          }
          setLocationError(msg);
          resolve(selectedArea.name);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  };

  // 10. Place Order Handler with Loyalty Points Earn & Redeem + Firestore Persistence
  const placeOrder = async (orderData: PlaceOrderPayload): Promise<Order> => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const nowIso = new Date().toISOString();
    const orderId = 'ord_' + Date.now();
    const activeUid = auth.currentUser?.uid || user?.id;

    // Loyalty calculation (1 Point = Rs. 10 Discount; Earn 1 Point per Rs. 100 spent)
    const maxRedeemableForCart = Math.floor(cartSubtotal / LOYALTY_POINT_VALUE_RS);
    const requestedRedeem = Math.max(0, Math.floor(orderData.pointsToRedeem || 0));
    const pointsRedeemed =
      user && activeUid
        ? Math.min(user.loyaltyPoints || 0, requestedRedeem, maxRedeemableForCart)
        : 0;
    const loyaltyDiscount = pointsRedeemed * LOYALTY_POINT_VALUE_RS;
    const discountedSubtotal = Math.max(0, cartSubtotal - loyaltyDiscount);
    const finalTotal = discountedSubtotal + deliveryFee;
    const pointsEarned =
      user && activeUid ? Math.max(1, Math.floor(discountedSubtotal / LOYALTY_EARN_RATE_RS)) : 0;

    const cleanAddress = sanitizeString(
      orderData.deliveryAddress || customAddress || selectedArea.name,
      300
    );
    const cleanPhone = sanitizeString(orderData.customerPhone || user?.phone || '0325-9111555', 30);
    const cleanName = sanitizeString(orderData.customerName || user?.name || 'Valued Guest', 100);

    const newOrder: Order = {
      id: orderId,
      orderNumber: `DV-${randomCode}`,
      createdAt: nowIso,
      updatedAt: nowIso,
      items: cart.slice(0, 50),
      orderType,
      area: selectedArea,
      deliveryFee,
      subtotal: cartSubtotal,
      loyaltyDiscount,
      pointsRedeemed,
      pointsEarned,
      total: finalTotal,
      status: 'placed',
      customerName: cleanName,
      customerPhone: cleanPhone,
      deliveryAddress: cleanAddress,
      tableNumber: sanitizeString(orderData.tableNumber || tableNumber, 50),
      specialNotes: sanitizeString(orderData.specialNotes, 500),
      paymentMethod: orderData.paymentMethod || 'cod',
      estimatedDeliveryMinutes: selectedArea.estimatedMinutes || 35,
      userId: activeUid || 'guest',
      customerEmail: sanitizeString(user?.email, 150),
    };

    // Build clean Firestore document matching firestore.rules allowlist
    const firestoreOrderDoc = {
      id: newOrder.id,
      userId: newOrder.userId,
      orderNumber: newOrder.orderNumber,
      customerName: newOrder.customerName,
      customerEmail: newOrder.customerEmail || '',
      customerPhone: newOrder.customerPhone,
      deliveryAddress: newOrder.deliveryAddress,
      tableNumber: newOrder.tableNumber || '',
      specialNotes: newOrder.specialNotes || '',
      orderType: newOrder.orderType,
      area: {
        id: selectedArea.id,
        name: selectedArea.name,
        distanceKm: selectedArea.distanceKm,
        deliveryFee: selectedArea.deliveryFee,
        estimatedMinutes: selectedArea.estimatedMinutes,
      },
      subtotal: newOrder.subtotal,
      deliveryFee: newOrder.deliveryFee,
      loyaltyDiscount: newOrder.loyaltyDiscount || 0,
      pointsRedeemed: newOrder.pointsRedeemed || 0,
      pointsEarned: newOrder.pointsEarned || 0,
      total: newOrder.total,
      status: newOrder.status,
      paymentMethod: newOrder.paymentMethod,
      estimatedDeliveryMinutes: newOrder.estimatedDeliveryMinutes,
      createdAt: newOrder.createdAt,
      updatedAt: nowIso,
      items: newOrder.items.map((ci) => ({
        cartItemId: ci.cartItemId,
        quantity: ci.quantity,
        unitPrice: ci.unitPrice,
        totalPrice: ci.totalPrice,
        ...(ci.portion ? { portion: ci.portion } : {}),
        item: {
          id: ci.item.id,
          name: ci.item.name,
          category: ci.item.category,
          price: ci.item.price,
          image: ci.item.image,
        },
      })),
    };

    try {
      if (auth.currentUser && user && activeUid === auth.currentUser.uid) {
        const nextBalance = Math.max(0, (user.loyaltyPoints || 0) - pointsRedeemed + pointsEarned);
        const nextEarned = (user.totalPointsEarned || 0) + pointsEarned;
        const nextRedeemed = (user.totalPointsRedeemed || 0) + pointsRedeemed;
        const updatedAddresses =
          orderType === 'delivery' && cleanAddress && !user.addresses.includes(cleanAddress)
            ? [cleanAddress, ...user.addresses].slice(0, 10)
            : user.addresses.slice(0, 10);

        const batch = writeBatch(db);
        batch.set(doc(db, 'orders', newOrder.id), firestoreOrderDoc);
        batch.update(doc(db, 'users', activeUid), {
          phone: cleanPhone,
          addresses: updatedAddresses,
          loyaltyPoints: nextBalance,
          totalPointsEarned: nextEarned,
          totalPointsRedeemed: nextRedeemed,
          updatedAt: nowIso,
        });
        await batch.commit();

        const updatedUser: CustomerUser = {
          ...user,
          phone: cleanPhone,
          addresses: updatedAddresses,
          loyaltyPoints: nextBalance,
          totalPointsEarned: nextEarned,
          totalPointsRedeemed: nextRedeemed,
        };
        setUser(updatedUser);
        localStorage.setItem('dejavu_customer_user', JSON.stringify(updatedUser));
      } else {
        await setDoc(doc(db, 'orders', newOrder.id), firestoreOrderDoc);
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('Missing or insufficient permissions')) {
        handleFirestoreError(err, OperationType.WRITE, `orders/${newOrder.id}`);
      } else {
        console.warn('Firestore order save warning (order saved locally):', err);
      }
    }

    setOrders((prev) => [newOrder, ...prev]);
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
        authReady,
        isAuthLoading,
        authError,
        loginWithGoogle,
        logout,
        orders,
        placeOrder,
        repeatOrder,
        submitOrderReview,
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
