const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    station_name: {
        type: String,
        required: true,
        unique: true
    },
    subway_lines: {
        type: [String],
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    collection: 'boston_stations'
});

module.exports = mongoose.model('Station', stationSchema);
