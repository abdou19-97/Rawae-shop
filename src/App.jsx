import React, { useState, useEffect } from "react";
import { CartProvider, useCart } from "./contexts/CartContext";
import { ProductProvider } from "./contexts/ProductContext";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import ProductList from "./components/ProductList";
import CartSidebar from "./components/CartSidebar";
import QuickView from "./components/QuickView";
import FloatingContact from "./components/FloatingContact";
import PaymentMethods from "./components/PaymentMethods";
import HamburgerMenu from "./components/HamburgerMenu";
import SubcategoryGrid from "./components/SubcategoryGrid";
import ProductDetail from "./components/ProductDetail";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./components/AdminLogin";

function AppContent() {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickId, setQuickId] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [lang, setLang] = useState("en");
  const [view, setView] = useState({ type: "home" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { add } = useCart();

  // Check if we're on admin route
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path === "/admin" || hash === "#/admin") {
        setIsAdmin(true);
        // Check if already logged in
        const auth = localStorage.getItem("rawae_admin_auth");
        if (auth === "true") {
          setIsLoggedIn(true);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminRoute();
    window.addEventListener("popstate", checkAdminRoute);
    window.addEventListener("hashchange", checkAdminRoute);

    return () => {
      window.removeEventListener("popstate", checkAdminRoute);
      window.removeEventListener("hashchange", checkAdminRoute);
    };
  }, []);

  // Handle product detail hash
  useEffect(() => {
    if (!isAdmin) {
      const hash = window.location.hash;
      if (hash.startsWith("#product-")) {
        const id = hash.replace("#product-", "");
        setDetailId(id);
      }
    }
  }, [isAdmin]);

  function handleNavigate(type, categoryId, subcategoryId) {
    if (type === "home") {
      setView({ type: "home" });
    } else if (type === "category") {
      setView({ type: "category", categoryId });
    } else if (type === "subcategory") {
      setView({ type: "subcategory", categoryId, subcategoryId });
    }
  }

  function handleAdd(id, qty = 1) {
    add(id, qty);
    setCartOpen(true);
  }

  function handleRegisterInterest(id) {
    const list = JSON.parse(localStorage.getItem("interest") || "[]");
    list.push({ id, at: Date.now() });
    localStorage.setItem("interest", JSON.stringify(list));
    const messages = {
      en: "Registered interest — we will notify you",
      ar: "تم التسجيل - سنبلغك عند توفر المنتج",
      fr: "Intérêt enregistré — nous vous informerons",
    };
    alert(messages[lang]);
  }

  // Admin Panel View
  if (isAdmin) {
    if (!isLoggedIn) {
      return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
    }
    return (
      <AdminPanel
        onLogout={() => {
          setIsLoggedIn(false);
          localStorage.removeItem("rawae_admin_auth");
          window.location.href = "/";
        }}
      />
    );
  }

  // Regular Site View
  return (
    <div
      className={lang === "ar" ? "rtl" : ""}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenMenu={() => setMenuOpen(true)}
        lang={lang}
        setLang={setLang}
      />

      <HamburgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={handleNavigate}
        lang={lang}
      />

      <main className="min-h-screen pt-4">
        {view.type === "home" && (
          <HomePage
            onAdd={handleAdd}
            onQuickView={(id) => setDetailId(id)}
            onRegisterInterest={handleRegisterInterest}
            lang={lang}
          />
        )}

        {view.type === "category" && (
          <>
            <div className="max-w-6xl mx-auto px-4 mb-4">
              <button
                onClick={() => handleNavigate("home")}
                className="text-sm text-pink-600 hover:underline"
              >
                ‹{" "}
                {lang === "ar"
                  ? "العودة للرئيسية"
                  : lang === "fr"
                  ? "Retour à l'Accueil"
                  : "Back to Home"}
              </button>
            </div>
            <SubcategoryGrid
              categoryId={view.categoryId}
              onNavigate={handleNavigate}
              lang={lang}
            />
          </>
        )}

        {view.type === "subcategory" && (
          <>
            <div className="max-w-6xl mx-auto px-4 mb-4 flex gap-3">
              <button
                onClick={() => handleNavigate("home")}
                className="text-sm text-pink-600 hover:underline"
              >
                {lang === "ar"
                  ? "الرئيسية"
                  : lang === "fr"
                  ? "Accueil"
                  : "Home"}
              </button>
              <span>›</span>
              <button
                onClick={() => handleNavigate("category", view.categoryId)}
                className="text-sm text-pink-600 hover:underline"
              >
                {lang === "ar"
                  ? "العودة للتصنيف"
                  : lang === "fr"
                  ? "Retour à la Catégorie"
                  : "Back to Category"}
              </button>
            </div>
            <ProductList
              onAdd={handleAdd}
              onQuickView={(id) => setDetailId(id)}
              onRegisterInterest={handleRegisterInterest}
              categoryId={view.categoryId}
              subcategoryId={view.subcategoryId}
              lang={lang}
            />
          </>
        )}

        <PaymentMethods />
      </main>

      <Footer lang={lang} />

      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        lang={lang}
      />

      <ProductDetail
        productId={detailId}
        onClose={() => setDetailId(null)}
        onAdd={handleAdd}
        lang={lang}
      />

      <FloatingContact phone="222123456" />
    </div>
  );
}

export default function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ProductProvider>
  );
}
