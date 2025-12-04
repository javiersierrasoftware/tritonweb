"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const toggleCart = useCartStore((state) => state.toggleCart);
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/60 backdrop-blur-xl border-b border-white/10 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">

        {/* LOGO + INSTAGRAM */}
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

        {/* DESKTOP MENU */}
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

          {/* LOGIN */}
          <Link
            href="/login"
            className="bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-semibold px-5 py-1.5 rounded-full"
          >
            Ingresar
          </Link>
        </div>

        {/* MOBILE ICONS */}
        <div className="flex md:hidden items-center gap-4">

          {/* CARRITO */}
          <button onClick={toggleCart} className="relative">
            <ShoppingCart size={22} className="text-white" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-br from-cyan-300 to-orange-300 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* HAMBURGER */}
          <button onClick={toggleMobile}>
            {mobileOpen ? (
              <X size={26} className="text-white" />
            ) : (
              <Menu size={26} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
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
          <MobileLink href="/#comunidad" onClick={toggleMobile}>Comunidad</MobileLink>
          <MobileLink href="/entrenamiento" onClick={toggleMobile}>Entrenamiento</MobileLink>
          <MobileLink href="/events" onClick={toggleMobile}>Eventos</MobileLink>
          <MobileLink href="/tienda" onClick={toggleMobile}>Tienda</MobileLink>

          {/* BOTÓN UNIRME */}
          <Link
            href="/join"
            onClick={toggleMobile}
            className="bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-semibold px-4 py-2 rounded-full text-center"
          >
            Unirme al Club
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* LINKS DESKTOP */
function NavLinks() {
  return (
    <>
      <Link href="/" className="hover:text-cyan-300 transition">Inicio</Link>

      {/* Comunidaad → ahora lleva a la sección del home */}
      <Link href="/#comunidad" className="hover:text-cyan-300 transition">
        Comunidad
      </Link>

      <Link href="/entrenamiento" className="hover:text-cyan-300 transition">
        Entrenamiento
      </Link>

      <Link href="/events" className="hover:text-cyan-300 transition">Eventos</Link>
      <Link href="/tienda" className="hover:text-cyan-300 transition">Tienda</Link>
    </>
  );
}

/* LINKS PARA EL MENÚ MÓVIL */
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