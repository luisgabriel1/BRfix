import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Zap, 
  Wrench, 
  Home, 
  Square, 
  Shield, 
  Camera, 
  Lock, 
  Fan, 
  Hammer, 
  Bath, 
  Tv, 
  Archive 
} from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Zap,
      title: "Electrical Services",
      description: "Professional electrical repair and replacement services for your home",
    },
    {
      icon: Wrench,
      title: "Plumbing Services", 
      description: "Expert plumbing repair and replacement solutions",
    },
    {
      icon: Home,
      title: "Vinyl Flooring Installation",
      description: "High-quality vinyl flooring installation with precision",
    },
    {
      icon: Square,
      title: "Ceramic Installation",
      description: "Professional ceramic floor and tile installation services",
    },
    {
      icon: Shield,
      title: "Alarm System Installation",
      description: "Complete security alarm system setup and installation",
    },
    {
      icon: Camera,
      title: "Security Camera Systems",
      description: "Professional security camera installation and setup",
    },
    {
      icon: Lock,
      title: "Electronic Locks",
      description: "Modern electronic lock installation for enhanced security",
    },
    {
      icon: Fan,
      title: "Fan Installation",
      description: "Ceiling fan installation and electrical connections",
    },
    {
      icon: Hammer,
      title: "Drywall Repairs",
      description: "Professional drywall repair and finishing services",
    },
    {
      icon: Bath,
      title: "Bathroom Renovations",
      description: "Complete bathroom renovation and fixture installation",
    },
    {
      icon: Tv,
      title: "TV & Home Theater Setup",
      description: "Professional television and home theater system installation",
    },
    {
      icon: Archive,
      title: "Furniture Assembly",
      description: "Expert furniture assembly for home and gym equipment",
    },
  ];

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Our Professional Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We provide comprehensive home services with professional quality and attention to detail
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="hover:shadow-card transition-all duration-300 hover:-translate-y-1 bg-card border-border">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-card-foreground">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground mb-4">
            Don't see what you need? We handle many more home improvement projects!
          </p>
          <a 
            href="#contact" 
            className="text-primary hover:text-primary-hover font-semibold underline"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Contact us for custom solutions
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;