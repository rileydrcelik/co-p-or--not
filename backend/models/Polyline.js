const mongoose = require('mongoose');

const polylineSchema = new mongoose.Schema({
    route_id: {
        type: String,
        required: true,
        enum: ['Red', 'Orange', 'Blue', 'Green-B', 'Green-C', 'Green-D', 'Green-E']
    },
    shape_id: {
        type: String,
        required: true
    },
    coordinates: [{
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        point_sequence: {
            type: Number,
            required: true
        }
    }]
}, {
    timestamps: true,
    collection: 'boston_polylines'
});

polylineSchema.index({ route_id: 1, shape_id: 1 });

module.exports = mongoose.model('Polyline', polylineSchema);
