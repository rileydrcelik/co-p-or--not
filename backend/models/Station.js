const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    train_lines: {
        type: [String],
        required: true
    },
    coordinates: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    }
}, {
    timestamps: true,
    collection: 'stations'
});

module.exports = mongoose.model('Station', stationSchema);

