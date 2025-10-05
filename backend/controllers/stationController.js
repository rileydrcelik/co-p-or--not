const Station = require('../models/Station');

/**
 * @route GET /api/stations
 * @description Get all subway stations
 * @access Public
 * 
 * @response {Object} 200 - Success response
 * @response {boolean} response.success - Always true
 * @response {Array} response.data - Array of station objects
 * @response {string} response.data[]._id - Station ID
 * @response {string} response.data[].name - Station name
 * @response {Array<string>} response.data[].train_lines - Array of subway lines serving this station
 * @response {Object} response.data[].coordinates - Station coordinates
 * @response {number} response.data[].coordinates.latitude - Station latitude
 * @response {number} response.data[].coordinates.longitude - Station longitude
 * @response {Object} response.data[].location - GeoJSON location for geospatial queries
 * @response {string} response.data[].location.type - Always "Point"
 * @response {Array<number>} response.data[].location.coordinates - [longitude, latitude]
 * @response {string} response.data[].createdAt - Creation timestamp
 * @response {string} response.data[].updatedAt - Last update timestamp
 * 
 * @response {Object} 500 - Error response
 * @response {boolean} response.success - Always false
 * @response {string} response.message - Error message
 * @response {string} response.error - Detailed error information
 */
const getAllStations = async (req, res) => {
    try {
        const stations = await Station.find();
        res.json({
            success: true,
            data: stations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching stations',
            error: error.message
        });
    }
};

/**
 * @route GET /api/stations/nearest
 * @description Find the nearest subway station to given coordinates
 * @access Public
 * 
 * @query {number} lat - User's latitude (required, -90 to 90)
 * @query {number} lng - User's longitude (required, -180 to 180)
 * 
 * @example /api/stations/nearest?lat=42.3601&lng=-71.0589
 * 
 * @response {Object} 200 - Success response
 * @response {boolean} response.success - Always true
 * @response {Object} response.data - Response data object
 * @response {Object} response.data.station - Nearest station information
 * @response {string} response.data.station._id - Station ID
 * @response {string} response.data.station.name - Station name
 * @response {Array<string>} response.data.station.train_lines - Array of subway lines
 * @response {Object} response.data.station.coordinates - Station coordinates
 * @response {number} response.data.station.coordinates.latitude - Station latitude
 * @response {number} response.data.station.coordinates.longitude - Station longitude
 * @response {Object} response.data.distance - Distance information
 * @response {number} response.data.distance.kilometers - Distance in kilometers (rounded to 2 decimals)
 * @response {number} response.data.distance.meters - Distance in meters (rounded)
 * @response {Object} response.data.userLocation - User's input coordinates
 * @response {number} response.data.userLocation.latitude - User's latitude
 * @response {number} response.data.userLocation.longitude - User's longitude
 * 
 * @response {Object} 400 - Bad request (missing or invalid coordinates)
 * @response {boolean} response.success - Always false
 * @response {string} response.message - Error message
 * @response {string} response.example - Example usage
 * 
 * @response {Object} 404 - No station found within 50km radius
 * @response {boolean} response.success - Always false
 * @response {string} response.message - Error message
 * 
 * @response {Object} 500 - Server error
 * @response {boolean} response.success - Always false
 * @response {string} response.message - Error message
 * @response {string} response.error - Detailed error information
 */
const getNearestStation = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        
        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude are required',
                example: '/api/stations/nearest?lat=42.3601&lng=-71.0589'
            });
        }
        
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid coordinates. Please provide valid numbers for latitude and longitude'
            });
        }
        
        if (latitude < -90 || latitude > 90) {
            return res.status(400).json({
                success: false,
                message: 'Latitude must be between -90 and 90 degrees'
            });
        }
        
        if (longitude < -180 || longitude > 180) {
            return res.status(400).json({
                success: false,
                message: 'Longitude must be between -180 and 180 degrees'
            });
        }
        
        const nearestStation = await Station.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    distanceField: 'distance',
                    spherical: true,
                    maxDistance: 50000,
                    distanceMultiplier: 0.001
                }
            },
            {
                $limit: 1
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    train_lines: 1,
                    coordinates: 1,
                    distance: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);
        
        if (nearestStation.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No stations found within 50km radius'
            });
        }
        
        const station = nearestStation[0];
        
        res.json({
            success: true,
            data: {
                station: {
                    _id: station._id,
                    name: station.name,
                    train_lines: station.train_lines,
                    coordinates: station.coordinates
                },
                distance: {
                    kilometers: Math.round(station.distance * 100) / 100,
                    meters: Math.round(station.distance * 1000)
                },
                userLocation: {
                    latitude: latitude,
                    longitude: longitude
                }
            }
        });
        
    } catch (error) {
        console.error('Error finding nearest station:', error);
        res.status(500).json({
            success: false,
            message: 'Error finding nearest station',
            error: error.message
        });
    }
};

module.exports = {
    getAllStations,
    getNearestStation
};