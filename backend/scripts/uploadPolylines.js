const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Polyline = require('../models/Polyline');
const config = require('../config');

// Connect to MongoDB
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
    uploadPolylines();
});

async function uploadPolylines() {
    try {
        // Clear existing polylines
        await Polyline.deleteMany({});
        console.log('Cleared existing polylines');

        const polylines = new Map(); // Use Map to group coordinates by route_id and shape_id
        
        // Read CSV file
        fs.createReadStream('AutomationScripts/mbta_subway_polylines.csv')
            .pipe(csv())
            .on('data', (row) => {
                const key = `${row.route_id}-${row.shape_id}`;
                
                if (!polylines.has(key)) {
                    polylines.set(key, {
                        route_id: row.route_id,
                        shape_id: row.shape_id,
                        coordinates: []
                    });
                }
                
                polylines.get(key).coordinates.push({
                    latitude: parseFloat(row.latitude),
                    longitude: parseFloat(row.longitude),
                    point_sequence: parseInt(row.point_sequence)
                });
            })
            .on('end', async () => {
                console.log(`Processed ${polylines.size} polyline shapes`);
                
                // Sort coordinates by point_sequence for each polyline
                for (const polyline of polylines.values()) {
                    polyline.coordinates.sort((a, b) => a.point_sequence - b.point_sequence);
                }
                
                // Insert all polylines
                const polylineArray = Array.from(polylines.values());
                await Polyline.insertMany(polylineArray);
                
                console.log(`Successfully uploaded ${polylineArray.length} polylines to MongoDB`);
                
                // Print summary by route
                const routeCounts = {};
                polylineArray.forEach(p => {
                    routeCounts[p.route_id] = (routeCounts[p.route_id] || 0) + 1;
                });
                
                console.log('\nPolyline counts by route:');
                Object.entries(routeCounts).forEach(([route, count]) => {
                    console.log(`  ${route}: ${count} shapes`);
                });
                
                mongoose.connection.close();
            })
            .on('error', (error) => {
                console.error('Error reading CSV:', error);
                mongoose.connection.close();
            });
            
    } catch (error) {
        console.error('Error uploading polylines:', error);
        mongoose.connection.close();
    }
}
