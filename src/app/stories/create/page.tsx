import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import CreateStoryForm from "@/components/CreateStoryForm";
import { ShieldCheck } from "lucide-react";

interface UserPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

async function getAdminSession(): Promise<UserPayload | null> {
  const tokenCookie = cookies().get("triton_session_token");
  if (!tokenCookie) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const decoded = jwt.verify(tokenCookie.value, secret) as UserPayload;
    if (decoded.role !== "ADMIN") return null;
    return decoded;
  } catch (error) {
    return null;
  }
}

export default async function CreateStoryPage() {
  const adminUser = await getAdminSession();

  if (!adminUser) {
    redirect("/login");
  }

  return (
    <main className="max-w-2xl mx-auto px-4 pt-24 pb-16 space-y-8">
      {/* TÍTULO */}
      <div className="flex items-center gap-3">
        <ShieldCheck size={30} className="text-orange-300" />
        <h1 className="text-3xl font-bold">Crear Nueva Historia</h1>
      </div>

      {/* FORMULARIO */}
      <CreateStoryForm
        user={{ name: adminUser.name, email: adminUser.email }}
      />
    </main>
  );
}