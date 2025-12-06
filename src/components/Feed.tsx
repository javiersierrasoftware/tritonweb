"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Feed() {
  const [stories, setStories] = useState([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    fetch("/api/stories?featured=1")
  .then((res) => res.json())
  .then((data) => setStories(data))
  .catch(console.error);
  }, []);

  return (
    <section id="comunidad">
      <div className="max-w-6xl mx-auto px-4">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-3">
            <img src="/tritontransparente.png" className="h-7 w-7" />

            <div>
              <h2 className="text-2xl font-bold">Comunidad TRITON</h2>
              <p className="text-gray-400 text-sm">Últimas publicaciones</p>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((post: any) => {
            const userInitial =
              post.user?.charAt(0).toUpperCase() ?? "U";

            return (
              <article
                key={post._id}
                className="relative bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-md"
              >
                {/* IMAGEN NORMALIZADA */}
                <div className="relative w-full h-80 bg-black rounded-t-2xl overflow-hidden">
                  <Image
                    src={post.image}
                    alt="post"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* USER INFO */}
                <div className="flex justify-between items-center px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br 
                                    from-cyan-300/80 to-orange-300/80
                                    flex items-center justify-center 
                                    text-black font-bold border border-white/20 shadow-sm">
                      {userInitial}
                    </div>

                    <div className="flex flex-col leading-tight">
                      <p className="font-semibold text-white text-base">
                        {post.user}
                      </p>
                      <span className="text-xs text-gray-400">@{post.userTag}</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 text-xs rounded-full 
                                   bg-white/10 border border-white/10 
                                   backdrop-blur-sm text-gray-200">
                    {post.category}
                  </span>
                </div>

                {/* DESCRIPTION */}
                <div className="px-4 pb-4">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {post.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}