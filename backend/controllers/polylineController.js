const Polyline = require('../models/Polyline');

// Get all polylines grouped by route
const getAllPolylines = async (req, res) => {
    try {
        const polylines = await Polyline.find({}).sort({ route_id: 1, shape_id: 1 });
        
        // Group polylines by route_id
        const groupedPolylines = {};
        polylines.forEach(polyline => {
            if (!groupedPolylines[polyline.route_id]) {
                groupedPolylines[polyline.route_id] = [];
            }
            groupedPolylines[polyline.route_id].push({
                shape_id: polyline.shape_id,
                coordinates: polyline.coordinates.map(coord => ({
                    lat: coord.latitude,
                    lng: coord.longitude
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

// Get polylines for a specific route
const getPolylinesByRoute = async (req, res) => {
    try {
        const { routeId } = req.params;
        
        const polylines = await Polyline.find({ route_id: routeId }).sort({ shape_id: 1 });
        
        const formattedPolylines = polylines.map(polyline => ({
            shape_id: polyline.shape_id,
            coordinates: polyline.coordinates.map(coord => ({
                lat: coord.latitude,
                lng: coord.longitude
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
