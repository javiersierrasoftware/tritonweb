import HeroSlider from "@/components/HeroSlider";
import Feed from "@/components/Feed";
import EventsSection from "@/components/EventsSection";

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

      {/* EVENTOS: ya tiene max-w-6xl, NO envolver otra vez */}
      <section>
        <EventsSection />
      </section>

    </main>
  );
}