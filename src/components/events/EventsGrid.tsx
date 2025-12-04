import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, MapPin } from "lucide-react";
import { Event } from "@/types/Event";

interface EventsGridProps {
  events: Event[];
}

export default function EventsGrid({ events }: EventsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map((event) => (
        <Link
          key={event.id}
          href={`/events/${event.id}`}
          className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-300/40 transition"
        >
          {/* IMAGEN */}
          <div className="relative w-full h-48">
            <Image
              src={event.image}
              alt={event.name}
              fill
              className="object-cover"
            />
          </div>

          {/* INFO */}
          <div className="p-4 space-y-2">
            <h3 className="text-lg font-semibold">{event.name}</h3>

            <p className="text-sm text-gray-400 flex items-center gap-2">
              <CalendarIcon size={14} />
              {event.date} · {event.time}
            </p>

            <p className="text-sm text-gray-400 flex items-center gap-2">
              <MapPin size={14} />
              {event.location}
            </p>

            <span className="inline-block mt-2 bg-white/5 px-3 py-1 rounded-full text-xs text-gray-300">
              {event.type}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}