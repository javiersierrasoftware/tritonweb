import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/store/CartSidebar";
import Footer from "@/components/Footer";
import Providers from "./providers"; // Import the new Providers component

export const metadata: Metadata = {
  title: "TRITON | Club Deportivo - Alto Rendimiento y Entrenamiento",
  description: "Plataforma oficial del Club Deportivo TRITON. Entrenamiento de alto rendimiento, inscripciones, tienda deportiva y seguimiento de atletas.",
  keywords: ["TRITON", "Club Deportivo", "Natación", "Entrenamiento", "Alto Rendimiento", "Deporte", "Triton Web", "Inscripciones deportivas", "Club de Natación"],
  authors: [{ name: "TRITON Club" }],
  openGraph: {
    title: "TRITON | Club Deportivo",
    description: "Únete al Club Deportivo TRITON. Excelencia en natación y entrenamiento deportivo.",
    url: "https://tritonweb.vercel.app",
    siteName: "TRITON Club",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/tritontransparente.png",
        width: 800,
        height: 600,
        alt: "Logo TRITON Club Deportivo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TRITON | Club Deportivo",
    description: "Entrenamiento de alto rendimiento y comunidad deportiva.",
    images: ["/tritontransparente.png"],
  },
  icons: {
    icon: "/tritontransparente.png",
    shortcut: "/tritontransparente.png",
    apple: "/tritontransparente.png",
  },
  robots: {
    index: true,
    follow: true,
  },
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