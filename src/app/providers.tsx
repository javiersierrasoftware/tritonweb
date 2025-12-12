"use client";

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify"; // Assuming you need ToastContainer here

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </SessionProvider>
  );
}
