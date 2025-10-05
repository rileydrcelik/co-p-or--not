const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportConroller');
const polylineController = require('../controllers/polylineController');
const stationController = require('../controllers/stationController');

router.post('/reports', reportController.createReport);
router.get('/reports', reportController.getAllReports);
router.get('/reports/presence/:presence', reportController.getReportsByPresence);
router.get('/reports/station/:stationId', reportController.getReportsByStation);
router.get('/reports/:id', reportController.getReportById);

router.get('/polylines', polylineController.getAllPolylines);
router.get('/polylines/route/:routeId', polylineController.getPolylinesByRoute);

router.get('/stations', stationController.getAllStations);
router.get('/stations/nearest', stationController.getNearestStation);

module.exports = router;
