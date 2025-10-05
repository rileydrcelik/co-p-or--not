const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Station = require('../models/Station');
const config = require('../config');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

const uploadStations = async (csvFilePath) => {
    const stations = [];
    
    return new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                if (!row.station_name || !row.latitude || !row.longitude) {
                    return;
                }
                
                const subwayLines = row.subway_lines ? 
                    row.subway_lines.split(',').map(line => line.trim()) : [];
                
                const latitude = parseFloat(row.latitude);
                const longitude = parseFloat(row.longitude);
                
                stations.push({
                    name: row.station_name.trim(),
                    train_lines: subwayLines,
                    coordinates: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    location: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    }
                });
            })
            .on('end', async () => {
                try {
                    console.log(`Processing ${stations.length} stations...`);
                    
                    await Station.deleteMany({});
                    console.log('Cleared existing stations');
                    
                    const result = await Station.insertMany(stations);
                    console.log(`Successfully uploaded ${result.length} stations`);
                    
                    console.log('\nSample stations uploaded:');
                    result.slice(0, 5).forEach(station => {
                        console.log(`- ${station.name}: ${station.train_lines.join(', ')}`);
                    });
                    
                    resolve(result);
                } catch (error) {
                    console.error('Error uploading stations:', error);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('Error reading CSV:', error);
                reject(error);
            });
    });
};

// Main function
const main = async () => {
    await connectDB();
    
    const csvFilePath = process.argv[2];
    if (!csvFilePath) {
        console.error('Please provide CSV file path');
        console.log('Usage: node uploadStations.js path/to/cleaned_stations.csv');
        process.exit(1);
    }
    
    try {
        console.log(`Uploading stations from: ${csvFilePath}`);
        await uploadStations(csvFilePath);
        console.log('Upload completed successfully');
    } catch (error) {
        console.error('Upload failed:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

main();