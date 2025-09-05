import Navigation from "../components/Navigation";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import GallerySection from "../components/GallerySection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import { Toaster } from "@/components/ui/toaster";
import SuccessDemo from "../components/SuccessDemo";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <GallerySection />
      <ContactSection />
      <Footer />
      <Toaster />
      <SuccessDemo />
    </div>
  );
};

export default Index;
