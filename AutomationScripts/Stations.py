import requests
import csv
import sys
from collections import defaultdict

# MBTA API base URL
BASE_URL = "https://api-v3.mbta.com"

# Define the subway routes we want to query
# These are the actual route IDs in the MBTA system
SUBWAY_ROUTES = [
    "Red",      # Red Line
    "Orange",   # Orange Line
    "Blue",     # Blue Line
    "Green-B",  # Green Line B branch
    "Green-C",  # Green Line C branch
    "Green-D",  # Green Line D branch
    "Green-E"   # Green Line E branch
]

def fetch_stops_for_route(route_id, api_key=None):
    """
    Fetch all stops for a specific route.
    
    The MBTA API requires filtering by a specific route ID to include
    route information in the response. This function queries stops for
    one route at a time.
    
    Args:
        route_id (str): The route ID (e.g., "Red", "Orange", "Green-B")
        api_key (str, optional): Your MBTA API key
    
    Returns:
        tuple: (route_name, list of stop dictionaries)
    """
    endpoint = f"{BASE_URL}/stops"
    
    # Filter for this specific route and include the route data
    params = {
        "filter[route]": route_id,
        "include": "route"
    }
    
    headers = {}
    if api_key:
        headers["x-api-key"] = api_key
    
    try:
        response = requests.get(endpoint, params=params, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        
        # Get the route name from the included route data
        route_name = route_id  # Default fallback
        if "included" in data:
            for item in data["included"]:
                if item.get("type") == "route" and item.get("id") == route_id:
                    # Use long_name for full route name (e.g., "Red Line")
                    route_name = item.get("attributes", {}).get("long_name", route_id)
                    break
        
        # Extract stop information
        stops = []
        if "data" in data:
            for stop in data["data"]:
                attributes = stop.get("attributes", {})
                
                # Get the parent_station ID if this is a platform/entrance
                # Parent stations are the "main" station that groups platforms
                parent_id = attributes.get("parent_station")
                
                # Only process parent stations (where parent_station is None)
                # This filters out individual platforms and keeps main stations
                if parent_id is None:
                    stops.append({
                        "id": stop.get("id"),
                        "name": attributes.get("name", ""),
                        "latitude": attributes.get("latitude"),
                        "longitude": attributes.get("longitude")
                    })
        
        return route_name, stops
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching stops for route {route_id}: {e}", file=sys.stderr)
        return route_id, []

def fetch_all_subway_stations(api_key=None):
    """
    Fetch all subway stations by querying each route separately.
    
    Since the MBTA API requires filtering by specific routes to get route data,
    we query each subway line individually and then consolidate the results.
    
    Args:
        api_key (str, optional): Your MBTA API key
    
    Returns:
        list: Consolidated list of stations with their lines and coordinates
    """
    # Dictionary to store stations: station_id -> station info
    # We use the station ID as key to consolidate stops across routes
    station_map = defaultdict(lambda: {
        "name": "",
        "latitude": None,
        "longitude": None,
        "routes": set()
    })
    
    print("Fetching subway stations from MBTA API...")
    
    # Query each subway route
    for route_id in SUBWAY_ROUTES:
        print(f"  Fetching stops for {route_id}...")
        route_name, stops = fetch_stops_for_route(route_id, api_key)
        
        # Add each stop to our consolidated map
        for stop in stops:
            stop_id = stop["id"]
            
            # Update station info (use first non-empty value found)
            if stop["name"] and not station_map[stop_id]["name"]:
                station_map[stop_id]["name"] = stop["name"]
            if stop["latitude"] is not None and station_map[stop_id]["latitude"] is None:
                station_map[stop_id]["latitude"] = stop["latitude"]
            if stop["longitude"] is not None and station_map[stop_id]["longitude"] is None:
                station_map[stop_id]["longitude"] = stop["longitude"]
            
            # Add this route to the station's route list
            station_map[stop_id]["routes"].add(route_name)
    
    print(f"Successfully fetched {len(station_map)} unique subway stations!")
    
    # Convert to list format for CSV
    stations = []
    for station_id, info in station_map.items():
        # Sort routes alphabetically for consistent output
        routes_list = sorted(info["routes"])
        
        stations.append({
            "station_name": info["name"],
            "subway_lines": ", ".join(routes_list),
            "latitude": info["latitude"] if info["latitude"] is not None else "",
            "longitude": info["longitude"] if info["longitude"] is not None else "",
        })
    
    # Sort stations alphabetically by name
    stations.sort(key=lambda x: x["station_name"])
    
    return stations

def save_to_csv(stations, filename="mbta_subway_stations.csv"):
    """
    Save the list of stations to a CSV file.
    
    Args:
        stations (list): List of station dictionaries
        filename (str): Output CSV filename
    """
    if not stations:
        print("No stations to save.")
        return
    
    try:
        with open(filename, "w", newline="", encoding="utf-8") as csvfile:
            fieldnames = ["station_name", "subway_lines", "latitude", "longitude"]
            
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(stations)
        
        print(f"Successfully saved {len(stations)} stations to '{filename}'")
        
    except IOError as e:
        print(f"Error writing to CSV file: {e}", file=sys.stderr)
        sys.exit(1)

def main():
    """
    Main function to fetch and save MBTA subway stations.
    """
    # Optional: Add your API key here
    api_key = ""
    
    stations = fetch_all_subway_stations(api_key)
    save_to_csv(stations)
    
    # Print some examples
    if stations:
        print(f"\nSample stations:")
        for station in stations[:5]:
            print(f"  - {station['station_name']}: {station['subway_lines']}")

if __name__ == "__main__":
    main()