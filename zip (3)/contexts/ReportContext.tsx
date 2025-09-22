import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Report, ReportStatus, ReportCategory } from '../types';
import { scoreReportWithAI } from '../services/geminiService';
import { useAuth } from './AuthContext';

// Mock data is now directly inside the context for stability.
const mockReportsData: Report[] = [
    {
        _id: '1',
        title: 'Massive Pothole on Main St',
        description: 'A very large and dangerous pothole has formed in the right lane of Main Street, right in front of the public library. It has already caused a flat tire.',
        category: ReportCategory.Pothole,
        address: '123 Main St, Anytown, USA',
        location: { type: 'Point', coordinates: [-74.0060, 40.7128] },
        images: ['https://picsum.photos/seed/pothole1/800/600'],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        upvotes: 15,
        upvoters: [],
        status: ReportStatus.Open,
        aiScore: 85,
        aiSummary: "A large, hazardous pothole on a major street poses a significant and immediate risk to vehicle safety. Recommend immediate dispatch for temporary patching and assessment for permanent repair.",
        adminNotified: true,
        createdBy: 'user1',
    },
    {
        _id: '2',
        title: 'Overflowing Trash Cans at City Park',
        description: 'All the trash cans near the playground at City Park are overflowing. There is litter all over the ground, which is unsanitary and attracting pests.',
        category: ReportCategory.Garbage,
        address: '456 Oak Ave, Anytown, USA',
        location: { type: 'Point', coordinates: [-74.0120, 40.7150] },
        images: ['https://picsum.photos/seed/trash2/800/600'],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        upvotes: 8,
        upvoters: [],
        status: ReportStatus.InProgress,
        aiScore: 65,
        aiSummary: "Overflowing garbage cans in a public park create a sanitation hazard. Public Works should prioritize cleanup to maintain park hygiene and public health.",
        adminNotified: true,
        createdBy: 'user2',
    },
    {
        _id: '3',
        title: 'Streetlight out on 5th and Elm',
        description: 'The streetlight at the corner of 5th Avenue and Elm Street is completely out. It\'s a busy intersection and very dark at night, making it unsafe for pedestrians.',
        category: ReportCategory.BrokenStreetlight,
        address: '5th Ave & Elm St, Anytown, USA',
        location: { type: 'Point', coordinates: [-73.9980, 40.7200] },
        images: ['https://picsum.photos/seed/light3/800/600'],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        upvotes: 22,
        upvoters: [],
        status: ReportStatus.Open,
        aiScore: 78,
        aiSummary: "A non-functional streetlight at a busy intersection presents a public safety risk, increasing the danger for both pedestrians and drivers at night. Assign to the Electrical department for urgent repair.",
        adminNotified: true,
        createdBy: 'user3',
    },
    {
        _id: '4',
        title: 'Graffiti on community center wall',
        description: 'Someone has spray-painted graffiti all over the west wall of the Southside Community Center.',
        category: ReportCategory.Graffiti,
        address: '789 South St, Anytown, USA',
        location: { type: 'Point', coordinates: [-74.0050, 40.7050] },
        images: ['https://picsum.photos/seed/graffiti4/800/600'],
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        upvotes: 3,
        upvoters: [],
        status: ReportStatus.Resolved,
        aiScore: 35,
        aiSummary: "Vandalism in the form of graffiti on a public building affects community aesthetics. The issue is of low urgency but should be scheduled for removal by Public Works to deter further defacement.",
        adminNotified: false,
        createdBy: 'user4',
    },
     {
        _id: '5',
        title: 'Large fallen tree branch blocking sidewalk',
        description: 'After the storm last night, a very large tree branch has fallen and is completely blocking the sidewalk on Pine Street. Pedestrians have to walk in the road.',
        category: ReportCategory.FallenTree,
        address: '321 Pine St, Anytown, USA',
        location: { type: 'Point', coordinates: [-73.9900, 40.7250] },
        images: ['https://picsum.photos/seed/tree5/800/600'],
        createdAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000), // 12 hours ago
        upvotes: 30,
        upvoters: [],
        status: ReportStatus.Open,
        aiScore: 92,
        aiSummary: "A fallen tree obstructing a public sidewalk forces pedestrians into the street, creating an immediate safety hazard. Parks and Recreation or Public Works should be dispatched immediately to clear the obstruction.",
        adminNotified: true,
        createdBy: 'user5',
    }
];


interface ReportContextType {
  reports: Report[];
  loading: boolean;
  addReport: (newReportData: Omit<Report, '_id' | 'createdAt' | 'upvotes' | 'upvoters' | 'status' | 'aiScore' | 'aiSummary' | 'adminNotified' | 'createdBy'>) => Promise<void>;
  updateReportStatus: (reportId: string, status: ReportStatus) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate API call on initial load
    const timer = setTimeout(() => {
      setReports(mockReportsData);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const addReport = useCallback(async (newReportData: Omit<Report, '_id' | 'createdAt' | 'upvotes' | 'upvoters' | 'status' | 'aiScore' | 'aiSummary' | 'adminNotified' | 'createdBy'>) => {
    if (!user) {
        throw new Error("User must be logged in to create a report.");
    }
    
    try {
      const aiAssessment = await scoreReportWithAI(newReportData);
      
      const newReport: Report = {
        ...newReportData,
        _id: `report_${new Date().getTime()}`,
        createdBy: user._id,
        createdAt: new Date(),
        upvotes: 1,
        upvoters: [user._id],
        status: ReportStatus.Open,
        aiScore: aiAssessment.score,
        aiSummary: `${aiAssessment.summary} Action: ${aiAssessment.recommended_action}. Timeframe: ${aiAssessment.resolution_timeframe}.`,
        adminNotified: false,
      };

      setReports(prevReports => [newReport, ...prevReports]);
    } catch (error) {
      console.error("Failed to add report:", error);
      throw error;
    }
  }, [user]);

  const updateReportStatus = useCallback((reportId: string, status: ReportStatus) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report._id === reportId ? { ...report, status } : report
      )
    );
  }, []);

  return (
    <ReportContext.Provider value={{ reports, loading, addReport, updateReportStatus }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = (): ReportContextType => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};