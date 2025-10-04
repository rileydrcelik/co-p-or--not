const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportConroller');

// Report routes
router.post('/reports', reportController.createReport);
router.get('/reports', reportController.getAllReports);
router.get('/reports/presence/:presence', reportController.getReportsByPresence);
router.get('/reports/station/:stationName', reportController.getReportsByStation);
router.get('/reports/:id', reportController.getReportById);

module.exports = router;
