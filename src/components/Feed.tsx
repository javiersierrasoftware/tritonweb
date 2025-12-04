"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { FEED } from "@/data/feed";

export default function Feed() {
  return (
    <section>
      {/* WRAPPER GLOBAL – MISMO QUE EVENTOS */}
      <div className="max-w-6xl mx-auto px-4">

        {/* TITULO + LOGO */}
        <div className="flex items-start gap-3 mb-6">
          <img
            src="/tritontransparente.png"
            alt="logo"
            className="h-7 w-7 object-contain"
          />
          <div>
            <h2 className="text-2xl font-bold">Comunidad TRITON</h2>
            <p className="text-gray-400 text-sm">
              Publicaciones de corredores, ciclistas y nadadores
            </p>
          </div>
        </div>

        {/* GRID DE POSTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEED.map((post) => (
            <article
              key={post.id}
              className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden"
            >
              {/* User info */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-300 to-orange-300 flex items-center justify-center text-black font-bold">
                    {post.userInitial}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{post.user}</p>
                    <span className="text-xs text-gray-400">{post.userTag}</span>
                  </div>
                </div>

                <span className="px-3 py-1 bg-white/5 text-xs rounded-full">
                  {post.category}
                </span>
              </div>

              {/* Imagen */}
              <div className="relative w-full h-64">
                <Image
                  src={post.image}
                  alt="post"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Descripción */}
              <div className="px-4 py-3">
                <p className="text-sm">{post.description}</p>

                <div className="flex items-center justify-between mt-3 text-xs">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Heart size={14} className="text-pink-400" />
                      {post.likes}
                    </span>

                    <span className="flex items-center gap-1">
                      <MessageCircle size={14} className="text-gray-400" />
                      {post.comments}
                    </span>
                  </div>

                  <Link href="#" className="text-cyan-300 hover:underline">
                    Ver más
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}