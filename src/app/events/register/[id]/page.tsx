import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import RegistrationForm from "@/components/events/RegistrationForm";
import Image from "next/image";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface RegisterPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface DecodedToken {
  id: string;
  email: string;
  name: string;
  role: string;
}

async function getUserFromCookie() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("triton_session_token");

  if (tokenCookie) {
    try {
      const decoded = jwt.verify(tokenCookie.value, process.env.JWT_SECRET!) as DecodedToken;
      return { id: decoded.id, email: decoded.email, name: decoded.name, role: decoded.role };
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  }
  return null;
}

async function getEvent(id: string) {
  if (!isValidObjectId(id)) {
    return null;
  }
  await connectDB();
  const event = await Event.findById(id).lean(); // .lean() converts to plain JS object

  if (event) {
    event._id = event._id.toString();
    if (event.createdBy) {
      event.createdBy = event.createdBy.toString();
    }
    if (event.registrationPeriods && event.registrationPeriods.length > 0) {
      event.registrationPeriods = event.registrationPeriods.map((period: any) => ({
        ...period,
        _id: period._id.toString(),
        startDate: period.startDate.toISOString(), // Convert Date to ISO string
        endDate: period.endDate.toISOString(),     // Convert Date to ISO string
      }));
    }
  }
  return event;
}

// Helper to find the current price (frontend version)
function getFrontendCalculatedPrice(event: any): number {
  const now = new Date();

  if (event.registrationPeriods && event.registrationPeriods.length > 0) {
    for (const period of event.registrationPeriods) {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      if (now >= startDate && now <= endDate) {
        return (period.price || 0); // Return price as a number, not cents
      }
    }
  }

  // Fallback to the main event price if no period matches
  return (event.price || 0); // Return price as a number
}


export default async function RegisterPage({ params }: RegisterPageProps) {
  const { id } = await params;
  const event = await getEvent(id);
  const user = await getUserFromCookie();

  if (!event) {
    notFound();
  }

  const displayPrice = getFrontendCalculatedPrice(event);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{event.name}</h1>
        <p className="text-lg text-gray-400">Inscripción</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Completa tus datos</h2>
          <RegistrationForm event={event} user={user} calculatedPrice={displayPrice} />
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6 flex flex-col">
          <div className="relative w-full h-64 mb-4">
            <Image
              src={event.image || "/event-placeholder.jpg"}
              alt={event.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <h3 className="text-xl font-bold">{event.name}</h3>
          <p className="text-gray-400">{event.location}</p>
          <div className="flex-grow"></div>
          <p className="text-3xl font-bold mt-4 self-end">{displayPrice} COP</p>
        </div>
      </div>
    </main>
  );
}
