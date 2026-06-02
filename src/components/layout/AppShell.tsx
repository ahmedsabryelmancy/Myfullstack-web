import { Outlet } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import { CartProvider } from "../../context/CartContext";
import { WishlistProvider } from "../../context/WishlistContext";
import { catalogCategoryLinks } from "../../data/site";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileBottomNav } from "./MobileBottomNav";

export function AppShell() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Header categories={catalogCategoryLinks} />
          <main>
            <Outlet />
          </main>
          <Footer />
          <MobileBottomNav />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
