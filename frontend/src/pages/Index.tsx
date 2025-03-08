import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import FadeIn from "@/components/animations/FadeIn";
import SlideUp from "@/components/animations/SlideUp";
import { ArrowRight, Lock, Share2, Shield, LogIn, UserPlus, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6">
                <FadeIn>
                  <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-health-50 text-health-600 mb-4">
                    <Shield size={14} className="mr-1" />
                    Patient-controlled health data
                  </div>
                </FadeIn>
                
                <SlideUp>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                    Your Health Data, <span className="text-health-600">Your Control</span>
                  </h1>
                </SlideUp>
                
                <SlideUp delay={100}>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                    MedSync gives you secure access to your medical records, putting you in control of who can see your health information and when.
                  </p>
                </SlideUp>
                
                <SlideUp delay={200} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
                  {isAuthenticated ? (
                    <>
                      <Button size="lg" asChild className="h-12 px-6">
                        <Link to="/dashboard">
                          <FileText className="mr-2 h-5 w-5" />
                          View Your Records
                        </Link>
                      </Button>
                      <Button variant="outline" size="lg" asChild className="h-12 px-6">
                        <Link to="/sharing">
                          <Share2 className="mr-2 h-5 w-5" />
                          Manage Sharing
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="lg" asChild className="h-12 px-6">
                        <Link to="/signin">
                          <LogIn className="mr-2 h-5 w-5" />
                          Sign In
                        </Link>
                      </Button>
                      <Button variant="outline" size="lg" asChild className="h-12 px-6">
                        <Link to="/signin">
                          <UserPlus className="mr-2 h-5 w-5" />
                          Create Account
                        </Link>
                      </Button>
                    </>
                  )}
                </SlideUp>
                
                {isAuthenticated && (
                  <SlideUp delay={300}>
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <p className="text-sm">
                        Welcome back, <span className="font-medium">{user?.name}</span>! Continue managing your health records securely.
                      </p>
                    </div>
                  </SlideUp>
                )}
              </div>
              
              <div className="lg:mt-0 mt-8">
                <FadeIn delay={300} className="relative">
                  <div className="rounded-2xl shadow-lg overflow-hidden relative">
                    <img 
                      src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                      alt="Patient viewing health records" 
                      className="w-full h-auto rounded-xl object-cover aspect-[4/3]"
                    />
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <SlideUp>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Features Designed for You</h2>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  MedSync makes managing and sharing health information seamless, secure, and simple.
                </p>
              </SlideUp>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Shield className="h-6 w-6 text-health-500" />,
                  title: "Secure Access",
                  description: "Access your health records securely anytime, anywhere, with industry-standard encryption and authentication.",
                },
                {
                  icon: <Share2 className="h-6 w-6 text-health-500" />,
                  title: "Controlled Sharing",
                  description: "Share specific records with healthcare providers or family members with detailed permission controls.",
                },
                {
                  icon: <Lock className="h-6 w-6 text-health-500" />,
                  title: "Revoke Anytime",
                  description: "Change or revoke access permissions at any time, maintaining full control over your information.",
                },
              ].map((feature, index) => (
                <SlideUp key={index} index={index} delay={100}>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-subtle transition-transform duration-300 hover:-translate-y-1 hover:shadow-elevated h-full flex flex-col">
                    <div className="rounded-full bg-health-50 w-12 h-12 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground flex-1">{feature.description}</p>
                  </div>
                </SlideUp>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <SlideUp>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  MedSync uses SMART on FHIR standards to connect securely to your healthcare providers.
                </p>
              </SlideUp>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <SlideUp>
                  <div className="glass-effect rounded-xl shadow-glass overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1581093588401-cddd95e52e85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80" 
                      alt="Doctor and patient looking at health records" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </SlideUp>
              </div>
              
              <div className="order-1 lg:order-2 space-y-6">
                {[
                  {
                    number: "01",
                    title: "Secure Connection",
                    description: "Connect to your healthcare providers using secure OAuth authentication.",
                  },
                  {
                    number: "02",
                    title: "Access Records",
                    description: "View and download your health records from connected providers.",
                  },
                  {
                    number: "03",
                    title: "Share Selectively",
                    description: "Choose which records to share and with whom, setting permissions and expirations.",
                  },
                  {
                    number: "04",
                    title: "Maintain Control",
                    description: "Monitor access and revoke permissions at any time through a simple interface.",
                  },
                ].map((step, index) => (
                  <SlideUp key={index} delay={index * 100}>
                    <div className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-health-50 flex items-center justify-center text-health-600 font-medium">
                          {step.number}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-medium mb-1">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </SlideUp>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="bg-gradient-to-r from-health-50 to-health-100 dark:from-health-900 dark:to-health-800 rounded-2xl overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <SlideUp>
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to take control of your health data?</h2>
                      <p className="text-lg text-muted-foreground mb-6 max-w-lg">
                        Sign up now and start managing your health records with confidence and ease.
                      </p>
                      {isAuthenticated ? (
                        <Button size="lg" asChild className="h-12 px-6">
                          <Link to="/dashboard">
                            Go to Dashboard
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button size="lg" asChild className="h-12 px-6">
                            <Link to="/signin">
                              <LogIn className="mr-2 h-5 w-5" />
                              Sign In
                            </Link>
                          </Button>
                          <Button variant="outline" size="lg" asChild className="h-12 px-6 bg-white/90 hover:bg-white">
                            <Link to="/signin">
                              <UserPlus className="mr-2 h-5 w-5" />
                              Create Account
                            </Link>
                          </Button>
                        </div>
                      )}
                    </SlideUp>
                  </div>
                  
                  <div className="flex justify-center lg:justify-end">
                    <FadeIn delay={200}>
                      <div className="relative max-w-xs">
                        <div className="absolute inset-0 bg-white/10 rounded-xl transform rotate-3 scale-105"></div>
                        <img 
                          src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2372&q=80" 
                          alt="Mobile app interface" 
                          className="relative z-10 rounded-xl shadow-glass object-cover"
                        />
                      </div>
                    </FadeIn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
