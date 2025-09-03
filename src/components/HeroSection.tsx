import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, Mail } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const HeroSection = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero"
      className="relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Complete Solutions for
            <span className="block bg-gradient-accent bg-clip-text text-transparent">
              Your Home
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Professional home services with quality and efficiency. From electrical work to renovations, we handle it all.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="hero" 
              size="lg"
              onClick={scrollToContact}
              className="text-lg px-8 py-6"
            >
              Get Free Quote
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={scrollToServices}
              className="text-lg px-8 py-6 border-white text-black hover:bg-white hover:text-foreground"
            >
              Our Services
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <CheckCircle className="w-6 h-6 text-secondary" />
              <span className="font-semibold">Licensed & Insured</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <CheckCircle className="w-6 h-6 text-secondary" />
              <span className="font-semibold">Free Estimates</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <CheckCircle className="w-6 h-6 text-secondary" />
              <span className="font-semibold">24/7 Emergency</span>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center text-lg">
            <a href="tel:+14073940171" className="flex items-center space-x-2 text-white hover:text-secondary transition-colors">
              <Phone className="w-5 h-5" />
              <span>+1 407-394-0171</span>
            </a>
            <a href="mailto:contact@davensolutions.com" className="flex items-center space-x-2 text-white hover:text-secondary transition-colors">
              <Mail className="w-5 h-5" />
              <span>contact@davensolutions.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;