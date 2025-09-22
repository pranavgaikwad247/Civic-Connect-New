
export interface Location {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export enum ReportStatus {
  Open = 'open',
  InProgress = 'in-progress',
  Resolved = 'resolved',
}

export enum ReportCategory {
  Pothole = 'pothole',
  Garbage = 'garbage',
  WaterLeak = 'water-leak',
  Graffiti = 'graffiti',
  BrokenStreetlight = 'broken-streetlight',
  FallenTree = 'fallen-tree',
  Other = 'other',
}

export interface Report {
  _id: string;
  title: string;
  description: string;
  category: ReportCategory;
  address: string;
  location: Location;
  images: string[];
  createdAt: Date;
  upvotes: number;
  upvoters: string[];
  status: ReportStatus;
  aiScore: number;
  aiSummary: string;
  adminNotified: boolean;
  createdBy: string; // user ID
}

export interface AIScoreResponse {
    score: number;
    summary: string;
    department: string;
    recommended_action: string;
    resolution_timeframe: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  password?: string; // Only used for mock auth, never sent to client in real app
}
