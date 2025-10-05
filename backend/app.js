const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.use(helmet());
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
    'http://localhost:3000',
    `http://localhost:${PORT}`,
    'http://10.110.89.134:3000',
    `http://10.110.89.134:${PORT}`,
    'exp://10.110.89.134:8081'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const routes = require('./routes');
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to CoporNot API',
        version: '1.0.0',
        status: 'running'
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

app.use(routes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

app.use('*', (req, res) => {
    res.status(404).json({ 
        message: 'Route not found' 
    });
});

module.exports = app;