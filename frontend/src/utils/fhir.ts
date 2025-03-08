
// FHIR API service using our Node.js backend
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface PatientInfo {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface HealthRecord {
  id: string;
  title: string;
  type: string;
  date: string;
  provider: string;
  shared: boolean;
  content?: string;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    size?: number;
  }>;
  sharedWith?: Array<{
    email: string;
    permissions: {
      view: boolean;
      download: boolean;
      reshare: boolean;
    };
    expiration?: string;
  }>;
}

// Mock data for fallback when backend is not available
const mockPatient: PatientInfo = {
  id: "pat-123456",
  name: "Jane Smith",
  birthDate: "1985-04-12",
  gender: "female",
  address: "123 Main St, Boston, MA 02115",
  phone: "(617) 555-1234",
  email: "jane.smith@example.com"
};

const mockRecords: HealthRecord[] = [
  {
    id: "rec-001",
    title: "Annual Physical Examination",
    type: "Visit Summary",
    date: "2023-09-15",
    provider: "Dr. Robert Chen",
    shared: false,
    content: "Patient in good health. Blood pressure normal at 120/80. Heart rate 68 bpm."
  },
  {
    id: "rec-002",
    title: "Complete Blood Count (CBC)",
    type: "Lab Result",
    date: "2023-10-02",
    provider: "Boston Medical Labs",
    shared: true,
    content: "WBC: 7.2 K/uL (normal)\nRBC: 4.8 M/uL (normal)\nHemoglobin: 14.2 g/dL (normal)\nHematocrit: 42% (normal)\nPlatelets: 250 K/uL (normal)",
    sharedWith: [
      {
        email: "dr.johnson@hospital.org",
        permissions: {
          view: true,
          download: true,
          reshare: false
        },
        expiration: "2023-12-31"
      }
    ]
  },
  {
    id: "rec-003",
    title: "Cholesterol Panel",
    type: "Lab Result",
    date: "2023-10-02",
    provider: "Boston Medical Labs",
    shared: false,
    content: "Total Cholesterol: 185 mg/dL\nHDL: 55 mg/dL\nLDL: 110 mg/dL\nTriglycerides: 100 mg/dL"
  },
  {
    id: "rec-004",
    title: "Influenza Vaccination",
    type: "Immunization",
    date: "2023-11-10",
    provider: "Community Health Clinic",
    shared: false
  },
  {
    id: "rec-005",
    title: "Atorvastatin 10mg",
    type: "Medication",
    date: "2023-09-15",
    provider: "Dr. Robert Chen",
    shared: true,
    content: "Take 1 tablet daily at bedtime",
    sharedWith: [
      {
        email: "pharmacy@meds.com",
        permissions: {
          view: true,
          download: false,
          reshare: false
        }
      }
    ]
  },
  {
    id: "rec-006",
    title: "Chest X-Ray",
    type: "Imaging",
    date: "2023-06-08",
    provider: "Radiology Associates",
    shared: false,
    content: "No acute cardiopulmonary process. Normal heart size. No pneumonia."
  }
];

// Mock health data for charts
export const mockBloodPressureData = [
  { date: '2023-05-01', value: 128 },
  { date: '2023-06-01', value: 125 },
  { date: '2023-07-01', value: 130 },
  { date: '2023-08-01', value: 122 },
  { date: '2023-09-01', value: 119 },
  { date: '2023-10-01', value: 121 },
  { date: '2023-11-01', value: 120 },
];

export const mockGlucoseData = [
  { date: '2023-05-01', value: 95 },
  { date: '2023-06-01', value: 98 },
  { date: '2023-07-01', value: 102 },
  { date: '2023-08-01', value: 97 },
  { date: '2023-09-01', value: 99 },
  { date: '2023-10-01', value: 96 },
  { date: '2023-11-01', value: 95 },
];

export const mockCholesterolData = [
  { date: '2023-05-01', value: 195 },
  { date: '2023-06-01', value: 190 },
  { date: '2023-07-01', value: 185 },
  { date: '2023-08-01', value: 188 },
  { date: '2023-09-01', value: 183 },
  { date: '2023-10-01', value: 185 },
  { date: '2023-11-01', value: 180 },
];

// Real API functions with fallback to mock data
export const getPatientInfo = async (): Promise<PatientInfo> => {
  try {
    // For now, we'll use a hardcoded patient ID
    // In a real app, this would come from authentication
    const patientId = 'pat-123456'; 
    const response = await axios.get(`${API_URL}/patients/${patientId}`);
    
    // Format the date
    const patient = response.data;
    return {
      ...patient,
      birthDate: new Date(patient.birthDate).toISOString().split('T')[0]
    };
  } catch (error) {
    console.error('Error fetching patient info, using mock data:', error);
    // Fallback to mock data if API fails
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPatient), 500);
    });
  }
};

export const getHealthRecords = async (): Promise<HealthRecord[]> => {
  try {
    // For now, we'll use a hardcoded patient ID
    const patientId = 'pat-123456';
    const response = await axios.get(`${API_URL}/records/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching health records, using mock data:', error);
    // Fallback to mock data if API fails
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRecords), 700);
    });
  }
};

export const getHealthRecord = async (id: string): Promise<HealthRecord | undefined> => {
  try {
    const response = await axios.get(`${API_URL}/records/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching health record, using mock data:', error);
    // Fallback to mock data if API fails
    return new Promise((resolve) => {
      const record = mockRecords.find(r => r.id === id);
      setTimeout(() => resolve(record), 300);
    });
  }
};

export const shareRecord = async (
  recordId: string, 
  recipientEmail: string, 
  permissions: any, 
  expiration?: string
): Promise<boolean> => {
  try {
    const expirationParam = expiration ? `${expiration}d` : undefined;
    
    await axios.post(`${API_URL}/records/${recordId}/share`, {
      email: recipientEmail,
      permissions,
      expiration: expirationParam
    });
    return true;
  } catch (error) {
    console.error('Error sharing record, using mock data:', error);
    // Fallback to mock implementation
    return new Promise((resolve) => {
      console.log(`Sharing record ${recordId} with ${recipientEmail}`);
      console.log('Permissions:', permissions);
      
      // Find the record and update its sharing status
      const recordIndex = mockRecords.findIndex(r => r.id === recordId);
      if (recordIndex !== -1) {
        const record = mockRecords[recordIndex];
        
        // Update shared status
        mockRecords[recordIndex].shared = true;
        
        // Add shared recipient info
        if (!record.sharedWith) {
          mockRecords[recordIndex].sharedWith = [];
        }
        
        // Create expiration date if needed
        let expirationDate;
        if (expiration) {
          expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + parseInt(expiration));
          console.log(`Expires on ${expirationDate.toISOString()}`);
        }
        
        // Add or update recipient
        const existingRecipientIndex = record.sharedWith?.findIndex(s => s.email === recipientEmail);
        if (existingRecipientIndex !== undefined && existingRecipientIndex !== -1) {
          mockRecords[recordIndex].sharedWith![existingRecipientIndex] = {
            email: recipientEmail,
            permissions,
            ...(expirationDate && { expiration: expirationDate.toISOString() })
          };
        } else {
          mockRecords[recordIndex].sharedWith!.push({
            email: recipientEmail,
            permissions,
            ...(expirationDate && { expiration: expirationDate.toISOString() })
          });
        }
      }
      
      setTimeout(() => resolve(true), 800);
    });
  }
};

export const revokeAccess = async (recordId: string, recipientEmail: string): Promise<boolean> => {
  try {
    await axios.post(`${API_URL}/records/${recordId}/revoke`, {
      email: recipientEmail
    });
    return true;
  } catch (error) {
    console.error('Error revoking access, using mock data:', error);
    // Fallback to mock implementation
    return new Promise((resolve) => {
      console.log(`Revoking access to record ${recordId} from ${recipientEmail}`);
      
      // Find the record
      const recordIndex = mockRecords.findIndex(r => r.id === recordId);
      if (recordIndex !== -1) {
        const record = mockRecords[recordIndex];
        
        // Remove the recipient
        if (record.sharedWith) {
          mockRecords[recordIndex].sharedWith = record.sharedWith.filter(s => s.email !== recipientEmail);
          
          // If no more shared recipients, mark as not shared
          if (mockRecords[recordIndex].sharedWith.length === 0) {
            mockRecords[recordIndex].shared = false;
          }
        }
      }
      
      setTimeout(() => resolve(true), 600);
    });
  }
};

export const getRecordSharing = async (recordId: string): Promise<{ 
  shared: boolean, 
  sharedWith?: Array<{
    email: string,
    permissions: any,
    expiration?: string
  }> 
}> => {
  try {
    const response = await axios.get(`${API_URL}/records/${recordId}/sharing`);
    return response.data;
  } catch (error) {
    console.error('Error getting record sharing info, using mock data:', error);
    // Fallback to mock implementation
    return new Promise((resolve) => {
      const record = mockRecords.find(r => r.id === recordId);
      if (record) {
        resolve({
          shared: record.shared,
          sharedWith: record.sharedWith
        });
      } else {
        resolve({ shared: false });
      }
    });
  }
};
