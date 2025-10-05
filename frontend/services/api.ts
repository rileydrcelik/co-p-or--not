// API service for fetching polyline data from backend
const API_BASE_URL = 'http://localhost:5000/api';

export interface Coordinate {
  lat: number;
  lng: number;
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
