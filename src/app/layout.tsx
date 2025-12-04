import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/store/CartSidebar";
import Footer from "@/components/Footer";


export const metadata: Metadata = {
  title: "TRITONWEB",
  description: "Plataforma del Club Deportivo TRITON",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-black text-white">
        <Navbar />

        {/* Contenido de la página */}
        <div className="pt-20">{children}</div>

        {/* 🔥 CARRITO GLOBAL: aparece en TODA LA APP */}
        <CartSidebar />
        <div className="pt-20">{children}</div>
  <Footer />
      </body>
    </html>
  );
}