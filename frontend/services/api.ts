// API service for fetching polyline data from backend
import { API_BASE_URL } from '../config';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface PolylineShape {
  shape_id: string;
  coordinates: Coordinate[];
}

export interface PolylinesResponse {
  success: boolean;
  data: {
    [routeId: string]: PolylineShape[];
  };
}

export const fetchAllPolylines = async (): Promise<PolylinesResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/polylines`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching polylines:', error);
    throw error;
  }
};

export const fetchPolylinesByRoute = async (routeId: string): Promise<{ success: boolean; data: PolylineShape[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/polylines/route/${routeId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching polylines for route ${routeId}:`, error);
    throw error;
  }
};

// Report interfaces
export interface Report {
  _id: string;
  presence: boolean;
  station: {
    _id: string;
    name: string;
    train_lines: string[];
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  reportedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportsResponse {
  success: boolean;
  data: Report[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalReports: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  count?: number;
}

// Report API functions
export const fetchAllReports = async (page: number = 1, limit: number = 50): Promise<ReportsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports?page=${page}&limit=${limit}&sortBy=reportedAt&sortOrder=desc`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

export const fetchReportsByPresence = async (presence: boolean): Promise<ReportsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/presence/${presence}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching reports by presence ${presence}:`, error);
    throw error;
  }
};

export const fetchReportsByStation = async (stationName: string): Promise<ReportsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/station/${encodeURIComponent(stationName)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching reports for station ${stationName}:`, error);
    throw error;
  }
};

// Station interfaces
export interface Station {
  _id: string;
  name: string;
  train_lines: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StationsResponse {
  success: boolean;
  data: Station[];
  count?: number;
}

// Station API functions
export const fetchAllStations = async (): Promise<StationsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stations`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stations:', error);
    throw error;
  }
};

export const fetchNearestStation = async (latitude: number, longitude: number): Promise<{ success: boolean; data: { station: Station } }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stations/nearest?lat=${latitude}&lng=${longitude}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching nearest station:', error);
    throw error;
  }
};

// Create report interface
export interface CreateReportRequest {
  presence: boolean;
  station: string; // Station ID
}

export interface CreateReportResponse {
  success: boolean;
  message: string;
  data: Report;
}

// Create report API function
export const createReport = async (presence: boolean, stationId: string): Promise<CreateReportResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        presence,
        station: stationId
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
};
