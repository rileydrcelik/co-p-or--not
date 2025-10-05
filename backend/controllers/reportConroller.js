const Report = require('../models/Report');

/**
 * @route POST /api/reports
 * @description Create a new police presence report
 * @access Public
 * 
 * @body {Object} request.body - Report data
 * @body {boolean} request.body.presence - Whether police presence was observed (true/false)
 * @body {string} request.body.station - Station ID (ObjectId reference to Station model)
 * 
 * @example request.body:
 * {
 *   "presence": true,
 *   "station": "68e1d551896aa9877fde4e36"
 * }
 * 
 * @response {Object} 201 - Success response
 * @response {boolean} response.success - Always true
 * @response {string} response.message - Success message
 * @response {Object} response.data - Created report object
 * @response {string} response.data._id - Report ID
 * @response {boolean} response.data.presence - Police presence status
 * @response {string} response.data.station - Station ID reference
 * @response {string} response.data.reportedAt - Report timestamp
 * @response {string} response.data.createdAt - Creation timestamp
 * @response {string} response.data.updatedAt - Last update timestamp
 * 
 * @response {Object} 500 - Error response
 * @response {boolean} response.success - Always false
 * @response {string} response.message - Error message
 * @response {string} response.error - Detailed error information
 */
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

/**
 * @route GET /api/reports
 * @description Get all reports with pagination and sorting
 * @access Public
 * 
 * @query {number} [page=1] - Page number for pagination
 * @query {number} [limit=10] - Number of reports per page
 * @query {string} [sortBy=reportedAt] - Field to sort by
 * @query {string} [sortOrder=desc] - Sort order (asc/desc)
 * 
 * @example /api/reports?page=1&limit=5&sortBy=reportedAt&sortOrder=desc
 * 
 * @response {Object} 200 - Success response
 * @response {boolean} response.success - Always true
 * @response {Array} response.data - Array of report objects
 * @response {string} response.data[]._id - Report ID
 * @response {boolean} response.data[].presence - Police presence status
 * @response {string} response.data[].station - Station ID reference
 * @response {string} response.data[].reportedAt - Report timestamp
 * @response {string} response.data[].createdAt - Creation timestamp
 * @response {string} response.data[].updatedAt - Last update timestamp
 * @response {Object} response.pagination - Pagination information
 * @response {number} response.pagination.currentPage - Current page number
 * @response {number} response.pagination.totalPages - Total number of pages
 * @response {number} response.pagination.totalReports - Total number of reports
 * @response {boolean} response.pagination.hasNext - Whether there's a next page
 * @response {boolean} response.pagination.hasPrev - Whether there's a previous page
 * 
 * @response {Object} 500 - Error response
 * @response {boolean} response.success - Always false
 * @response {string} response.message - Error message
 * @response {string} response.error - Detailed error information
 */
const getAllReports = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'reportedAt',
            sortOrder = 'desc'
        } = req.query;

        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const reports = await Report.find()
            .populate('station', 'name train_lines coordinates')
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

/**
 * @route GET /api/reports/:id
 * @description Get a specific report by ID
 * @access Public
 * 
 * @param {string} id - Report ID (MongoDB ObjectId)
 * 
 * @example /api/reports/68e09572b5fc17afd33c4dc4
 * 
 * @response {Object} 200 - Success response
 * @response {boolean} response.success - Always true
 * @response {Object} response.data - Report object
 * @response {string} response.data._id - Report ID
 * @response {boolean} response.data.presence - Police presence status
 * @response {string} response.data.station - Station ID reference
 * @response {string} response.data.reportedAt - Report timestamp
 * @response {string} response.data.createdAt - Creation timestamp
 * @response {string} response.data.updatedAt - Last update timestamp
 * 
 * @response {Object} 404 - Report not found
 * @response {boolean} response.success - Always false
 * @response {string} response.message - Error message
 * 
 * @response {Object} 500 - Error response
 * @response {boolean} response.success - Always false
 * @response {string} response.message - Error message
 * @response {string} response.error - Detailed error information
 */
const getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id).populate('station', 'name train_lines coordinates');
        
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

/**
 * @route GET /api/reports/presence/:presence
 * @description Get reports filtered by police presence status
 * @access Public
 * 
 * @param {string} presence - Police presence status ("true" or "false")
 * 
 * @example /api/reports/presence/true
 * @example /api/reports/presence/false
 * 
 * @response {Object} 200 - Success response
 * @response {boolean} response.success - Always true
 * @response {Array} response.data - Array of filtered report objects
 * @response {string} response.data[]._id - Report ID
 * @response {boolean} response.data[].presence - Police presence status
 * @response {string} response.data[].station - Station ID reference
 * @response {string} response.data[].reportedAt - Report timestamp
 * @response {string} response.data[].createdAt - Creation timestamp
 * @response {string} response.data[].updatedAt - Last update timestamp
 * @response {number} response.count - Number of reports found
 * 
 * @response {Object} 500 - Error response
 * @response {boolean} response.success - Always false
 * @response {string} response.message - Error message
 * @response {string} response.error - Detailed error information
 */
const getReportsByPresence = async (req, res) => {
    try {
        const { presence } = req.params;
        const reports = await Report.find({ presence: presence === 'true' })
            .populate('station', 'name train_lines coordinates')
            .sort({ reportedAt: -1 });

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

/**
 * @route GET /api/reports/station/:stationName
 * @description Get reports for a specific station by station name
 * @access Public
 * 
 * @param {string} stationName - Name of the station
 * 
 * @example /api/reports/station/Government Center
 * 
 * @response {Object} 200 - Success response
 * @response {boolean} response.success - Always true
 * @response {Array} response.data - Array of reports for the station
 * @response {string} response.data[]._id - Report ID
 * @response {boolean} response.data[].presence - Police presence status
 * @response {string} response.data[].station - Station ID reference
 * @response {string} response.data[].reportedAt - Report timestamp
 * @response {string} response.data[].createdAt - Creation timestamp
 * @response {string} response.data[].updatedAt - Last update timestamp
 * @response {number} response.count - Number of reports found
 * 
 * @response {Object} 500 - Error response
 * @response {boolean} response.success - Always false
 * @response {string} response.message - Error message
 * @response {string} response.error - Detailed error information
 */
const getReportsByStation = async (req, res) => {
    try {
        const { stationName } = req.params;
        const reports = await Report.find({ 'station.name': stationName })
            .populate('station', 'name train_lines coordinates')
            .sort({ reportedAt: -1 });

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