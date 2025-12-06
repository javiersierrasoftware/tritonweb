"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const toggleProfileMenu = () => setMenuOpen(!menuOpen);

  const toggleCart = useCartStore((state) => state.toggleCart);
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.qty, 0);

  /* ------------------------- LEER SESIÓN ------------------------- */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    const syncLogout = () => {
      const updated = localStorage.getItem("user");
      setUser(updated ? JSON.parse(updated) : null);
    };

    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  /* ---------------------- CERRAR MENÚ CLICK AFUERA ---------------------- */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  /* ------------------------- LOGOUT ------------------------- */
  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0;";
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/60 backdrop-blur-xl border-b border-white/10 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 relative">
            <Image
              src="/tritontransparente.png"
              alt="TRITON Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-gray-300 text-sm">@triton_runningclub</span>
        </div>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <NavLinks />

          {/* CARRITO */}
          <button
            onClick={toggleCart}
            className="relative hover:text-cyan-300 transition"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-br from-cyan-300 to-orange-300 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* SESIÓN */}
          {!user ? (
            <Link
              href="/login"
              className="bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-semibold px-5 py-1.5 rounded-full"
            >
              Ingresar
            </Link>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={toggleProfileMenu}
                className="flex items-center gap-2"
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-bold flex items-center justify-center">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={18} className="text-gray-300" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#111] border border-white/10 rounded-xl shadow-lg z-40 overflow-hidden">

                  <Link
                    href="/perfil"
                    className="block px-4 py-3 text-sm hover:bg-white/10 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>

                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 text-sm hover:bg-white/10 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>

                  {user.role === "ADMIN" && (
                    <Link
                      href="/stories/create"
                      className="block px-4 py-3 text-sm hover:bg-white/10 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      Crear historia
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ICONOS MOBILE */}
        <div className="flex md:hidden items-center gap-4">
          <button onClick={toggleCart} className="relative">
            <ShoppingCart size={22} className="text-white" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-br from-cyan-300 to-orange-300 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button onClick={toggleMobile}>
            {mobileOpen ? (
              <X size={26} className="text-white" />
            ) : (
              <Menu size={26} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* DRAWER MOBILE */}
      <div
        className={`fixed top-0 right-0 w-60 h-full bg-[#0d0d0d] border-l border-white/10 shadow-xl transform transition-transform duration-300 z-40 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b border-white/10">
          <span className="text-lg font-bold">Menú</span>
          <button onClick={toggleMobile}>
            <X size={26} className="text-gray-300" />
          </button>
        </div>

        <div className="flex flex-col p-5 space-y-5 text-sm">
          <MobileLink href="/" onClick={toggleMobile}>Inicio</MobileLink>

          {/* 👉 AHORA DIRIGE A /stories */}
          <MobileLink href="/stories" onClick={toggleMobile}>
            Comunidad
          </MobileLink>

          <MobileLink href="/entrenamiento" onClick={toggleMobile}>Entrenamiento</MobileLink>
          <MobileLink href="/events" onClick={toggleMobile}>Eventos</MobileLink>
          <MobileLink href="/tienda" onClick={toggleMobile}>Tienda</MobileLink>

          {!user ? (
            <Link
              href="/join"
              onClick={toggleMobile}
              className="bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-semibold px-4 py-2 rounded-full text-center"
            >
              Unirme al Club
            </Link>
          ) : (
            <>
              <MobileLink href="/dashboard" onClick={toggleMobile}>
                Dashboard
              </MobileLink>

              {user.role === "ADMIN" && (
                <MobileLink href="/stories/create" onClick={toggleMobile}>
                  Crear historia
                </MobileLink>
              )}

              <button
                onClick={handleLogout}
                className="text-red-400 text-left"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

/* --------------------- LINKS DESKTOP --------------------- */
function NavLinks() {
  return (
    <>
      <Link href="/" className="hover:text-cyan-300 transition">Inicio</Link>

      {/* 👉 AHORA DIRIGE A /stories */}
      <Link href="/stories" className="hover:text-cyan-300 transition">
        Comunidad
      </Link>

      <Link href="/entrenamiento" className="hover:text-cyan-300 transition">
        Entrenamiento
      </Link>
      <Link href="/events" className="hover:text-cyan-300 transition">
        Eventos
      </Link>
      <Link href="/tienda" className="hover:text-cyan-300 transition">
        Tienda
      </Link>
    </>
  );
}

/* --------------------- LINK MOBILE --------------------- */
function MobileLink({ href, children, onClick }: any) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-gray-300 hover:text-white transition"
    >
      {children}
    </Link>
  );
}