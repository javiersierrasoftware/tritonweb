import HeroSlider from "@/components/HeroSlider";
import Feed from "@/components/Feed";
import EventsSection from "@/components/EventsSection";

export default function Home() {
  return (
    <main className="min-h-screen pb-16 pt-20 space-y-20">
      {/* SLIDER con márgenes corregidos */}
      <section className="max-w-6xl mx-auto px-4">
        <HeroSlider />
      </section>

      {/* FEED */}
      <section id="comunidad" className="max-w-6xl mx-auto px-4">
        <Feed />
      </section>

      {/* EVENTOS */}
      <section className="max-w-6xl mx-auto px-4">
        <EventsSection />
      </section>
    </main>
  );
}