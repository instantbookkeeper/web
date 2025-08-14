const express = require('express');
const router = express.Router();
const { getWebToolsData, getGoogleSheetsData, getOverviewData, getPeopleData } = require('@services/sheetsService');
    router.get('/', async (req, res) => {
        try {
            const overviewData = await getOverviewData();
            const appsData = await getWebToolsData();
            const googleSheetsData = await getGoogleSheetsData(); 
            const peopleData = await getPeopleData();
            res.render('index', {
                overviewData,
                appsData,
                googleSheetsData,
                peopleData,
                errorMessage: null
            });
        } catch (error) {
            res.render('index', {
                overviewData: [],
                appsData: [],
                googleSheetsData: [],
                peopleData: [],
                errorMessage: 'Unable to fetch data at the moment. Please try again later.'
                
            // errorMessage: `Unable to fetch data at the moment. Please try again later.${error.message}`
            });
        }
    });
module.exports = router;
