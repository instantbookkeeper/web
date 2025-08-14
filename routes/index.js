const express = require('express');
const router = express.Router();
const { getWebToolsData, getGoogleSheetsData, getOverviewData } = require('@services/sheetsService');
    router.get('/', async (req, res) => {
        try {
            const overviewData = await getOverviewData();
            const appsData = await getWebToolsData();
            const googleSheetsData = await getGoogleSheetsData(); 
            // const getPeopleData = await getPeopleData();
            res.render('index', {
                overviewData,
                appsData,
                googleSheetsData,
                // getPeopleData,
                hasData: !!appsData,
                errorMessage: null
            });
        } catch (error) {
        console.error('Error fetching sheet data:', error);
        res.render('index', {
            overviewData: [],
            appsData: [],
            googleSheetsData: [],
            hasData: false,
            errorMessage: 'Unable to fetch data at the moment. Please try again later.'
            // errorMessage: `Unable to fetch data at the moment. Please try again later.${error.message}`
        });
        }
    });
module.exports = router;
