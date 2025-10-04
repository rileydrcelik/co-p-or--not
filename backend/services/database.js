const mongoose = require('mongoose');
const config = require('../config');

const connectDB = async () => {
    try {
        // Use the MongoDB Atlas connection string from config
        const conn = await mongoose.connect(config.mongoURI, {
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true,
            }
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        await mongoose.connection.db.admin().ping();
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
