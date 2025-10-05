const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    presence: {
        type: Boolean,
        required: true
    },
    station: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        required: true
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
