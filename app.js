const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Visitor';
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Using a mock IP for location and weather data for demonstration purposes
    const ip = '8.8.8.8';  // Google's public DNS server IP

    try {
        // Get location based on IP
        const locationResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
        const locationData = locationResponse.data;
        const city = locationData.city || 'Unknown';

        console.log(`City determined from IP: ${city}`);

        // Get weather data for the location
        const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=bee6d682ed6101d752c053c899a589af&units=metric`);
        const weatherData = weatherResponse.data;
        const temperature = weatherResponse.data.main.temp;
    


        const greeting = `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${city}`;

        res.json({
            client_ip: clientIp,
            location: city,
            greeting: greeting
        });
    } catch (error) {
        // Log detailed error information
        console.error('Error retrieving data:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
