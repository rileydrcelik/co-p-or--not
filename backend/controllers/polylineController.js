const Polyline = require('../models/Polyline');

/**
 * @route GET /api/polylines
 * @description Get all subway line polylines grouped by route
 * @access Public
 * 
 * @response {Object} 200 - Success response
 * @response {boolean} response.success - Always true
 * @response {Object} response.data - Object with route IDs as keys
 * @response {Array} response.data[routeId] - Array of polyline shapes for the route
 * @response {string} response.data[routeId][].shape_id - Unique identifier for the polyline shape
 * @response {Array} response.data[routeId][].coordinates - Array of coordinate objects
 * @response {number} response.data[routeId][].coordinates[].lat - Latitude coordinate
 * @response {number} response.data[routeId][].coordinates[].lng - Longitude coordinate
 * 
 * @example response.data structure:
 * {
 *   "Red": [
 *     {
 *       "shape_id": "canonical-931_0009",
 *       "coordinates": [
 *         {"lat": 42.39615, "lng": -71.14208},
 *         {"lat": 42.39619, "lng": -71.13955}
 *       ]
 *     }
 *   ],
 *   "Blue": [...],
 *   "Orange": [...]
 * }
 * 
 * @response {Object} 500 - Error response
 * @response {boolean} response.success - Always false
 * @response {string} response.message - Error message
 * @response {string} response.error - Detailed error information
 */
const getAllPolylines = async (req, res) => {
    try {
        const polylines = await Polyline.find({}).sort({ route_id: 1, shape_id: 1 });
        
        const groupedPolylines = {};
        polylines.forEach(polyline => {
            if (!groupedPolylines[polyline.route_id]) {
                groupedPolylines[polyline.route_id] = [];
            }
            groupedPolylines[polyline.route_id].push({
                shape_id: polyline.shape_id,
                coordinates: polyline.coordinates.map(coord => ({
                    latitude: coord.latitude,
                    longitude: coord.longitude
                }))
            });
        });
        
        res.status(200).json({
            success: true,
            data: groupedPolylines
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching polylines',
            error: error.message
        });
    }
};

/**
 * @route GET /api/polylines/route/:routeId
 * @description Get polylines for a specific subway route
 * @access Public
 * 
 * @param {string} routeId - Route identifier (Red, Orange, Blue, Green-B, Green-C, Green-D, Green-E)
 * 
 * @response {Object} 200 - Success response
 * @response {boolean} response.success - Always true
 * @response {Array} response.data - Array of polyline shapes for the specified route
 * @response {string} response.data[].shape_id - Unique identifier for the polyline shape
 * @response {Array} response.data[].coordinates - Array of coordinate objects
 * @response {number} response.data[].coordinates[].lat - Latitude coordinate
 * @response {number} response.data[].coordinates[].lng - Longitude coordinate
 * 
 * @example /api/polylines/route/Red
 * @example response.data structure:
 * [
 *   {
 *     "shape_id": "canonical-931_0009",
 *     "coordinates": [
 *       {"lat": 42.39615, "lng": -71.14208},
 *       {"lat": 42.39619, "lng": -71.13955}
 *     ]
 *   }
 * ]
 * 
 * @response {Object} 500 - Error response
 * @response {boolean} response.success - Always false
 * @response {string} response.message - Error message
 * @response {string} response.error - Detailed error information
 */
const getPolylinesByRoute = async (req, res) => {
    try {
        const { routeId } = req.params;
        
        const polylines = await Polyline.find({ route_id: routeId }).sort({ shape_id: 1 });
        
        const formattedPolylines = polylines.map(polyline => ({
            shape_id: polyline.shape_id,
            coordinates: polyline.coordinates.map(coord => ({
                latitude: coord.latitude,
                longitude: coord.longitude
            }))
        }));
        
        res.status(200).json({
            success: true,
            data: formattedPolylines
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching polylines for route',
            error: error.message
        });
    }
};

module.exports = {
    getAllPolylines,
    getPolylinesByRoute
};
