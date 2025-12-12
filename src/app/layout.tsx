import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/store/CartSidebar";
import Footer from "@/components/Footer";
import Providers from "./providers"; // Import the new Providers component

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
        <Providers> {/* Use the new Providers component */}
          <Navbar />

          {/* Contenido de la página */}
          <div className="pt-20">{children}</div>

          {/* 🔥 CARRITO GLOBAL: aparece en TODA LA APP */}
          <CartSidebar />
          <Footer />
        </Providers> {/* Close Providers */}
      </body>
    </html>
  );
}