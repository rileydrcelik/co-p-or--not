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
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, {
    timestamps: true,
    collection: 'stations'
});

stationSchema.index({ location: '2dsphere' });

stationSchema.pre('save', function(next) {
    if (this.coordinates && this.coordinates.latitude && this.coordinates.longitude) {
        this.location = {
            type: 'Point',
            coordinates: [this.coordinates.longitude, this.coordinates.latitude]
        };
    }
    next();
});

module.exports = mongoose.model('Station', stationSchema);

