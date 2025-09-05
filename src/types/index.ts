export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'beneficiary';
  district?: string;
  state?: string;
  village?: string;
}

export interface FRARecord {
  id: string;
  type: 'IFR' | 'CR' | 'CFR';
  holderName: string;
  village: string;
  district: string;
  state: string;
  area: number;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  coordinates: [number, number];
  dateApplied: string;
  dateProcessed?: string;
  documents: string[];
}

export interface AssetMapping {
  id: string;
  type: 'agricultural' | 'forest' | 'water' | 'homestead';
  area: number;
  coordinates: [number, number][];
  confidence: number;
  lastUpdated: string;
}

export interface SchemeEligibility {
  scheme: string;
  eligible: boolean;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  recommendations: string[];
}

export interface DSSRecommendation {
  fraRecordId: string;
  interventions: {
    type: string;
    description: string;
    priority: number;
    estimatedBenefit: string;
  }[];
  eligibleSchemes: SchemeEligibility[];
}