import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, Upload, X } from "lucide-react";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    description: "",
    observations: ""
  });
  const [files, setFiles] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const res = await fetch("http://localhost:3000/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        description: formData.description,
        observations: formData.observations,
      }),
    });

    const result = await res.json();

    if (result.success) {
      toast({
        title: "Quote Request Submitted!",
        description: "We'll contact you within 24 hours to discuss your project.",
        duration: 5000,
      });

      // limpa os campos
      setFormData({
        name: "",
        email: "",
        address: "",
        phone: "",
        description: "",
        observations: "",
      });
      setFiles([]);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to send message.",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error(error);
    toast({
      title: "Error",
      description: "An unexpected error occurred.",
      variant: "destructive",
    });
  }
};



  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Get Your Free Quote</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to start your home improvement project? Fill out the form below and we'll get back to you with a detailed quote.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-card-foreground">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Phone</h3>
                    <p className="text-muted-foreground">+1 407-394-0171</p>
                    <p className="text-sm text-muted-foreground">Available 24/7 for emergencies</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Email</h3>
                    <p className="text-muted-foreground">contact@davensolutions.com</p>
                    <p className="text-sm text-muted-foreground">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Zip Code</h3>
                    <p className="text-muted-foreground">33896</p>
                    <p className="text-sm text-muted-foreground">Free estimates within service area</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Business Hours</h3>
                    <p className="text-muted-foreground">8:00am - 8:00pm</p>
                    <p className="text-muted-foreground">Monday - Saturday</p>
                    <div className="mt-2 p-2 bg-muted rounded">
                      <p className="text-xs font-medium">24/7 Support Available:</p>
                      <p className="text-xs text-muted-foreground">Email • SMS • WhatsApp</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quote Request Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-card-foreground">Request Your Quote</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-card-foreground">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-card-foreground">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-card-foreground">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="ex: +1 000-000-0000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-sm font-medium text-card-foreground">
                      Zip Code *
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="ex: 00000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-card-foreground">
                      Project Description *
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      className="mt-1 min-h-[120px]"
                      placeholder="Please describe what you need done in detail..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="observations" className="text-sm font-medium text-card-foreground">
                      Additional Notes / Visit Observations
                    </Label>
                    <Textarea
                      id="observations"
                      name="observations"
                      value={formData.observations}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Any additional information, special requirements, or notes about the visit..."
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-card-foreground">
                      Upload Images/Videos
                    </Label>
                    <div className="mt-2">
                      <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors">
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                        >
                          <Upload className="w-8 h-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground text-center">
                            Click to upload images or videos of your project area
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Supports: JPG, PNG, MP4, MOV (Max 10MB each)
                          </span>
                        </label>
                      </div>

                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium text-card-foreground">Uploaded Files:</p>
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-muted rounded-lg p-3">
                              <span className="text-sm text-muted-foreground truncate">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeFile(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    Submit Quote Request
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    By submitting this form, you agree to be contacted by BRfix regarding your project.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;