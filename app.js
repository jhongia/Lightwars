// Assuming you have already required necessary modules
const mongoose = require('mongoose');  
const express = require('express');
const app = express();

// Setting mongoose to use strict query by default
mongoose.set('strictQuery', false);

// Example of converting the previous callback-based methods to async/await
app.post('/some-endpoint', async (req, res) => {
    try {
        // Example of async Mongoose call
        const result = await SomeModel.find({}); // Replace `SomeModel` with actual model
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update req.logOut() to req.logout()
app.get('/logout', (req, res) => {
    req.logout(); // Corrected method
    res.redirect('/');
});

// Other routes and middleware...

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});