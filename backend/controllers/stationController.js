const Station = require('../models/Station');

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


module.exports = {
    getAllStations
};