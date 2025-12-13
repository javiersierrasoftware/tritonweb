"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

type UserSession = {
  name?: string;
  role?: string;
  [key: string]: any;
} | null;

type AdminSection = "historias" | "eventos" | "tienda" | "hero" | null;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<UserSession>(null);
  const [adminOpen, setAdminOpen] = useState<AdminSection>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleMobile = () => setMobileOpen((v) => !v);
  const toggleProfileMenu = () => setMenuOpen((v) => !v);

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

  /* ---------------------- CERRAR MENÚ CLICK AFUERA (DESKTOP PERFIL) ---------------------- */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  /* ---------------------- BLOQUEAR SCROLL CUANDO MENÚ MÓVIL ABIERTO ---------------------- */
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  /* ------------------------- LOGOUT ------------------------- */
  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0;";
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    setMobileOpen(false);
    setAdminOpen(null);
    router.push("/login");
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setAdminOpen(null);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/60 backdrop-blur-xl border-b border-gray-800 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 relative">
            <Image
              src="/tritontransparente.png"
              alt="TRITON Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-gray-300 text-sm">TRITON running club</span>
        </Link>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <NavLinks />

          {/* CARRITO */}
          <button
            onClick={toggleCart}
            className="relative hover:text-cyan-300 transition text-gray-200"
            aria-label="Abrir carrito"
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
                aria-label="Abrir menú de perfil"
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-bold flex items-center justify-center">
                  {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
                <ChevronDown size={18} className="text-gray-300" />
              </button>

              {/* ---------- MENU DESPLEGABLE ---------- */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#111] border border-gray-800 rounded-xl shadow-lg z-50 overflow-hidden">
                  <Link
                    href="/perfil"
                    className="block px-4 py-3 text-sm hover:bg-white/10 transition text-gray-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>

                  {/* ---------- ADMIN ---------- */}
                  {user?.role === "ADMIN" && (
                    <div className="border-t border-gray-800">
                      <div className="px-4 pt-3 pb-2 text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                        Administración
                      </div>

                      <div className="px-2 pb-2">
                        <div className="px-2 py-2 text-[11px] uppercase tracking-wider text-gray-500">
                          Historias
                        </div>
                        <Link
                          href="/stories/create"
                          className="block px-4 py-2 text-sm hover:bg-white/10 transition text-gray-200 rounded-lg"
                          onClick={() => setMenuOpen(false)}
                        >
                          Crear historia
                        </Link>
                        <Link
                          href="/stories/manage"
                          className="block px-4 py-2 text-sm hover:bg-white/10 transition text-gray-200 rounded-lg"
                          onClick={() => setMenuOpen(false)}
                        >
                          Gestionar historias
                        </Link>

                        <div className="px-2 pt-3 pb-2 text-[11px] uppercase tracking-wider text-gray-500">
                          Eventos
                        </div>
                        <Link
                          href="/events/create"
                          className="block px-4 py-2 text-sm hover:bg-white/10 transition text-gray-200 rounded-lg"
                          onClick={() => setMenuOpen(false)}
                        >
                          Crear evento
                        </Link>
                        <Link
                          href="/events/manage"
                          className="block px-4 py-2 text-sm hover:bg-white/10 transition text-gray-200 rounded-lg"
                          onClick={() => setMenuOpen(false)}
                        >
                          Gestionar eventos
                        </Link>

                        <div className="px-2 pt-3 pb-2 text-[11px] uppercase tracking-wider text-gray-500">
                          Tienda
                        </div>
                        <Link
                          href="/admin/products/create"
                          className="block px-4 py-2 text-sm hover:bg-white/10 transition text-gray-200 rounded-lg"
                          onClick={() => setMenuOpen(false)}
                        >
                          Crear producto
                        </Link>
                        <Link
                          href="/admin/products/manage"
                          className="block px-4 py-2 text-sm hover:bg-white/10 transition text-gray-200 rounded-lg"
                          onClick={() => setMenuOpen(false)}
                        >
                          Gestionar productos
                        </Link>
                        <Link
                          href="/admin/sales"
                          className="block px-4 py-2 text-sm hover:bg-white/10 transition text-gray-200 rounded-lg"
                          onClick={() => setMenuOpen(false)}
                        >
                          Ventas realizadas
                        </Link>

                        <div className="px-2 pt-3 pb-2 text-[11px] uppercase tracking-wider text-gray-500">
                          Hero Slider
                        </div>
                        <Link
                          href="/admin/hero-slider"
                          className="block px-4 py-2 text-sm hover:bg-white/10 transition text-gray-200 rounded-lg"
                          onClick={() => setMenuOpen(false)}
                        >
                          Gestionar Hero Slider
                        </Link>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition border-t border-gray-800"
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
          <button onClick={toggleCart} className="relative" aria-label="Abrir carrito">
            <ShoppingCart size={22} className="text-white" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-br from-cyan-300 to-orange-300 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button onClick={toggleMobile} aria-label="Abrir menú">
            {mobileOpen ? <X size={26} className="text-white" /> : <Menu size={26} className="text-white" />}
          </button>
        </div>
      </div>

      {/* OVERLAY */}
      {mobileOpen && (
        <button
          aria-label="Cerrar menú"
          onClick={closeMobile}
          className="fixed inset-0 bg-black/60 z-[55] md:hidden"
        />
      )}

      {/* DRAWER MOBILE */}
      <div
        className={`fixed top-0 right-0 w-80 max-w-[88vw] h-dvh bg-[#0b0b0b]/95 backdrop-blur-xl border-l border-gray-800 shadow-2xl transform transition-transform duration-300 z-[60] md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <span className="text-lg font-bold text-white">Menú</span>
          <button onClick={closeMobile} aria-label="Cerrar menú">
            <X size={26} className="text-gray-300" />
          </button>
        </div>

        <div className="flex flex-col p-5 text-sm">
          {/* Links principales (UNO DEBAJO DEL OTRO) */}
          <div className="flex flex-col gap-4">
            <MobileLink href="/" onClick={closeMobile}>Inicio</MobileLink>
            <MobileLink href="/stories" onClick={closeMobile}>Comunidad</MobileLink>
            <MobileLink href="/entrenamiento" onClick={closeMobile}>Entrenamiento</MobileLink>
            <MobileLink href="/events" onClick={closeMobile}>Eventos</MobileLink>
            <MobileLink href="/tienda" onClick={closeMobile}>Tienda</MobileLink>
          </div>

          <div className="my-5 border-t border-gray-800" />

          {/* Sesión */}
          {!user ? (
            <Link
              href="/login"
              onClick={closeMobile}
              className="bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-semibold px-4 py-2 rounded-full text-center"
            >
              Ingresar
            </Link>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                <MobileLink href="/perfil" onClick={closeMobile}>Mi Perfil</MobileLink>
              </div>

              {/* ADMIN: ACORDEÓN */}
              {user?.role === "ADMIN" && (
                <>
                  <div className="mt-5 mb-3 border-t border-gray-800" />
                  <div className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2">
                    Administración
                  </div>

                  <MobileSection
                    title="Historias"
                    open={adminOpen === "historias"}
                    onToggle={() => setAdminOpen((v) => (v === "historias" ? null : "historias"))}
                  >
                    <MobileAdminLink href="/stories/create" onClick={closeMobile}>
                      Crear historia
                    </MobileAdminLink>
                    <MobileAdminLink href="/stories/manage" onClick={closeMobile}>
                      Gestionar historias
                    </MobileAdminLink>
                  </MobileSection>

                  <MobileSection
                    title="Eventos"
                    open={adminOpen === "eventos"}
                    onToggle={() => setAdminOpen((v) => (v === "eventos" ? null : "eventos"))}
                  >
                    <MobileAdminLink href="/events/create" onClick={closeMobile}>
                      Crear evento
                    </MobileAdminLink>
                    <MobileAdminLink href="/events/manage" onClick={closeMobile}>
                      Gestionar eventos
                    </MobileAdminLink>
                  </MobileSection>

                  <MobileSection
                    title="Tienda"
                    open={adminOpen === "tienda"}
                    onToggle={() => setAdminOpen((v) => (v === "tienda" ? null : "tienda"))}
                  >
                    <MobileAdminLink href="/admin/products/create" onClick={closeMobile}>
                      Crear producto
                    </MobileAdminLink>
                    <MobileAdminLink href="/admin/products/manage" onClick={closeMobile}>
                      Gestionar productos
                    </MobileAdminLink>
                    <MobileAdminLink href="/admin/sales" onClick={closeMobile}>
                      Ventas realizadas
                    </MobileAdminLink>
                  </MobileSection>

                  <MobileSection
                    title="Hero Slider"
                    open={adminOpen === "hero"}
                    onToggle={() => setAdminOpen((v) => (v === "hero" ? null : "hero"))}
                  >
                    <MobileAdminLink href="/admin/hero-slider" onClick={closeMobile}>
                      Gestionar Hero Slider
                    </MobileAdminLink>
                  </MobileSection>
                </>
              )}

              <button onClick={handleLogout} className="mt-6 text-red-400 text-left">
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
      <Link href="/" className="text-gray-300 hover:text-cyan-300 transition">Inicio</Link>
      <Link href="/stories" className="text-gray-300 hover:text-cyan-300 transition">Comunidad</Link>
      <Link href="/entrenamiento" className="text-gray-300 hover:text-cyan-300 transition">Entrenamiento</Link>
      <Link href="/events" className="text-gray-300 hover:text-cyan-300 transition">Eventos</Link>
      <Link href="/tienda" className="text-gray-300 hover:text-cyan-300 transition">Tienda</Link>
    </>
  );
}

/* --------------------- LINK MOBILE (AHORA BLOCK PARA QUE NO SE PEGUEN) --------------------- */
function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block text-gray-100 hover:text-cyan-300 transition"
    >
      {children}
    </Link>
  );
}

/* --------------------- SECCIÓN COLAPSABLE (MOBILE ADMIN) --------------------- */
function MobileSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-2">
      <button onClick={onToggle} className="w-full flex items-center justify-between py-2 text-left">
        <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-2 space-y-2 pl-3 border-l border-gray-800">
          {children}
        </div>
      )}
    </div>
  );
}

/* --------------------- LINK ADMIN (MOBILE) --------------------- */
function MobileAdminLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block text-gray-100 hover:text-cyan-300 transition py-1"
    >
      {children}
    </Link>
  );
}