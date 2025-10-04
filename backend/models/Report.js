const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    presence: {
        type: Boolean,
        required: true
    },
    station: {
        name: {
            type: String,
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
    },
        reportedAt: {
        type: Date,
        default: Date.now
    },

}, {
    timestamps: true,
    collection: 'boston_reports'
});


module.exports = mongoose.model('Report', reportSchema);
