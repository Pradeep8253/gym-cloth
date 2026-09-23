import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // UI State
      isCartOpen: false,
      isMobileMenuOpen: false,
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      
      // Wishlist State
      isWishlistOpen: false,
      setWishlistOpen: (isOpen) => set({ isWishlistOpen: isOpen }),
      wishlistItems: [],
      toggleWishlist: (product) => set((state) => {
        const isWishlisted = state.wishlistItems.some(item => item.id === product.id || item.slug === product.slug);
        if (isWishlisted) {
          return { wishlistItems: state.wishlistItems.filter(item => item.id !== product.id && item.slug !== product.slug) };
        } else {
          return { wishlistItems: [...state.wishlistItems, product] };
        }
      }),
      
      // Cart State
      cartItems: [],
      
      addToCart: (product, quantity = 1, size, color) => set((state) => {
        const existingItemIndex = state.cartItems.findIndex(
          item => item.id === product.id && item.size === size && item.color === color
        );
        
        if (existingItemIndex > -1) {
          const newItems = [...state.cartItems];
          newItems[existingItemIndex].quantity += quantity;
          return { cartItems: newItems, isCartOpen: true };
        }
        
        return { 
          cartItems: [...state.cartItems, { ...product, quantity, size, color }],
          isCartOpen: true 
        };
      }),
      
      removeFromCart: (index) => set((state) => {
        const newItems = [...state.cartItems];
        newItems.splice(index, 1);
        return { cartItems: newItems };
      }),
      
      updateQuantity: (index, quantity) => set((state) => {
        if (quantity < 1) return state;
        const newItems = [...state.cartItems];
        newItems[index].quantity = quantity;
        return { cartItems: newItems };
      }),
      
      getCartTotal: () => {
        const state = get();
        return state.cartItems.reduce((total, item) => total + (item.salePrice || item.price) * item.quantity, 0);
      }
    }),
    {
      name: 'volt-athletics-storage',
      partialize: (state) => ({ cartItems: state.cartItems, wishlistItems: state.wishlistItems }), // Only persist cart and wishlist items
    }
  )
);

export default useStore;
