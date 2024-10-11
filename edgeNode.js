const express = require('express');
const axios = require('axios');
const { MongoClient } = require('mongodb');

// MongoDB connection string (replace with your actual connection details)
const uri = 'mongodb+srv://arshsure:Ogy6bgQbgZ1x5zhY@sit314.fyt3r.mongodb.net/hvac_logs?retryWrites=true&w=majority';

let db; // Variable to store the MongoDB connection

// Create an Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Connect to MongoDB Atlas (without deprecated options)
MongoClient.connect(uri)
    .then(client => {
        db = client.db('hvac_logs');
        console.log('Connected to MongoDB Atlas');
    })
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Route to receive sensor data from the room sensor nodes
app.post('/sensor-data', async (req, res) => {
    const { temperature, humidity, chairsUsed } = req.body;
    
    console.log('Received sensor data:', req.body);

    // Default HVAC configuration
    let hvacConfig = { temperature: 24, ventilation: 'normal' };

    // Adjust HVAC settings based on sensor data
    if (temperature > 25 || chairsUsed > 5) {
        hvacConfig.temperature = 22;  // Set cooler temperature
        hvacConfig.ventilation = 'high';
    } else if (temperature < 20) {
        hvacConfig.temperature = 26;  // Set warmer temperature
        hvacConfig.ventilation = 'low';
    }

    try {
        // Send HVAC configuration to the HVAC node
        const hvacResponse = await axios.post('http://localhost:4000/set-hvac', hvacConfig);
        console.log('HVAC configuration updated:', hvacConfig);

        // Log the request and status change in MongoDB
        const logEntry = {
            sensorData: req.body,
            hvacConfig,
            timestamp: new Date()
        };

        db.collection('logs').insertOne(logEntry)
            .then(() => console.log('Log entry saved to MongoDB'))
            .catch(err => console.error('Error saving log to MongoDB:', err));

        res.status(200).send('Sensor data processed successfully');
    } catch (error) {
        console.error('Error adjusting HVAC:', error);
        res.status(500).send('Failed to adjust HVAC settings');
    }
});

// Start the server for the Edge Node
app.listen(3000, () => {
    console.log('Edge node listening on port 3000');
});
