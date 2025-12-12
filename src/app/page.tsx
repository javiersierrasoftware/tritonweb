import HeroSlider from "@/components/HeroSlider";
import Feed from "@/components/Feed";
import EventsFeed from "@/components/EventsFeed";
import TritonServices from "@/components/services/TritonServices";
import TritonKidsServices from "@/components/services/TritonKidsServices";


export default function Home() {
  return (
    <main className="min-h-screen pb-16 space-y-20">

      {/* SLIDER: este sí lleva contenedor */}
      <section className="max-w-6xl mx-auto px-4 pt-20">
        <HeroSlider />
      </section>

      {/* FEED: ya tiene max-w-6xl, NO envolver otra vez */}
      <section id="comunidad">
        <Feed />
      </section>

      {/* EVENTOS TRITON */}
      <section>
        <EventsFeed />
      </section>

      <TritonServices />
      
      <TritonKidsServices />

    </main>
  );
}