import { Navbar } from "@/components/organisms/Navbar";
import { HeroSection } from "@/components/organisms/HeroSection";
import { FilterBar } from "@/components/organisms/FilterBar";
import { ProjectGrid } from "@/components/organisms/ProjectGrid";
import { Footer } from "@/components/organisms/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">
        <HeroSection />
        <section className="max-w-[1440px] mx-auto px-8 my-16">
          <FilterBar />
        </section>
        <ProjectGrid />
      </main>
      <Footer />
    </div>
  );
}
