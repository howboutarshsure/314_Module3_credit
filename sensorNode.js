const axios = require('axios');

// Function to generate random sensor data
const generateSensorData = () => {
    return {
        temperature: (20 + Math.random() * 10).toFixed(2),  // Generates temperature between 20°C and 30°C
        humidity: (40 + Math.random() * 20).toFixed(2),     // Generates humidity between 40% and 60%
        chairsUsed: Math.floor(Math.random() * 10),         // Simulates chair usage between 0 and 10 chairs
        timestamp: new Date().toISOString()                 // Timestamp of the reading
    };
};

// Function to send the sensor data to the Edge Node
const sendSensorData = () => {
    const data = generateSensorData();

    // Send the data to the Edge Node (running on localhost:3000)
    axios.post('http://localhost:3000/sensor-data', data)
        .then(response => {
            console.log('Sensor data sent successfully:', data);
        })
        .catch(error => {
            console.error('Error sending sensor data:', error.message);
        });
};

// Simulate sensor data being sent every 5 seconds
setInterval(sendSensorData, 5000);  // Sends data every 5 seconds
