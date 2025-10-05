const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportConroller');
const polylineController = require('../controllers/polylineController');

// Report routes
router.post('/reports', reportController.createReport);
router.get('/reports', reportController.getAllReports);
router.get('/reports/presence/:presence', reportController.getReportsByPresence);
router.get('/reports/station/:stationName', reportController.getReportsByStation);
router.get('/reports/:id', reportController.getReportById);

// Polyline routes
router.get('/polylines', polylineController.getAllPolylines);
router.get('/polylines/route/:routeId', polylineController.getPolylinesByRoute);

module.exports = router;
