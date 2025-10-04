const Report = require('../models/Report');

// Create a new report
const createReport = async (req, res) => {
    try {
        const report = new Report(req.body);
        await report.save();
        
        res.status(201).json({
            success: true,
            message: 'Report created successfully',
            data: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating report',
            error: error.message
        });
    }
};

// Get all reports with pagination
const getAllReports = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'reportedAt',
            sortOrder = 'desc'
        } = req.query;

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const reports = await Report.find()
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Report.countDocuments();

        res.json({
            success: true,
            data: reports,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalReports: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching reports',
            error: error.message
        });
    }
};

// Get report by ID
const getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        
        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching report',
            error: error.message
        });
    }
};

const getReportsByPresence = async (req, res) => {
    try {
        const { presence } = req.params;
        const reports = await Report.find({ presence: presence === 'true' }).sort({ reportedAt: -1 });

        res.json({
            success: true,
            data: reports,
            count: reports.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching reports by presence',
            error: error.message
        });
    }
};

// Get reports by station name
const getReportsByStation = async (req, res) => {
    try {
        const { stationName } = req.params;
        const reports = await Report.find({ 'station.name': stationName }).sort({ reportedAt: -1 });

        res.json({
            success: true,
            data: reports,
            count: reports.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching reports by station',
            error: error.message
        });
    }
};

module.exports = {
    createReport,
    getAllReports,
    getReportById,
    getReportsByPresence,
    getReportsByStation
};