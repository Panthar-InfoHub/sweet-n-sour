
import { CartContent } from "@/components/cart/cart-content";

export default function CartPage() {
  return (
    <main className="min-h-screen py-8">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>
        <CartContent />
      </div>
    </main>
  );
}
