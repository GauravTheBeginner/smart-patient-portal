
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GlassCard from "@/components/ui-custom/GlassCard";
import PatientRecord from "@/components/ui-custom/PatientRecord";
import HealthChart from "@/components/ui-custom/HealthChart";
import SlideUp from "@/components/animations/SlideUp";
import FadeIn from "@/components/animations/FadeIn";
import { getPatientInfo, getHealthRecords, mockBloodPressureData, mockGlucoseData, mockCholesterolData, HealthRecord, PatientInfo } from "@/utils/fhir";
import { Check, FileText, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Dashboard = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const patientData = await getPatientInfo();
        const recordsData = await getHealthRecords();
        
        setPatient(patientData);
        setRecords(recordsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter records based on search term
  const filteredRecords = records.filter(record => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      record.title.toLowerCase().includes(term) ||
      record.type.toLowerCase().includes(term) ||
      record.provider.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* Patient Overview */}
        <section className="bg-gradient-to-b from-health-50/50 to-transparent py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            <FadeIn>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Welcome, {patient?.name || 'Patient'}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Your health dashboard and records
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button className="flex items-center">
                    <Plus size={16} className="mr-1.5" />
                    Connect Provider
                  </Button>
                </div>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SlideUp delay={100} index={0}>
                <HealthChart 
                  title="Blood Pressure" 
                  unit="mmHg" 
                  data={mockBloodPressureData} 
                  color="#0EA5E9"
                />
              </SlideUp>
              <SlideUp delay={100} index={1}>
                <HealthChart 
                  title="Glucose Level" 
                  unit="mg/dL" 
                  data={mockGlucoseData} 
                  color="#10B981"
                />
              </SlideUp>
              <SlideUp delay={100} index={2}>
                <HealthChart 
                  title="Cholesterol" 
                  unit="mg/dL" 
                  data={mockCholesterolData} 
                  color="#A855F7"
                />
              </SlideUp>
            </div>
          </div>
        </section>
        
        {/* Health Records */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            <FadeIn>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Your Health Records</h2>
                  <p className="text-muted-foreground mt-1">View, download, and share your medical information</p>
                </div>
                <div className="mt-4 md:mt-0 w-full md:w-auto">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search records..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </FadeIn>
            
            {isLoading ? (
              // Loading state
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i}
                    className="bg-muted/50 animate-pulse rounded-xl h-48"
                  ></div>
                ))}
              </div>
            ) : filteredRecords.length > 0 ? (
              // Records grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecords.map((record, index) => (
                  <SlideUp key={record.id} delay={50} index={index}>
                    <PatientRecord
                      id={record.id}
                      title={record.title}
                      type={record.type}
                      date={record.date}
                      provider={record.provider}
                      shared={record.shared}
                    />
                  </SlideUp>
                ))}
              </div>
            ) : (
              // No results
              <FadeIn delay={100}>
                <GlassCard className="py-12 text-center">
                  <div className="space-y-3 max-w-md mx-auto">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <h3 className="text-xl font-medium">No records found</h3>
                    {searchTerm ? (
                      <p className="text-muted-foreground">
                        No records match your search for "{searchTerm}". 
                        Try a different search term or clear the search.
                      </p>
                    ) : (
                      <p className="text-muted-foreground">
                        You don't have any health records yet. Connect with your healthcare provider to import your records.
                      </p>
                    )}
                    {searchTerm && (
                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setSearchTerm('')}
                        >
                          Clear Search
                        </Button>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </FadeIn>
            )}
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[
                {
                  title: "Connect EHR",
                  description: "Link your electronic health records from your providers",
                  icon: <Plus className="h-5 w-5" />,
                  onClick: () => console.log("Connect EHR")
                },
                {
                  title: "View Shared Records",
                  description: "See which records you've shared and with whom",
                  icon: <Check className="h-5 w-5" />,
                  onClick: () => navigate("/sharing")
                },
                {
                  title: "Download Summary",
                  description: "Get a complete summary of your health records",
                  icon: (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                  ),
                  onClick: () => console.log("Download Summary")
                }
              ].map((action, index) => (
                <SlideUp key={index} delay={100} index={index}>
                  <GlassCard 
                    className="flex items-center p-4" 
                    hoverEffect={true}
                    onClick={action.onClick}
                  >
                    <div className="rounded-full bg-health-50 p-3 mr-4">
                      <div className="text-health-600">
                        {action.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </GlassCard>
                </SlideUp>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
