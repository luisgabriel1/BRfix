import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

// Import gallery images
import kitchenRenovation from "@/assets/gallery/kitchen-renovation.jpg";
import bathroomRenovation from "@/assets/gallery/bathroom-renovation.jpg";
import electricalWork from "@/assets/gallery/electrical-work.jpg";
import flooringInstallation from "@/assets/gallery/flooring-installation.jpg";
import securitySystem from "@/assets/gallery/security-system.jpg";
import homeTheater from "@/assets/gallery/home-theater.jpg";

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryItems = [
    {
      image: kitchenRenovation,
      title: "Modern Kitchen Renovation",
      category: "Kitchen Remodel",
      description: "Complete kitchen renovation with new cabinets, countertops, and lighting"
    },
    {
      image: bathroomRenovation,
      title: "Bathroom Transformation",
      category: "Bathroom Remodel",
      description: "Full bathroom renovation with modern fixtures and tile work"
    },
    {
      image: electricalWork,
      title: "Electrical Installation",
      category: "Electrical Services",
      description: "Professional electrical work including lighting and ceiling fans"
    },
    {
      image: flooringInstallation,
      title: "Vinyl Flooring Project",
      category: "Flooring",
      description: "High-quality vinyl flooring installation throughout the home"
    },
    {
      image: securitySystem,
      title: "Security System Setup",
      category: "Security",
      description: "Complete home security system with cameras and electronic locks"
    },
    {
      image: homeTheater,
      title: "Home Theater Installation",
      category: "Entertainment",
      description: "Professional home theater setup with wall-mounted TV and surround sound"
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Our Work Gallery</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See the quality craftsmanship and attention to detail in our completed projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <Card 
              key={index} 
              className="overflow-hidden hover:shadow-professional transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
              onClick={() => setSelectedImage(index)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  {item.category}
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal for enlarged image */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-secondary transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <img
                src={galleryItems[selectedImage].image}
                alt={galleryItems[selectedImage].title}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6 rounded-b-lg">
                <Badge className="mb-2 bg-primary text-primary-foreground">
                  {galleryItems[selectedImage].category}
                </Badge>
                <h3 className="text-2xl font-semibold mb-2">{galleryItems[selectedImage].title}</h3>
                <p className="text-white/90">{galleryItems[selectedImage].description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;