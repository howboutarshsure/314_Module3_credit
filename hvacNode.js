const express = require('express');

// Create an Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Initial HVAC settings
let hvacConfig = {
    temperature: 24,       // Default temperature
    ventilation: 'normal'  // Default ventilation setting
};

// Route to update HVAC settings
app.post('/set-hvac', (req, res) => {
    // Update the HVAC configuration with the received data
    hvacConfig = req.body;

    console.log('Received new HVAC settings:', hvacConfig);

    // Send a success response
    res.status(200).send('HVAC settings updated successfully');
});

// Route to get the current HVAC settings (optional)
app.get('/get-hvac', (req, res) => {
    // Return the current HVAC settings
    res.json(hvacConfig);
});

// Start the server for the HVAC Node
app.listen(4000, () => {
    console.log('HVAC node listening on port 4000');
});
