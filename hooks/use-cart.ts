"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "@/lib/types"
import { SHIPPING_COST, TAX_RATE, FREE_SHIPPING_THRESHOLD } from "@/lib/constants"

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getSubtotal: () => number
  getTax: () => number
  getShipping: () => number
  getTotal: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items
        const existingItem = items.find((i) => i.productId === item.productId && i.weight === item.weight)

        if (existingItem) {
          set({
            items: items.map((i) => (i.id === existingItem.id ? { ...i, quantity: i.quantity + item.quantity } : i)),
          })
        } else {
          const newItem: CartItem = {
            ...item,
            id: `${item.productId}-${item.weight}-${Date.now()}`,
          }
          set({ items: [...items, newItem] })
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((item) => item.id !== itemId) })
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        set({
          items: get().items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
        })
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getTax: () => {
        return get().getSubtotal() * TAX_RATE
      },

      getShipping: () => {
        const subtotal = get().getSubtotal()
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
      },

      getTotal: () => {
        return get().getSubtotal() + get().getTax() + get().getShipping()
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
