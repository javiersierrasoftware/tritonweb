"use client";

import { useState } from "react";
import { EVENTS } from "@/data/events";
import EventsFilters from "@/components/events/EventsFilters";
import EventsGrid from "@/components/events/EventsGrid";
import { Event } from "@/types/Event";

export default function EventsPage() {
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    city: "",
  });

  const filteredEvents: Event[] = EVENTS.filter((event) => {
    return (
      (filters.search === "" ||
        event.name.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.type === "" || event.type === filters.type) &&
      (filters.city === "" || event.location.includes(filters.city))
    );
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-14 space-y-8">
      <h1 className="text-3xl font-bold">Calendario de Eventos</h1>

      <EventsFilters onFilterChange={setFilters} />

      <EventsGrid events={filteredEvents} />
    </main>
  );
}