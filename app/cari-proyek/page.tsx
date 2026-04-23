import React from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { CariProyekContent } from "@/components/organisms/CariProyekContent";

export default function CariProyekPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />
      <CariProyekContent />
      <Footer />
    </div>
  );
}
