require('dotenv').config();
require('module-alias/register');
const express = require('express');
const app = express();
const path = require('path');
const indexRoutes = require('@routes/index');
const fs = require('fs');

// Middleware
app.use(express.json());
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Routes
app.use('/', indexRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
