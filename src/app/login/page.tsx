import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white pt-28 pb-20 px-6" />}>
      <LoginClient />
    </Suspense>
  );
}
