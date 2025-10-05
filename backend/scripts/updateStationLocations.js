const mongoose = require('mongoose');
const Station = require('../models/Station');
const config = require('../config');

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB');
    await recreateStationCollection();
});

async function recreateStationCollection() {
    try {
        console.log('Recreating station collection with geospatial support...');
        
        const existingStations = await Station.find({});
        console.log(`Found ${existingStations.length} existing stations`);
        
        await Station.deleteMany({});
        console.log('Deleted all existing stations');
        
        const stationsToCreate = existingStations.map(station => ({
            name: station.name,
            train_lines: station.train_lines,
            coordinates: station.coordinates,
            location: {
                type: 'Point',
                coordinates: [station.coordinates.longitude, station.coordinates.latitude]
            }
        }));
        
        const createdStations = await Station.insertMany(stationsToCreate);
        console.log(`Successfully recreated ${createdStations.length} stations with geospatial data`);
        
        try {
            await Station.collection.createIndex({ location: '2dsphere' });
            console.log('Created 2dsphere index for location field');
        } catch (error) {
            if (error.code === 85) {
                console.log('2dsphere index already exists');
            } else {
                console.error('Error creating index:', error.message);
            }
        }
        
        const sampleStation = await Station.findOne({});
        if (sampleStation && sampleStation.location) {
            console.log(`\nSample station with geospatial data:`);
            console.log(`- Name: ${sampleStation.name}`);
            console.log(`- Location: ${JSON.stringify(sampleStation.location)}`);
        }
        
        console.log('\nStation collection recreation completed successfully!');
        mongoose.connection.close();
        
    } catch (error) {
        console.error('Error recreating station collection:', error);
        mongoose.connection.close();
    }
}
