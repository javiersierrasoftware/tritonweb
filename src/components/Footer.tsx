import { Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#0d0d0d] border-t border-white/10 py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-8">

        {/* CONTACTO */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Contacto</h3>
          <p className="text-gray-400 text-sm">WhatsApp: +57 321 4457170</p>
          <p className="text-gray-400 text-sm">Sincelejo, Sucre – Colombia</p>
        </div>

        {/* REDES */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Síguenos</h3>

          <Link
            href="https://instagram.com/triton_runningclub"
            target="_blank"
            className="flex items-center gap-2 text-gray-300 hover:text-cyan-300 transition"
          >
            <Instagram size={20} />
            @triton_runningclub
          </Link>
        </div>

        {/* CREDITO */}
        <div className="text-gray-400 text-sm">
          <p>Diseñado y desarrollado por</p>
          <p className="font-semibold text-white">TICSOFT S.A.S.</p>
          <Link
            href="https://www.ticsoft.co"
            target="_blank"
            className="hover:text-cyan-300 transition text-sm"
          >
            www.ticsoft.co
          </Link>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} TRITON Running Club — Todos los derechos reservados.
      </div>
    </footer>
  );
}