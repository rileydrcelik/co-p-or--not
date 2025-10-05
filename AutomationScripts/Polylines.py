import requests
import json
import sys
import polyline

# MBTA API base URL
BASE_URL = "https://api-v3.mbta.com"

# Define the subway routes (same as before)
SUBWAY_ROUTES = [
    "Red",
    "Orange",
    "Blue",
    "Green-B",
    "Green-C",
    "Green-D",
    "Green-E"
]

def get_canonical_shape_ids_for_route(route_id, api_key=None):
    """
    Get shape IDs for the canonical route patterns of a given route.
    
    Canonical route patterns are the "reference" or "main" patterns for a route.
    Instead of getting every possible trip variation, we only get the primary
    representative paths. This is perfect for map display.
    
    We query the /route_patterns endpoint with filter[canonical]=true to get
    only the canonical patterns, which have relationships to shapes.
    
    Args:
        route_id (str): The route ID (e.g., "Red", "Orange")
        api_key (str, optional): Your MBTA API key
    
    Returns:
        set: A set of shape IDs for canonical patterns only
    """
    endpoint = f"{BASE_URL}/route_patterns"
    
    params = {
        "filter[route]": route_id,
        "filter[canonical]": "true",  # Only get canonical patterns
        "include": "representative_trip",  # Include the representative trip
    }
    
    headers = {}
    if api_key:
        headers["x-api-key"] = api_key
    
    try:
        response = requests.get(endpoint, params=params, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        
        # Collect shape IDs from the canonical route patterns
        shape_ids = set()
        
        if "data" in data:
            for pattern in data["data"]:
                # Each canonical pattern has a representative_trip relationship
                relationships = pattern.get("relationships", {})
                rep_trip_data = relationships.get("representative_trip", {}).get("data")
                
                if rep_trip_data:
                    rep_trip_id = rep_trip_data.get("id")
                    
                    # Find the representative trip in the included data
                    if "included" in data:
                        for item in data["included"]:
                            if item.get("type") == "trip" and item.get("id") == rep_trip_id:
                                # Get the shape from this trip
                                trip_relationships = item.get("relationships", {})
                                shape_data = trip_relationships.get("shape", {}).get("data")
                                
                                if shape_data:
                                    shape_id = shape_data.get("id")
                                    if shape_id:
                                        shape_ids.add(shape_id)
        
        return shape_ids
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching canonical shape IDs for route {route_id}: {e}", file=sys.stderr)
        return set()

def get_shape_polyline(shape_id, api_key=None):
    """
    Get the encoded polyline for a specific shape ID.
    
    The MBTA API returns shapes with an encoded polyline attribute.
    This is a compressed string representation of the route's coordinates.
    
    Args:
        shape_id (str): The shape ID to fetch
        api_key (str, optional): Your MBTA API key
    
    Returns:
        str or None: The encoded polyline string, or None if not found
    """
    endpoint = f"{BASE_URL}/shapes/{shape_id}"
    
    headers = {}
    if api_key:
        headers["x-api-key"] = api_key
    
    try:
        response = requests.get(endpoint, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        
        # Extract the encoded polyline from the shape data
        if "data" in data:
            attributes = data["data"].get("attributes", {})
            return attributes.get("polyline")
        
        return None
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching shape {shape_id}: {e}", file=sys.stderr)
        return None

def decode_polyline_to_coords(encoded_polyline):
    """
    Decode an encoded polyline string into coordinate pairs.
    
    The polyline module handles the decoding algorithm. It converts
    the compressed string back into a list of (latitude, longitude) tuples.
    
    Args:
        encoded_polyline (str): The encoded polyline string from the API
    
    Returns:
        list: A list of (latitude, longitude) tuples
    """
    try:
        # The polyline.decode() function returns a list of (lat, lon) tuples
        coords = polyline.decode(encoded_polyline)
        return coords
    except Exception as e:
        print(f"Error decoding polyline: {e}", file=sys.stderr)
        return []

def fetch_all_subway_polylines(api_key=None):
    """
    Fetch polylines for canonical route patterns of all subway routes.
    
    This function gets only the canonical (main/representative) patterns
    for each route, making it perfect for map display without cluttering
    with every possible trip variation.
    
    This function orchestrates the entire process:
    1. For each subway route, get canonical route pattern shape IDs
    2. For each shape ID, fetch the encoded polyline
    3. Decode the polyline into coordinate pairs
    4. Organize everything by route
    
    Args:
        api_key (str, optional): Your MBTA API key
    
    Returns:
        dict: Dictionary mapping route IDs to their polyline data
              Format: {
                  "route_id": {
                      "route_name": "Red Line",
                      "shapes": [
                          {
                              "shape_id": "010091",
                              "coordinates": [(lat1, lon1), (lat2, lon2), ...]
                          },
                          ...
                      ]
                  },
                  ...
              }
    """
    all_polylines = {}
    
    print("Fetching canonical subway polylines from MBTA API...\n")
    
    for route_id in SUBWAY_ROUTES:
        print(f"Processing {route_id}...")
        
        # Get canonical shape IDs for this route
        shape_ids = get_canonical_shape_ids_for_route(route_id, api_key)
        print(f"  Found {len(shape_ids)} canonical shapes for {route_id}")
        
        route_shapes = []
        
        # Fetch and decode each shape
        for shape_id in shape_ids:
            print(f"  Fetching shape {shape_id}...")
            
            # Get the encoded polyline
            encoded_polyline = get_shape_polyline(shape_id, api_key)
            
            if encoded_polyline:
                # Decode it into coordinates
                coordinates = decode_polyline_to_coords(encoded_polyline)
                
                if coordinates:
                    route_shapes.append({
                        "shape_id": shape_id,
                        "coordinates": coordinates,
                        "num_points": len(coordinates)
                    })
                    print(f"    Decoded {len(coordinates)} coordinate points")
        
        # Store the route data
        all_polylines[route_id] = {
            "route_name": route_id,
            "shapes": route_shapes
        }
        
        print(f"  Total canonical shapes decoded for {route_id}: {len(route_shapes)}\n")
    
    return all_polylines

def save_polylines_to_json(polylines_data, filename="mbta_subway_polylines.json"):
    """
    Save the polyline coordinate data to a JSON file.
    
    JSON is a good format for this because:
    - It preserves the nested structure (routes → shapes → coordinates)
    - It's easy for your friend to parse in any language
    - It's human-readable for debugging
    
    Args:
        polylines_data (dict): The polyline data from fetch_all_subway_polylines()
        filename (str): Output JSON filename
    """
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(polylines_data, f, indent=2)
        
        print(f"Successfully saved polyline data to '{filename}'")
        
        # Print summary statistics
        total_shapes = sum(len(route["shapes"]) for route in polylines_data.values())
        total_points = sum(
            shape["num_points"] 
            for route in polylines_data.values() 
            for shape in route["shapes"]
        )
        
        print(f"\nSummary:")
        print(f"  Total routes: {len(polylines_data)}")
        print(f"  Total shapes: {total_shapes}")
        print(f"  Total coordinate points: {total_points}")
        
    except IOError as e:
        print(f"Error writing to JSON file: {e}", file=sys.stderr)
        sys.exit(1)

def save_polylines_to_csv(polylines_data, filename="mbta_subway_polylines.csv"):
    """
    Save the polyline coordinate data to a CSV file (flattened format).
    
    This creates a "flat" CSV where each row is a single coordinate point.
    Good if your friend's renderer prefers tabular data.
    
    Format:
    route_id,shape_id,point_sequence,latitude,longitude
    
    Args:
        polylines_data (dict): The polyline data from fetch_all_subway_polylines()
        filename (str): Output CSV filename
    """
    import csv
    
    try:
        with open(filename, "w", newline="", encoding="utf-8") as csvfile:
            fieldnames = ["route_id", "shape_id", "point_sequence", "latitude", "longitude"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            # Flatten the nested structure into rows
            for route_id, route_data in polylines_data.items():
                for shape in route_data["shapes"]:
                    shape_id = shape["shape_id"]
                    
                    # Each coordinate becomes a row
                    for idx, (lat, lon) in enumerate(shape["coordinates"]):
                        writer.writerow({
                            "route_id": route_id,
                            "shape_id": shape_id,
                            "point_sequence": idx,  # Order matters for drawing lines
                            "latitude": lat,
                            "longitude": lon
                        })
        
        print(f"Successfully saved polyline data to '{filename}'")
        
    except IOError as e:
        print(f"Error writing to CSV file: {e}", file=sys.stderr)
        sys.exit(1)

def main():
    """
    Main function to fetch and save MBTA subway polylines.
    """
    # Optional: Add your API key here
    api_key = "60e367fc51784f93a4a7a1ad5e7c46a0"
    
    # Fetch all polyline data
    polylines_data = fetch_all_subway_polylines(api_key)
    
    # Save in both formats - pick what works best for your friend!
    print("\nSaving data...")
    save_polylines_to_json(polylines_data)
    save_polylines_to_csv(polylines_data)

if __name__ == "__main__":
    main()